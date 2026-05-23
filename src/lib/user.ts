import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

/**
 * 【后端安全】创建用户（密码自动哈希，绝不返回密码）
 */
export async function createUser(username: string, password: string, nickname: string) {
  // 密码在后端加密，前端永远看不到
  const hashedPassword = await bcrypt.hash(password, 12);

  const { data, error } = await supabase
    .from('users')
    .insert([{ username, password: hashedPassword, nickname }])
    .select('id, username, nickname, created_at') // 👈 关键：不返回密码
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * 【后端安全】根据用户名查找用户（安全返回）
 */
export async function findUserByUsername(username: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, nickname, password') // 👈 只在后端使用
    .eq('username', username)
    .single();

  if (error) return null;
  return data;
}

/**
 * 【后端安全】验证密码（不泄露任何信息）
 */
export async function verifyPassword(inputPassword: string, hashedPassword: string) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}
