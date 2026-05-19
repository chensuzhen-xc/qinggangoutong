'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';
import { HeaderNav } from '@/components/ui/HeaderNav';

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  created_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载文章列表
  const loadPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 先初始化文章（如果数据库为空）
      await fetch('/api/blog/init', { method: 'POST' });

      // 获取文章列表
      const response = await fetch('/api/blog/list');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error('加载文章失败:', err);
      setError('加载文章失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 生成新文章
  const generateNewArticle = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/blog/generate', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        // 刷新文章列表
        await loadPosts();
      } else {
        setError(data.error || '生成失败');
      }
    } catch (err) {
      console.error('生成文章失败:', err);
      setError('生成失败，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
      {/* 顶部导航 */}
      <HeaderNav showBack backHref="/" />

      {/* 标题区 */}
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <span className="text-5xl mb-4 block">📚</span>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">恋爱攻略</h1>
        <p className="text-gray-500">学会爱，更好地爱</p>
      </div>

      {/* 生成新文章按钮 */}
      <div className="max-w-2xl mx-auto px-4 pb-4">
        <button
          onClick={generateNewArticle}
          disabled={isGenerating}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>AI正在创作中...</span>
            </>
          ) : (
            <>
              <span className="text-xl">✨</span>
              <span>让AI创作新攻略</span>
            </>
          )}
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="max-w-2xl mx-auto px-4 pb-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        </div>
      )}

      {/* 文章列表 */}
      <div className="max-w-2xl mx-auto px-4 pb-12 space-y-4">
        {isLoading ? (
          // 加载骨架
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
              <div className="flex gap-2 mb-3">
                <div className="h-6 w-16 bg-gray-100 rounded-full" />
                <div className="h-6 w-16 bg-gray-100 rounded-full" />
              </div>
              <div className="h-6 bg-gray-100 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-100 rounded w-full mb-2" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ))
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-5xl mb-4 block">📝</span>
            <p className="text-gray-500">暂无文章，点击上方按钮创作第一篇吧！</p>
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="block bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 active:scale-98"
            >
              {/* 标题 */}
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                {post.title}
              </h2>

              {/* 摘要 */}
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                {post.summary}
              </p>

              {/* 底部信息 */}
              <div className="flex items-center justify-end text-xs text-gray-400">
                <span>{formatDate(post.created_at)}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
