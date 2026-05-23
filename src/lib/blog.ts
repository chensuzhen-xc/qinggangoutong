import { supabase } from '@/lib/supabase';

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

export async function createPost(title: string, content: string, author_id: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([{ title, content, author_id }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
