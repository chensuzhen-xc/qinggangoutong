'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { HeaderNav } from '@/components/ui/HeaderNav';
import { Trophy, Medal, Crown, User, Calendar, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  id: number;
  user_id: number;
  username: string;
  best_score: number;
  achieved_at: string;
}

export default function RankingPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [userRanking, setUserRanking] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 加载排行榜
  useEffect(() => {
    const loadLeaderboard = async () => {
      setIsLoading(true);
      try {
        const url = user 
          ? `/api/leaderboard?user_id=${user.id}` 
          : '/api/leaderboard';
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setEntries(data.entries);
          setUserRanking(data.userRanking);
        }
      } catch (error) {
        console.error('加载排行榜失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, [user]);

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays < 1) return '今天';
    if (diffDays < 30) return `${diffDays}天前`;
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 获取排名图标
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 text-center font-bold text-gray-500">{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-orange-50 to-red-50">
      {/* 顶部导航 */}
      <HeaderNav showBack backHref="/" title="排行榜" />

      {/* 内容区 */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* 标题区 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-3">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">全服排行榜</h1>
          <p className="text-sm text-gray-500 mt-1">前20名哄人高手</p>
        </div>

        {/* 用户排名提示 */}
        {user && userRanking && userRanking > 20 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-gray-800">您的排名</p>
                <p className="text-sm text-gray-500">继续加油！</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-500">
              #{userRanking}
            </div>
          </div>
        )}

        {/* 排行榜列表 */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-200 rounded" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <span className="text-5xl mb-4 block">🏆</span>
            <h2 className="text-lg font-bold text-gray-800 mb-2">暂无排行数据</h2>
            <p className="text-gray-500 mb-4">快去成为第一个上榜的玩家吧！</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all"
            >
              开始游戏
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => {
              const rank = index + 1;
              const isCurrentUser = user?.id === entry.user_id;
              
              return (
                <div
                  key={entry.id}
                  className={`
                    bg-white rounded-xl p-4 transition-all
                    ${isCurrentUser ? 'ring-2 ring-pink-500 shadow-lg' : 'shadow-sm'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    {/* 排名 */}
                    <div className="flex-shrink-0 w-8 flex justify-center">
                      {getRankIcon(rank)}
                    </div>

                    {/* 用户信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800 truncate">
                          {entry.username}
                        </p>
                        {isCurrentUser && (
                          <span className="px-2 py-0.5 bg-pink-100 text-pink-600 text-xs rounded-full">
                            我
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(entry.achieved_at)}</span>
                      </div>
                    </div>

                    {/* 分数 */}
                    <div className="flex-shrink-0 text-right">
                      <p className={cn(
                        "text-xl font-bold",
                        rank <= 3 ? "text-orange-500" : "text-gray-700"
                      )}>
                        {entry.best_score}
                      </p>
                      <p className="text-xs text-gray-400">分</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 提示 */}
        {!user && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-3">
              登录后可参与排行榜角逐
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-pink-500 text-white font-medium rounded-xl hover:bg-pink-600 transition-all"
            >
              立即登录
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// cn 辅助函数
function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
