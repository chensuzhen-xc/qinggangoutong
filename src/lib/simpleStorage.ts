import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = path.join(process.cwd(), 'database', 'local-db.json');

const presetBlogPosts = [
  {
    title: '第一次约会如何沟通',
    summary: '第一次约会总是紧张得手心出汗？别怕，这篇攻略教你如何自然又得体地和TA聊天，让好感度蹭蹭上涨！',
    content: '💕 第一次约会紧张到说不出话？来看看这篇攻略吧！',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    title: '谈恋爱时禁忌有哪些',
    summary: '明明很相爱，却因为一些小事闹得分崩离析？这篇文章告诉你，那些绝对不能踩的雷区！',
    content: '🚫 这些恋爱雷区，踩一个分手一个！',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    title: '道歉的正确打开方式',
    summary: '一句"对不起"说了无数遍，TA却越来越生气？道歉也是一门艺术，快来学习正确的道歉姿势！',
    content: '😤 "对不起"说了100遍，TA为什么还是不理你？',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

function initDB() {
  const dbDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    const initialDB = {
      users: [],
      blog_posts: presetBlogPosts.map(function(post, index) {
        return {
          title: post.title,
          summary: post.summary,
          content: post.content,
          created_at: post.created_at,
          id: index + 1,
        };
      }),
      game_records: [],
      leaderboard: [],
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2), 'utf-8');
    return initialDB;
  }

  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

function readDB() {
  return initDB();
}

function writeDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}

export { readDB, writeDB };
