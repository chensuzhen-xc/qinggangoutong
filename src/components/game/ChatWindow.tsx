'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  messages: Message[];
  partnerAvatar?: string;
  partnerName?: string;
  isLoading?: boolean;
}

export function ChatWindow({ 
  messages, 
  partnerAvatar = '👩', 
  partnerName = 'TA',
  isLoading 
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-2",
            message.role === 'user' ? "flex-row-reverse" : "flex-row"
          )}
        >
          {/* 头像 */}
          <div className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg",
            message.role === 'user' ? "bg-blue-100" : "bg-pink-100"
          )}>
            {message.role === 'user' ? '😊' : partnerAvatar}
          </div>

          {/* 消息气泡 */}
          <div className={cn(
            "max-w-[75%] px-4 py-3 rounded-2xl",
            message.role === 'user' 
              ? "bg-blue-500 text-white rounded-br-md" 
              : "bg-white text-gray-800 rounded-bl-md shadow-sm"
          )}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            
            {/* 好感度变化提示 */}
            {message.role === 'user' && message.scoreChange !== undefined && message.scoreChange !== 0 && (
              <div className={cn(
                "mt-1 text-xs",
                message.scoreChange > 0 ? "text-green-200" : "text-red-200"
              )}>
                {message.scoreChange > 0 ? '+' : ''}{message.scoreChange}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* 加载动画 */}
      {isLoading && (
        <div className="flex gap-2">
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg bg-pink-100">
            {partnerAvatar}
          </div>
          <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <span className="inline-block w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="inline-block w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="inline-block w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
