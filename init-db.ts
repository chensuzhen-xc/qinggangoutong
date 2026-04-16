import { initDB } from './src/lib/localStorage';

console.log('正在初始化本地数据库...');

try {
  const db = initDB();
  console.log('✅ 数据库初始化成功！');
  console.log(`📊 当前数据统计：`);
  console.log(`   - 用户数: ${db.users.length}`);
  console.log(`   - 博客文章数: ${db.blog_posts.length}`);
  console.log(`   - 游戏记录数: ${db.game_records.length}`);
  console.log(`   - 排行榜记录数: ${db.leaderboard.length}`);
  
  if (db.blog_posts.length > 0) {
    console.log(`\n📝 预设博客文章：`);
    db.blog_posts.forEach((post, index) => {
      console.log(`   ${index + 1}. ${post.title}`);
    });
  }
  
  console.log('\n🎉 数据库已准备好，可以开始使用了！');
} catch (error) {
  console.error('❌ 数据库初始化失败：', error);
  process.exit(1);
}
