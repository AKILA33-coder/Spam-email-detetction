from datetime import datetime
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from database import analytics, clear_history, dashboard_stats, fetch_history, init_db, insert_prediction
from model import MODEL_PATH, train_model, predict_message


BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIST = BASE_DIR.parent / "frontend" / "dist"

app = Flask(__name__, static_folder=str(FRONTEND_DIST), static_url_path="")
CORS(app)
init_db()
MODEL_BUNDLE = train_model()


@app.get("/")
def index():
    index_file = FRONTEND_DIST / "index.html"
    if index_file.exists():
        return send_from_directory(FRONTEND_DIST, "index.html")

    return jsonify(
        {
            "service": "NeuroShield Spam Detection API",
            "status": "online",
            "model_ready": MODEL_PATH.exists(),
            "frontend": "Run npm build in frontend folder to serve UI from Flask.",
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
    )


@app.post("/api/predict")
def predict():
    payload = request.get_json(silent=True) or {}
    message = (payload.get("message") or "").strip()
    if not message:
        return jsonify({"error": "Email message is required."}), 400

    result = predict_message(message)
    record_id = insert_prediction(
        email_message=message,
        prediction=result["prediction"],
        confidence_score=result["confidence_score"],
        spam_keywords=result["spam_keywords"],
        word_count=result["word_count"],
    )
    result["id"] = record_id
    result["created_at"] = datetime.utcnow().isoformat() + "Z"
    return jsonify(result)


@app.get("/api/history")
def history():
    limit = min(int(request.args.get("limit", 100)), 250)
    return jsonify({"history": fetch_history(limit=limit)})


@app.delete("/api/history")
def delete_history():
    clear_history()
    return jsonify({"message": "Prediction history deleted."})


@app.get("/api/analytics")
def analytics_route():
    return jsonify(analytics())


@app.get("/api/stats")
def stats_route():
    stats = dashboard_stats()
    stats["model_metrics"] = MODEL_BUNDLE["metrics"]
    return jsonify(stats)


@app.get("/api/health")
def health():
    return jsonify(
        {
            "api": "healthy",
            "database": "connected",
            "model": "ready" if MODEL_PATH.exists() else "training-required",
            "metrics": MODEL_BUNDLE["metrics"],
            "checked_at": datetime.utcnow().isoformat() + "Z",
        }
    )


@app.post("/api/train")
def retrain():
    global MODEL_BUNDLE
    MODEL_BUNDLE = train_model(force=True)
    return jsonify({"message": "Model retrained successfully.", "metrics": MODEL_BUNDLE["metrics"]})


@app.get("/<path:path>")
def serve_react(path):
    requested_file = FRONTEND_DIST / path
    if requested_file.exists() and requested_file.is_file():
        return send_from_directory(FRONTEND_DIST, path)
    return send_from_directory(FRONTEND_DIST, "index.html")


if __name__ == "__main__":
    app.run(debug=False, use_reloader=False, host="0.0.0.0", port=5000)
