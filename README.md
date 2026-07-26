# NeuroShield Spam Mail Detection

Premium futuristic spam mail detection web app built with React, Vite, Tailwind CSS, Flask, SQLite, and a TF-IDF + Logistic Regression machine learning pipeline.

## Project Structure

```text
SpamMailDetection/
  backend/
    app.py
    database.py
    model.py
    requirements.txt
    data/
      spam.csv              # optional Kaggle SMS Spam Collection CSV
    models/
      spam_classifier.joblib
    spam_detection.db
  frontend/
    src/
      components/
      pages/
      services/
    package.json
    tailwind.config.js
    vite.config.js
```

## Dataset

Download the Kaggle SMS Spam Collection Dataset and place the CSV at:

```text
backend/data/spam.csv
```

The backend automatically:

- Loads Kaggle-style `v1`, `v2` columns or `label`, `message` columns
- Cleans text
- Removes complete duplicate row groups
- Applies TF-IDF vectorization
- Trains Logistic Regression
- Saves the model with `joblib`

If the CSV is missing, the backend uses a small fallback dataset so the app still runs for development.

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

API runs on:

```text
http://127.0.0.1:5000
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://127.0.0.1:5173
```

## REST APIs

- `POST /api/predict`
- `GET /api/history`
- `DELETE /api/history`
- `GET /api/analytics`
- `GET /api/stats`
- `GET /api/health`
- `POST /api/train`

## Features

- Dark futuristic cyberpunk SaaS dashboard
- Glassmorphism panels and neon gradient shadows
- Floating 3D mail firewall illustration
- Spam prediction with confidence score
- Accuracy, precision, and recall cards
- SQLite prediction history table
- Live analytics charts
- Spam keyword detection
- Email word counter
- AI insights panel
- System health indicators
- Responsive desktop and mobile layout
link:https://spam-email-detetction.onrender.com/
