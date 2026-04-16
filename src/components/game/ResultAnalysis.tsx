'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useGame } from '@/context/GameContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Heart, HeartCrack, RotateCcw, Share2 } from 'lucide-react';

interface ResultAnalysisProps {
  onRestart: () => void;
}

export function ResultAnalysis({ onRestart }: ResultAnalysisProps) {
  const { state } = useGame();
  const { user } = useAuth();
  const [showContent, setShowContent] = useState(false);
  const [analysis, setAnalysis] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showLoginTip, setShowLoginTip] = useState(false);

  const { won, role, messages, ruleTriggers, step, affection, scenario } = state;
  const [leaderboardStatus, setLeaderboardStatus] = useState<'idle' | 'updating' | 'newRecord'>('idle');

  // 保存游戏记录和更新排行榜
  useEffect(() => {
    if (!showContent) return;
    
    const saveGameRecord = async () => {
      if (!user) {
        // 未登录用户，显示提示
        setShowLoginTip(true);
        return;
      }

      setSaveStatus('saving');
      try {
        // 并行保存游戏记录和更新排行榜
        const [recordRes, leaderboardRes] = await Promise.all([
          fetch('/api/game/record', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: user.id,
              scenario: scenario?.title || '未知场景',
              final_score: affection,
              result: won ? 'win' : 'lose',
            }),
          }),
          fetch('/api/leaderboard/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: user.id,
              username: user.username,
              score: affection,
            }),
          }),
        ]);

        if (recordRes.ok) {
          setSaveStatus('saved');
        } else {
          setSaveStatus('error');
        }

        if (leaderboardRes.ok) {
          const leaderboardData = await leaderboardRes.json();
          if (leaderboardData.isNewRecord) {
            setLeaderboardStatus('newRecord');
          }
        }
      } catch {
        setSaveStatus('error');
      }
    };

    saveGameRecord();
  }, [showContent, user, scenario, affection, won]);

  // 生成分析内容
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
      
      if (won) {
        const positiveTriggers = ruleTriggers.filter(r => r.ruleType === 'positive');
        const tips = [
          `🎉 恭喜你成功哄好了${role?.name}！`,
          '',
          '✨ 做得好的地方：',
          ...positiveTriggers.slice(0, 3).map(t => `• ${t.ruleName}（+${t.scoreChange}分）`),
          '',
          `📊 数据统计：`,
          `• 用时：${step - 1} 轮`,
          `• 最终好感度：${affection}`,
        ];
        setAnalysis(tips);
      } else {
        const negativeTriggers = ruleTriggers.filter(r => r.ruleType === 'negative');
        const tips = [
          `😢 可惜，${role?.name}还是没有原谅你...`,
          '',
          '❌ 问题分析：',
          ...negativeTriggers.slice(0, 3).map(t => `• ${t.ruleName}（${t.scoreChange}分）`),
          '',
          '💡 下次试试：',
          '• 真诚道歉 + 具体弥补方案',
          '• 表达理解对方的感受',
          '• 避免找借口或转移话题',
        ];
        setAnalysis(tips);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [won, role, ruleTriggers, step, affection]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 z-50 flex flex-col">
      {/* 动画背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {won ? (
          Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              {['💖', '💕', '✨', '🎉', '💗'][Math.floor(Math.random() * 5)]}
            </div>
          ))
        ) : (
          Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-fade-in text-xl opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1}s`,
              }}
            >
              💔
            </div>
          ))
        )}
      </div>

      {/* 内容 */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-6">
        {/* 结果图标 */}
        <div className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center mb-6",
          won ? "bg-green-100" : "bg-red-100"
        )}>
          {won ? (
            <Heart className="w-12 h-12 text-green-500 animate-pulse" />
          ) : (
            <HeartCrack className="w-12 h-12 text-red-500" />
          )}
        </div>

        {/* 标题 */}
        <h1 className={cn(
          "text-2xl font-bold mb-2",
          won ? "text-green-600" : "text-red-600"
        )}>
          {won ? '哄成功了！' : '哄失败了...'}
        </h1>

        {/* 角色名 */}
        <p className="text-gray-500 mb-6">
          {role?.avatarEmoji} {role?.name}
        </p>

        {/* 保存状态提示 */}
        {showContent && (
          <div className="space-y-3 w-full max-w-md">
            {/* 游戏记录保存状态 */}
            <div className={cn(
              "rounded-2xl p-4 shadow-lg animate-fade-in",
              saveStatus === 'saving' && "bg-blue-50",
              saveStatus === 'saved' && "bg-green-50",
              saveStatus === 'error' && "bg-red-50",
              showLoginTip && "bg-yellow-50",
            )}>
              {saveStatus === 'saving' && (
                <p className="text-sm text-blue-600 text-center">正在保存游戏记录...</p>
              )}
              {saveStatus === 'saved' && (
                <p className="text-sm text-green-600 text-center">✓ 您的游戏记录已经保存</p>
              )}
              {saveStatus === 'error' && (
                <p className="text-sm text-red-600 text-center">保存记录失败，请稍后重试</p>
              )}
              {showLoginTip && !user && (
                <div className="text-center">
                  <p className="text-sm text-yellow-700 mb-2">登录后可保存你的游戏记录</p>
                  <Link
                    href="/login"
                    className="text-sm text-pink-500 hover:text-pink-600 font-medium"
                  >
                    立即登录 →
                  </Link>
                </div>
              )}
            </div>

            {/* 排行榜新纪录提示 */}
            {leaderboardStatus === 'newRecord' && (
              <div className="bg-yellow-50 rounded-2xl p-4 shadow-lg animate-fade-in">
                <div className="flex items-center justify-center gap-2 text-yellow-700">
                  <span className="text-xl">🏆</span>
                  <p className="text-sm font-medium">恭喜打破个人最高纪录！</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 分析内容 */}
        {showContent && (
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg mb-6 animate-fade-in">
            {analysis.map((line, i) => (
              <p 
                key={i} 
                className={cn(
                  "text-sm",
                  line.startsWith('🎉') || line.startsWith('😢') ? "font-bold text-base mb-2" :
                  line.startsWith('✨') || line.startsWith('❌') || line.startsWith('📊') || line.startsWith('💡') 
                    ? "font-medium text-gray-800 mt-3 mb-1" :
                  "text-gray-600"
                )}
              >
                {line}
              </p>
            ))}
          </div>
        )}

        {/* 成功彩蛋：角色反过来哄 */}
        {won && showContent && (
          <div className="w-full max-w-md bg-pink-50 rounded-2xl p-4 shadow mb-6 animate-fade-in">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{role?.avatarEmoji}</span>
              <div>
                <p className="text-sm text-gray-600 italic">
                  "其实...我也不是真的那么生气啦。下次不许这样了，知道吗？"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        {showContent && (
          <div className="flex gap-3 animate-fade-in">
            <button
              onClick={onRestart}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-medium",
                "bg-pink-500 text-white hover:bg-pink-600",
                "transition-colors"
              )}
            >
              <RotateCcw className="w-4 h-4" />
              再玩一次
            </button>
            <button
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-medium",
                "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50",
                "transition-colors"
              )}
            >
              <Share2 className="w-4 h-4" />
              分享
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fall {
          animation: fall 3s linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
