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

// ✅ 这里我帮你改成接收对象，和前端调用匹配
export async function createPost({
  title,
  content,
  author_id
}: {
  title: string;
  content: string;
  author_id: string;
}) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([{ title, content, author_id }])
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
