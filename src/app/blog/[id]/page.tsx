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
        const response = await fetch(`/api/blog/${id}`);
        if (!response.ok) {
          throw new Error('文章不存在');
        }
        const data = await response.json();
        setPost(data);
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
