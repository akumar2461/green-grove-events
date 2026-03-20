import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'greengrove-secret-key-change-in-production';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  country: string;
  city: string;
  role: 'customer' | 'admin';
  preferences: string;
  marketing_opt_in: number;
  created_at: string;
}

export function registerUser(data: {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  country?: string;
  city?: string;
  preferences?: Record<string, unknown>;
  marketing_opt_in?: boolean;
}): { user: User; token: string } {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(data.email);
  if (existing) {
    throw new Error('Email already registered');
  }

  const id = uuidv4();
  const hash = bcrypt.hashSync(data.password, 10);

  db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, phone, country, city, preferences, marketing_opt_in)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, data.email, hash, data.full_name,
    data.phone || null, data.country || null, data.city || null,
    JSON.stringify(data.preferences || {}),
    data.marketing_opt_in !== false ? 1 : 0
  );

  const user = db.prepare('SELECT id, email, full_name, phone, country, city, role, preferences, marketing_opt_in, created_at FROM users WHERE id = ?').get(id) as User;
  const token = jwt.sign({ userId: id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  return { user, token };
}

export function loginUser(email: string, password: string): { user: User; token: string } {
  const db = getDb();
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as (User & { password_hash: string }) | undefined;

  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    throw new Error('Invalid email or password');
  }

  const { password_hash, ...user } = row;
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  return { user: user as User, token };
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
}

export function getUserFromToken(token: string): User | null {
  const payload = verifyToken(token);
  if (!payload) return null;

  const db = getDb();
  return db.prepare('SELECT id, email, full_name, phone, country, city, role, preferences, marketing_opt_in, created_at FROM users WHERE id = ?').get(payload.userId) as User | null;
}
