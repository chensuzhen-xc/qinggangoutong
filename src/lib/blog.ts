import { getSupabaseClient } from '@/lib/supabase';
const supabase = getSupabaseClient();

export async function getAllPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function getPostById(id: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ✅ 已修复：添加了 summary 字段 + 支持对象传参
export async function createPost({
  title,
  summary,
  content,
  author_id,
}: {
  title: string;
  summary: string;
  content: string;
  author_id: string;
}) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([{ title, summary, content, author_id }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getPostBySlug(id: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}
