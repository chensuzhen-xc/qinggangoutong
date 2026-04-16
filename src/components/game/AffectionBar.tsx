'use client';

import { getEmotionState } from '@/types';
import { useGame } from '@/context/GameContext';
import { cn } from '@/lib/utils';

export function AffectionBar() {
  const { state } = useGame();
  const { affection, step } = state;

  const emotionState = getEmotionState(affection);
  const progressWidth = Math.max(0, Math.min(100, ((affection + 50) / 150) * 100));

  const getColorClass = () => {
    if (affection < 0) return 'bg-red-500';
    if (affection < 50) return 'bg-yellow-500';
    if (affection < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-b">
      <div className="max-w-lg mx-auto">
        {/* 标题行 */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            第 {step} / 10 轮
          </span>
          <span className={cn(
            "text-sm font-medium",
            affection >= 80 ? "text-green-600" :
            affection >= 60 ? "text-blue-600" :
            affection >= 30 ? "text-yellow-600" :
            affection > 0 ? "text-orange-600" : "text-red-600"
          )}>
            {emotionState.label}
          </span>
        </div>

        {/* 进度条 */}
        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
          {/* 背景刻度 */}
          <div className="absolute inset-0 flex">
            <div className="w-1/3 border-r border-gray-200" />
            <div className="w-1/3 border-r border-gray-200" />
            <div className="w-1/3" />
          </div>
          
          {/* 进度 */}
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              getColorClass()
            )}
            style={{ width: `${progressWidth}%` }}
          />
          
          {/* 胜利线 */}
          <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-green-400 opacity-50" />
        </div>

        {/* 分数显示 */}
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">-50</span>
          <span className="text-xs font-medium text-gray-600">
            好感度: {affection}
          </span>
          <span className="text-xs text-gray-400">100</span>
        </div>
      </div>
    </div>
  );
}
