'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Clock, Calendar, User } from 'lucide-react';
import { HeaderNav } from '@/components/ui/HeaderNav';

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  created_at: string;
}

// 预设文章详细数据
const presetArticleDetails: Record<string, BlogPost> = {
  '1': {
    id: 1,
    title: '第一次约会如何沟通',
    summary: '第一次约会总是紧张得手心出汗？别怕，这篇攻略教你如何自然又得体地和TA聊天，让好感度蹭蹭上涨！',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    content: `💕 第一次约会紧张到说不出话？来看看这篇攻略吧！

姐妹们（也适用于男同胞们），第一次约会最大的敌人是谁？不是对方，是你自己脑子里那个疯狂尖叫的小人儿！

😅 你是不是也这样：
- 提前半小时到，在咖啡店门口来回踱步
- 准备了一肚子话题，结果见面全忘了
- 对视三秒大脑直接宕机

别慌，我来教你几招！

✨ 【第一招：做好功课但别背台词】
约会前可以想几个话题，比如最近看的电影、喜欢吃的东西。但千万别像背课文一样念出来，自然一点，当成聊天就行。

✨ 【第二招：学会"接话球"】
对方说"我最近在学画画"，你可以说"哇好厉害！是什么类型的画？学多久了？"这样话题就自然延续了。

✨ 【第三招：适当暴露小缺点】
完美的人设反而让人有距离感。承认自己"其实我也有点紧张"反而会让气氛轻松下来。

✨ 【第四招：观察对方的反应】
如果对方一直看手机或者回复很敷衍，那可能是对话内容不太感兴趣。换一个话题试试！

🎯 【最最重要的是】：
做真实的自己！约会不是面试，不需要演。喜欢你本来的样子的人，才值得继续交往。

加油，你行的！💪`,
  },
  '2': {
    id: 2,
    title: '谈恋爱时禁忌有哪些',
    summary: '明明很相爱，却因为一些小事闹得分崩离析？这篇文章告诉你，那些绝对不能踩的雷区！',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    content: `🚫 这些恋爱雷区，踩一个分手一个！

爱情不是童话故事里的"从此幸福快乐"，而是需要两个人小心翼翼维护的花园。以下这些雷区，千万别踩！

❌ 【禁忌一：翻旧账】
"你上次也是这样！"
"你还记得上次你..."
拜托！过去的事就让它过去吧，一直翻旧账只会让对方觉得"你根本不是爱我，是在收集我的黑历史"。

❌ 【禁忌二：拿TA和前任比较】
"我前任就不会这样..."
"你看看人家男朋友多体贴..."
亲，你是在谈恋爱还是在养蛊？每提一次前任，对方的爱意就少一分。

❌ 【禁忌三：动不动就提分手】
"分手吧"说多了就成狼来了。等你真想说的时候，对方可能已经麻木了。

❌ 【禁忌四：在朋友面前贬低TA】
就算私下吐槽可以理解，但在朋友面前各种嫌弃，只会让TA颜面尽失。TA是你的爱人，不是你的出气筒。

❌ 【禁忌五：控制欲太强】
查手机、夺命连环call、时刻报备...这些行为不是在乎，是窒息。信任是感情的基石，没有信任的爱情走不远的。

❌ 【禁忌六：把对方的付出当作理所当然】
TA做饭是因为爱你，不是应该的。时不时说一句"谢谢你"或"辛苦了"，会让TA觉得一切都值得。

💕 好的爱情是让两个人都越来越舒服，而不是越来越累。避开这些雷区，你的爱情之路会顺畅很多！`,
  },
  '3': {
    id: 3,
    title: '道歉的正确打开方式',
    summary: '一句"对不起"说了无数遍，TA却越来越生气？道歉也是一门艺术，快来学习正确的道歉姿势！',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    content: `😤 "对不起"说了100遍，TA为什么还是不理你？

你是不是也遇到过这种情况：明明道歉了，对方却更生气了？别怀疑自己，可能是你的道歉方式有问题！

❌ 【无效道歉一：敷衍型】
"行行行，我错了还不行吗？"
这种道歉语气里透着不耐烦，只会让对方更加火大。

❌ 【无效道歉二：转移型】
"对不起...但是你也有不对的地方啊！"
道歉加但是，这是道歉还是找借口？承认错误的时候不要给自己加戏。

❌ 【无效道歉三：无限循环型】
每天都道歉，每天都犯同样的错。道歉是要配合行动的，不是嘴上说说就行。

✅ 【正确道歉姿势】

✨ 【第一步：认错要具体】
不要只说"我错了"，要说"我不应该在开会的时候没回你消息，让你担心了"。

✨ 【第二步：承认对方感受】
"我知道你一定很着急，也很生气，换做是我也会这样。"

✨ 【第三步：解释原因（但不找借口）】
可以说"是因为工作太忙"，但不要说"是因为工作太忙才没回你"。

✨ 【第四步：提出弥补方案】
"以后我提前跟你说，或者设置个提醒。你觉得这样可以吗？"

✨ 【第五步：用行动证明】
说完就要做到！说到做到才是真道歉。

💡 【小技巧】
有时候一个拥抱比一百句"对不起"更有用。关键时刻别吝啬你的怀抱！

道歉不是软弱的表现，而是成熟的标志。学会正确道歉，你们的感情会越来越好的！💕`,
  },
};

export default function ArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        try {
          const response = await fetch(`/api/blog/${id}`);
          if (response.ok) {
            const data = await response.json();
            setPost(data);
            return;
          }
        } catch (apiError) {
          console.log('API加载失败，使用预设数据');
        }
        
        // 使用预设数据
        if (presetArticleDetails[id]) {
          setPost(presetArticleDetails[id]);
        } else {
          setError('文章不存在');
        }
      } catch (err) {
        console.error('加载文章失败:', err);
        setError('文章加载失败');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadPost();
    }
  }, [id]);

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 计算阅读时间
  const calculateReadTime = (content: string) => {
    const words = content.length;
    const minutes = Math.ceil(words / 500);
    return `${minutes}分钟`;
  };

  // 如果加载中
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
        <HeaderNav showBack backHref="/blog" />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  // 如果出错
  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">😢</span>
          <h1 className="text-xl font-bold text-gray-800 mb-2">{error || '文章不存在'}</h1>
          <Link 
            href="/blog"
            className="text-pink-500 hover:text-pink-600"
          >
            返回攻略列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
      {/* 顶部导航 */}
      <HeaderNav showBack backHref="/blog" />

      {/* 文章内容 */}
      <article className="max-w-2xl mx-auto px-4 py-8">
        {/* 标题 */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {post.title}
        </h1>

        {/* 元信息 */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>恋爱导师小爱</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.created_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{calculateReadTime(post.content)}</span>
          </div>
        </div>

        {/* 文章内容 */}
        <div className="prose prose-pink max-w-none">
          {post.content.split('\n').map((paragraph, index) => {
            // 跳过纯空白行
            if (!paragraph.trim()) return null;
            return (
              <p key={index} className="text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* 底部返回 */}
        <div className="mt-12 pt-6 border-t">
          <Link 
            href="/blog"
            className="flex items-center justify-center gap-2 py-3 px-6 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
          >
            <span>查看更多攻略</span>
          </Link>
        </div>
      </article>
    </div>
  );
}
