import bcrypt from 'bcryptjs';
import { getSupabaseClient } from '@/lib/supabase';
const supabase = getSupabaseClient();

// 这里加了 ?  → nickname 变成可选
export async function createUser(username: string, password: string, nickname?: string) {
  const hashedPassword = await bcrypt.hash(password, 12);

  // 这里加了默认值 → 没传昵称就用用户名
  const finalNickname = nickname || username;

  const { data, error } = await supabase
    .from('users')
    .insert([{ username, password: hashedPassword, nickname: finalNickname }])
    .select('id, username, nickname, created_at')
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function findUserByUsername(username: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, nickname, password')
    .eq('username', username)
    .single();

  if (error) return null;
  return data;
}

export async function verifyPassword(inputPassword: string, hashedPassword: string) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}
