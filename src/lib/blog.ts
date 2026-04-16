import { readDB, writeDB } from './simpleStorage';

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  created_at: string;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const db = readDB();
  const posts = db.blog_posts.slice();
  posts.sort(function(a, b) {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  return posts;
}

export async function getPostById(id: number): Promise<BlogPost | null> {
  const db = readDB();
  for (let i = 0; i < db.blog_posts.length; i = i + 1) {
    if (db.blog_posts[i].id === id) {
      return db.blog_posts[i];
    }
  }
  return null;
}

export async function getPostBySlug(id: string): Promise<BlogPost | null> {
  const postId = parseInt(id, 10);
  if (isNaN(postId)) {
    return null;
  }
  return getPostById(postId);
}

export async function createPost(post: {
  title: string;
  summary: string;
  content: string;
}): Promise<BlogPost> {
  const db = readDB();
  
  const newPost: BlogPost = {
    id: db.blog_posts.length + 1,
    title: post.title,
    summary: post.summary,
    content: post.content,
    created_at: new Date().toISOString(),
  };
  
  db.blog_posts.push(newPost);
  writeDB(db);
  
  return newPost;
}

export async function deletePost(id: number): Promise<void> {
  const db = readDB();
  const newPosts = [];
  for (let i = 0; i < db.blog_posts.length; i = i + 1) {
    if (db.blog_posts[i].id !== id) {
      newPosts.push(db.blog_posts[i]);
    }
  }
  db.blog_posts = newPosts;
  writeDB(db);
}
