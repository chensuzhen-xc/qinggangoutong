'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { HeaderNav } from '@/components/ui/HeaderNav';
import { User, Trophy, Heart, TrendingUp, Target, Calendar } from 'lucide-react';

interface GameRecord {
  id: number;
  scenario: string;
  final_score: number;
  result: 'win' | 'lose';
  played_at: string;
}

interface GameStats {
  totalGames: number;
  winCount: number;
  loseCount: number;
  winRate: number;
  avgScore: number;
  bestScore: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 检查登录状态
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // 加载游戏记录
  useEffect(() => {
    if (!user) return;

    const loadRecords = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/game/records?user_id=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setRecords(data.records);
          setStats(data.stats);
        }
      } catch (error) {
        console.error('加载游戏记录失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecords();
  }, [user]);

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // 加载中
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
        <HeaderNav showBack backHref="/" title="个人中心" />
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
      <HeaderNav showBack backHref="/" title="个人中心" />

      <div className="max-w-md mx-auto px-4 py-6">
        {/* 用户信息卡片 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user.username}</h2>
              <p className="text-sm text-gray-500">哄哄模拟器玩家</p>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        {stats && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Trophy className="w-4 h-4" />
                <span className="text-sm">总场次</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalGames}</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-green-500 mb-2">
                <Heart className="w-4 h-4" />
                <span className="text-sm">胜率</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.winRate}%</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-blue-500 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">平均分</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.avgScore}</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-yellow-500 mb-2">
                <Target className="w-4 h-4" />
                <span className="text-sm">最高分</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.bestScore}</p>
            </div>
          </div>
        )}

        {/* 详细战绩 */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">游戏记录</h3>
          </div>

          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              加载中...
            </div>
          ) : records.length === 0 ? (
            <div className="p-6 text-center">
              <span className="text-4xl mb-3 block">🎮</span>
              <p className="text-gray-500">还没有游戏记录</p>
              <p className="text-sm text-gray-400 mt-1">快去开始一局游戏吧！</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {records.map((record) => (
                <div key={record.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      record.result === 'win' ? "bg-green-100" : "bg-red-100"
                    )}>
                      {record.result === 'win' ? (
                        <Heart className="w-5 h-5 text-green-500" />
                      ) : (
                        <Heart className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{record.scenario}</p>
                      <p className="text-xs text-gray-500">
                        得分：{record.final_score} · {record.result === 'win' ? '通关' : '失败'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(record.played_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// cn 辅助函数（因为是从 utils 导入的）
function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
