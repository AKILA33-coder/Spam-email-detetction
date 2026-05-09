import re
from pathlib import Path

import joblib
import pandas as pd
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS, TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline


BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"
MODEL_PATH = MODEL_DIR / "spam_classifier.joblib"
DATA_DIR = BASE_DIR / "data"
DATASET_PATH = DATA_DIR / "spam.csv"
MODEL_VERSION = 2

SPAM_KEYWORDS = [
    "free",
    "winner",
    "win",
    "cash",
    "prize",
    "urgent",
    "claim",
    "limited",
    "offer",
    "click",
    "bonus",
    "lottery",
    "credit",
    "guaranteed",
    "congratulations",
    "selected",
    "unsubscribe",
    "reward",
]


FALLBACK_DATA = [
    ("ham", "Hey, are we still meeting for the project review today?"),
    ("ham", "Please send the notes from the dashboard discussion."),
    ("ham", "Dinner at 8 sounds good. I will bring the documents too."),
    ("ham", "Your appointment is confirmed for Friday morning."),
    ("ham", "Can you review the attached report before the client call?"),
    ("ham", "The sprint demo moved to 3 PM in conference room two."),
    ("ham", "Thanks for your help with the presentation yesterday."),
    ("ham", "I updated the invoice and shared it with accounting."),
    ("spam", "Congratulations winner claim your free cash prize now."),
    ("spam", "Urgent offer click here to receive guaranteed bonus money."),
    ("spam", "You have won a lottery reward, claim limited cash today."),
    ("spam", "Free entry in weekly competition, text WIN to claim prize."),
    ("spam", "Selected user, collect your credit bonus and reward now."),
    ("spam", "Limited time deal, click this link for free money."),
    ("spam", "Claim your guaranteed prize before this urgent offer expires."),
    ("spam", "Winner alert, cash lottery bonus waiting for you."),
]


def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+", " link ", text)
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    words = [word for word in text.split() if word not in ENGLISH_STOP_WORDS]
    return " ".join(words)


def load_dataset():
    if DATASET_PATH.exists():
        try:
            frame = pd.read_csv(DATASET_PATH, encoding="latin-1")
        except UnicodeDecodeError:
            frame = pd.read_csv(DATASET_PATH)

        if {"v1", "v2"}.issubset(frame.columns):
            frame = frame.rename(columns={"v1": "label", "v2": "message"})
        elif {"label", "message"}.issubset(frame.columns):
            frame = frame[["label", "message"]]
        else:
            frame = frame.iloc[:, :2]
            frame.columns = ["label", "message"]
    else:
        frame = pd.DataFrame(FALLBACK_DATA, columns=["label", "message"])

    original_rows = len(frame)
    frame = frame[["label", "message"]].dropna()
    frame["label"] = frame["label"].astype(str).str.lower().str.strip()
    frame["label"] = frame["label"].replace({"0": "ham", "1": "spam"})
    frame = frame[frame["label"].isin(["ham", "spam"])]
    frame["message"] = frame["message"].astype(str)
    frame = frame.drop_duplicates(subset=["label", "message"], keep="first")
    duplicates_removed = original_rows - len(frame)
    frame["clean_message"] = frame["message"].apply(clean_text)
    frame = frame[frame["clean_message"].str.len() > 0]
    frame.attrs["duplicates_removed"] = int(duplicates_removed)
    return frame


def train_model(force=False):
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    if MODEL_PATH.exists() and not force:
        bundle = joblib.load(MODEL_PATH)
        if bundle.get("version") == MODEL_VERSION:
            return bundle

    frame = load_dataset()
    duplicates_removed = frame.attrs.get("duplicates_removed", 0)
    stratify = frame["label"] if frame["label"].nunique() == 2 and len(frame) >= 10 else None
    test_size = 0.2 if len(frame) >= 20 else 0.35
    x_train, x_test, y_train, y_test = train_test_split(
        frame["clean_message"],
        frame["label"],
        test_size=test_size,
        random_state=42,
        stratify=stratify,
    )

    pipeline = Pipeline(
        steps=[
            (
                "tfidf",
                TfidfVectorizer(
                    max_features=8000,
                    ngram_range=(1, 2),
                    min_df=1,
                    sublinear_tf=True,
                ),
            ),
            (
                "classifier",
                LogisticRegression(max_iter=1000, class_weight="balanced", random_state=42),
            ),
        ]
    )
    pipeline.fit(x_train, y_train)
    predictions = pipeline.predict(x_test)

    metrics = {
        "accuracy": round(accuracy_score(y_test, predictions), 4),
        "precision": round(precision_score(y_test, predictions, pos_label="spam", zero_division=0), 4),
        "recall": round(recall_score(y_test, predictions, pos_label="spam", zero_division=0), 4),
        "dataset_rows": int(len(frame)),
        "duplicates_removed": int(duplicates_removed),
        "duplicate_policy": "kept original row, removed repeated duplicate rows",
        "source": "Kaggle SMS Spam Collection" if DATASET_PATH.exists() else "built-in fallback sample",
    }

    bundle = {"pipeline": pipeline, "metrics": metrics, "version": MODEL_VERSION}
    joblib.dump(bundle, MODEL_PATH)
    return bundle


def predict_message(message):
    return predict_message_with_threshold(message=message, spam_threshold=0.5, include_explain=False, explain_top_n=8)


def _spam_probability(pipeline, cleaned_text):
    probabilities = pipeline.predict_proba([cleaned_text])[0]
    classes = list(pipeline.classes_)
    if "spam" in classes:
        spam_index = classes.index("spam")
        spam_probability = float(probabilities[spam_index])
    else:
        spam_probability = 0.0
    return spam_probability


def _explain_terms(pipeline, cleaned_text, top_n=8):
    vectorizer = pipeline.named_steps["tfidf"]
    classifier = pipeline.named_steps["classifier"]
    features = vectorizer.get_feature_names_out()
    vector = vectorizer.transform([cleaned_text]).tocoo()

    coef = classifier.coef_[0]
    class_labels = list(classifier.classes_)
    spam_coef = coef if class_labels[-1] == "spam" else -coef
    bias = float(classifier.intercept_[0] if class_labels[-1] == "spam" else -classifier.intercept_[0])

    contributions = []
    for _, feature_index, value in zip(vector.row, vector.col, vector.data):
        weight = float(value * spam_coef[feature_index])
        if weight == 0:
            continue
        contributions.append(
            {
                "term": str(features[feature_index]),
                "impact": round(weight, 6),
                "direction": "spam" if weight > 0 else "ham",
                "tfidf": round(float(value), 6),
            }
        )

    contributions.sort(key=lambda item: abs(item["impact"]), reverse=True)
    top_contributions = contributions[:top_n]
    return {
        "bias": round(bias, 6),
        "top_terms": top_contributions,
        "spam_support_terms": [item for item in top_contributions if item["direction"] == "spam"],
        "ham_support_terms": [item for item in top_contributions if item["direction"] == "ham"],
    }


def predict_message_with_threshold(message, spam_threshold=0.5, include_explain=False, explain_top_n=8):
    bundle = train_model()
    pipeline = bundle["pipeline"]
    cleaned = clean_text(message)
    spam_probability = _spam_probability(pipeline, cleaned)
    ham_probability = 1.0 - spam_probability
    prediction = "Spam" if spam_probability >= float(spam_threshold) else "Ham"
    confidence = spam_probability if prediction == "Spam" else ham_probability
    keyword_hits = detect_spam_keywords(message)
    result = {
        "prediction": "Spam" if prediction == "spam" else "Ham",
        "confidence_score": round(float(confidence), 4),
        "spam_probability": round(float(spam_probability), 4),
        "ham_probability": round(float(ham_probability), 4),
        "spam_threshold": round(float(spam_threshold), 3),
        "metrics": bundle["metrics"],
        "spam_keywords": keyword_hits,
        "word_count": len(str(message).split()),
        "cleaned_text": cleaned,
    }
    if include_explain:
        result["explainability"] = _explain_terms(pipeline=pipeline, cleaned_text=cleaned, top_n=explain_top_n)
    return result


def detect_spam_keywords(message):
    lowered = str(message).lower()
    return [keyword for keyword in SPAM_KEYWORDS if re.search(rf"\b{re.escape(keyword)}\b", lowered)]
