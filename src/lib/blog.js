var storage = require('./simpleStorage');
var readDB = storage.readDB;
var writeDB = storage.writeDB;

async function getAllPosts() {
  var db = readDB();
  var posts = db.blog_posts.slice();
  posts.sort(function(a, b) {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  return posts;
}

async function getPostById(id) {
  var db = readDB();
  var i;
  for (i = 0; i < db.blog_posts.length; i = i + 1) {
    if (db.blog_posts[i].id === id) {
      return db.blog_posts[i];
    }
  }
  return null;
}

async function getPostBySlug(id) {
  var postId = parseInt(id, 10);
  if (isNaN(postId)) return null;
  return getPostById(postId);
}

async function createPost(post) {
  var db = readDB();
  
  var newPost = {
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

async function deletePost(id) {
  var db = readDB();
  var newPosts = [];
  var i;
  for (i = 0; i < db.blog_posts.length; i = i + 1) {
    if (db.blog_posts[i].id !== id) {
      newPosts.push(db.blog_posts[i]);
    }
  }
  db.blog_posts = newPosts;
  writeDB(db);
}

module.exports = {
  getAllPosts: getAllPosts,
  getPostById: getPostById,
  getPostBySlug: getPostBySlug,
  createPost: createPost,
  deletePost: deletePost,
};
