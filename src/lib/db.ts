import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), 'data', 'greengrove.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    const fs = require('fs');
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeDatabase(db);
  }
  return db;
}

function initializeDatabase(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      country TEXT,
      city TEXT,
      role TEXT DEFAULT 'customer' CHECK(role IN ('customer', 'admin')),
      preferences TEXT DEFAULT '{}',
      marketing_opt_in INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      event_name TEXT NOT NULL,
      event_date TEXT NOT NULL,
      end_date TEXT,
      duration_type TEXT CHECK(duration_type IN ('hourly', 'daily', 'weekly')),
      duration_value INTEGER DEFAULT 1,
      guest_count INTEGER,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
      special_requests TEXT,
      total_venue_cost REAL,
      total_services_cost REAL,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS event_services (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      service_type TEXT NOT NULL,
      service_name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      quantity INTEGER DEFAULT 1,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (event_id) REFERENCES events(id)
    );

    CREATE TABLE IF NOT EXISTS surveys (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      overall_rating INTEGER,
      venue_rating INTEGER,
      service_rating INTEGER,
      value_rating INTEGER,
      recommend INTEGER,
      feedback TEXT,
      submitted_at TEXT,
      sent_at TEXT DEFAULT (datetime('now')),
      status TEXT DEFAULT 'sent' CHECK(status IN ('sent', 'completed')),
      FOREIGN KEY (event_id) REFERENCES events(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new' CHECK(status IN ('new', 'read', 'replied')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS analytics_reports (
      id TEXT PRIMARY KEY,
      report_type TEXT NOT NULL,
      report_data TEXT NOT NULL,
      generated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      stripe_payment_intent_id TEXT,
      stripe_client_secret TEXT,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'inr',
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
      payment_type TEXT DEFAULT 'advance' CHECK(payment_type IN ('advance', 'full', 'balance')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (event_id) REFERENCES events(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS event_messages (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      sender_role TEXT NOT NULL CHECK(sender_role IN ('admin', 'customer')),
      message TEXT NOT NULL,
      message_type TEXT DEFAULT 'message' CHECK(message_type IN ('message', 'info_request', 'approval', 'rejection')),
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (event_id) REFERENCES events(id),
      FOREIGN KEY (sender_id) REFERENCES users(id)
    );
  `);

  // Seed admin user if not exists
  const adminExists = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
  if (!adminExists) {
    const adminId = require('uuid').v4();
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare(
      'INSERT INTO users (id, email, password_hash, full_name, phone, role) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(adminId, 'admin@greengrove.in', hash, 'Admin', '+91-471-0000000', 'admin');
  }
}
