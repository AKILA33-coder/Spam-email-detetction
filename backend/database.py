import sqlite3
import os
from contextlib import contextmanager
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "spam_detection.db"
MAX_HISTORY_ROWS = int(os.getenv("MAX_HISTORY_ROWS", "5000"))


@contextmanager
def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
        connection.commit()
    finally:
        connection.close()


def init_db():
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS prediction_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email_message TEXT NOT NULL,
                prediction TEXT NOT NULL,
                confidence_score REAL NOT NULL,
                spam_keywords TEXT DEFAULT '',
                word_count INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.execute(
            """
            DELETE FROM prediction_history
            WHERE id NOT IN (
                SELECT MIN(id)
                FROM prediction_history
                GROUP BY lower(trim(email_message))
            )
            """
        )
        enforce_history_limit(conn)


def enforce_history_limit(conn):
    # Keep only the latest MAX_HISTORY_ROWS entries for predictable storage growth.
    conn.execute(
        """
        DELETE FROM prediction_history
        WHERE id NOT IN (
            SELECT id
            FROM prediction_history
            ORDER BY datetime(created_at) DESC, id DESC
            LIMIT ?
        )
        """,
        (MAX_HISTORY_ROWS,),
    )


def insert_prediction(email_message, prediction, confidence_score, spam_keywords, word_count):
    with get_connection() as conn:
        existing = conn.execute(
            """
            SELECT id
            FROM prediction_history
            WHERE lower(trim(email_message)) = lower(trim(?))
            LIMIT 1
            """,
            (email_message,),
        ).fetchone()

        if existing:
            conn.execute(
                """
                UPDATE prediction_history
                SET prediction = ?,
                    confidence_score = ?,
                    spam_keywords = ?,
                    word_count = ?,
                    created_at = CURRENT_TIMESTAMP
                WHERE id = ?
                """,
                (prediction, confidence_score, ",".join(spam_keywords), word_count, existing["id"]),
            )
            enforce_history_limit(conn)
            return existing["id"]

        cursor = conn.execute(
            """
            INSERT INTO prediction_history
            (email_message, prediction, confidence_score, spam_keywords, word_count)
            VALUES (?, ?, ?, ?, ?)
            """,
            (email_message, prediction, confidence_score, ",".join(spam_keywords), word_count),
        )
        enforce_history_limit(conn)
        return cursor.lastrowid


def fetch_history(limit=100):
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, email_message, prediction, confidence_score, spam_keywords,
                   word_count, created_at
            FROM prediction_history
            ORDER BY datetime(created_at) DESC, id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()
        return [dict(row) for row in rows]


def clear_history():
    with get_connection() as conn:
        conn.execute("DELETE FROM prediction_history")


def dashboard_stats():
    with get_connection() as conn:
        totals = conn.execute(
            """
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN prediction = 'Spam' THEN 1 ELSE 0 END) AS spam,
                SUM(CASE WHEN prediction = 'Ham' THEN 1 ELSE 0 END) AS ham,
                AVG(confidence_score) AS avg_confidence,
                AVG(word_count) AS avg_words
            FROM prediction_history
            """
        ).fetchone()
        recent = conn.execute(
            """
            SELECT prediction, confidence_score, created_at
            FROM prediction_history
            ORDER BY datetime(created_at) DESC, id DESC
            LIMIT 8
            """
        ).fetchall()
        return {
            "total_predictions": totals["total"] or 0,
            "spam_predictions": totals["spam"] or 0,
            "ham_predictions": totals["ham"] or 0,
            "average_confidence": round(totals["avg_confidence"] or 0, 3),
            "average_words": round(totals["avg_words"] or 0, 1),
            "max_history_rows": MAX_HISTORY_ROWS,
            "recent_activity": [dict(row) for row in recent],
        }


def analytics():
    with get_connection() as conn:
        timeline = conn.execute(
            """
            SELECT date(created_at) AS day,
                   COUNT(*) AS total,
                   SUM(CASE WHEN prediction = 'Spam' THEN 1 ELSE 0 END) AS spam,
                   SUM(CASE WHEN prediction = 'Ham' THEN 1 ELSE 0 END) AS ham,
                   AVG(confidence_score) AS confidence
            FROM prediction_history
            GROUP BY date(created_at)
            ORDER BY day DESC
            LIMIT 14
            """
        ).fetchall()
        keywords = conn.execute(
            """
            SELECT spam_keywords
            FROM prediction_history
            WHERE spam_keywords != ''
            ORDER BY datetime(created_at) DESC
            LIMIT 200
            """
        ).fetchall()

    keyword_counts = {}
    for row in keywords:
        for keyword in row["spam_keywords"].split(","):
            if keyword:
                keyword_counts[keyword] = keyword_counts.get(keyword, 0) + 1

    top_keywords = [
        {"keyword": key, "count": value}
        for key, value in sorted(keyword_counts.items(), key=lambda item: item[1], reverse=True)[:10]
    ]

    return {
        "timeline": [dict(row) for row in reversed(timeline)],
        "top_keywords": top_keywords,
    }
