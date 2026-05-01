import sqlite3
from pathlib import Path

DB_PATH = Path("smartstocks.db")

def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection

def init_db():
    with get_connection() as connection:
                connection.executescript("""

        -- Who the user is
        CREATE TABLE IF NOT EXISTS users (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            email       TEXT    UNIQUE NOT NULL,
            username    TEXT    UNIQUE NOT NULL,
            password    TEXT    NOT NULL,   -- store bcrypt hash, never plaintext
            created_at  TEXT    DEFAULT (datetime('now'))
        );

        -- What they told us about themselves during onboarding
        CREATE TABLE IF NOT EXISTS preferences (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id         INTEGER UNIQUE NOT NULL REFERENCES users(id),

            -- Sectors: stored as JSON array e.g. '["Technology","Healthcare"]'
            sectors         TEXT    DEFAULT '[]',

            -- Risk: 'low' | 'medium' | 'high'
            risk_tolerance  TEXT    DEFAULT 'medium',

            -- Price range in USD
            min_price       REAL    DEFAULT 0,
            max_price       REAL    DEFAULT 10000,

            -- Dividend preference: 0.0 to 1.0 (how much they care)
            dividend_pref   REAL    DEFAULT 0.5,

            updated_at      TEXT    DEFAULT (datetime('now'))
        );

        -- Stocks the user has saved
        CREATE TABLE IF NOT EXISTS favorites (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     INTEGER NOT NULL REFERENCES users(id),
            ticker      TEXT    NOT NULL,
            added_at    TEXT    DEFAULT (datetime('now')),

            UNIQUE(user_id, ticker)   -- no duplicate saves
        );

        """)