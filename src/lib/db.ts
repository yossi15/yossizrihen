import Database from "better-sqlite3";
import { mkdirSync, existsSync } from "fs";
import path from "path";

const DB_DIR = process.env.DB_DIR || path.join(process.cwd(), "data");
if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });

const DB_PATH = path.join(DB_DIR, "wedding.db");

let _db: Database.Database | null = null;

export function db() {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  migrate(_db);
  return _db;
}

function migrate(d: Database.Database) {
  d.exec(`
    CREATE TABLE IF NOT EXISTS guests (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      phone         TEXT,
      invited_count INTEGER NOT NULL DEFAULT 1,
      side          TEXT,
      group_label   TEXT,
      table_id      TEXT,
      notes         TEXT,
      created_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS rsvps (
      id             TEXT PRIMARY KEY,
      guest_id       TEXT NOT NULL UNIQUE REFERENCES guests(id) ON DELETE CASCADE,
      attending      TEXT NOT NULL CHECK (attending IN ('yes','no','maybe')),
      guests_count   INTEGER NOT NULL DEFAULT 0,
      dietary        TEXT,
      message        TEXT,
      submitted_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at     TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tables (
      id        TEXT PRIMARY KEY,
      number    INTEGER NOT NULL,
      capacity  INTEGER NOT NULL DEFAULT 12,
      label     TEXT,
      notes     TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_guests_name  ON guests(name);
    CREATE INDEX IF NOT EXISTS idx_rsvps_guest  ON rsvps(guest_id);
  `);
}
