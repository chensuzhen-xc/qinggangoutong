import bcrypt from 'bcryptjs';
import { readDB, writeDB } from './simpleStorage';

interface User {
  id: number;
  username: string;
  password: string;
  created_at: string;
}

export async function createUser(username: string, password: string): Promise<User> {
  const db = readDB();
  
  let existingUser: User | null = null;
  for (let i = 0; i < db.users.length; i = i + 1) {
    if (db.users[i].username === username) {
      existingUser = db.users[i];
      break;
    }
  }
  
  if (existingUser) {
    throw new Error('用户名已存在');
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser: User = {
    id: db.users.length + 1,
    username: username,
    password: hashedPassword,
    created_at: new Date().toISOString(),
  };
  
  db.users.push(newUser);
  writeDB(db);
  
  return newUser;
}

export async function findUserByUsername(username: string): Promise<User | null> {
  const db = readDB();
  for (let i = 0; i < db.users.length; i = i + 1) {
    if (db.users[i].username === username) {
      return db.users[i];
    }
  }
  return null;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
