'use client';

import { useState, useRef, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { cn } from '@/lib/utils';
import { Send, Mic, Lightbulb, MicOff } from 'lucide-react';

export function InputArea() {
  const { state, sendMessage, useHelp, canUseHelp } = useGame();
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [helpText, setHelpText] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = state.isLoading || state.gameOver;

  // 处理发送
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  // 处理按键
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 处理语音输入
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('您的浏览器不支持语音识别');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const recognition = new (window as unknown as { webkitSpeechRecognition: new () => { lang: string; continuous: boolean; interimResults: boolean; onresult: (event: { results: { transcript: string }[][] }) => void; onerror: () => void; onend: () => void; start: () => void; stop: () => void } }).webkitSpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setInput(text);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    setIsRecording(true);
  };

  // 处理求助
  const handleHelp = async () => {
    if (!canUseHelp()) {
      setHelpText('本局求助次数已用完（最多3次）');
      setShowHelp(true);
      return;
    }

    const result = await useHelp();
    setHelpText(result);
    setShowHelp(true);
  };

  // 自动聚焦
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  return (
    <div className="border-t bg-white/90 backdrop-blur-sm p-4">
      {/* 求助提示 */}
      {showHelp && (
        <div className="mb-3 p-3 bg-amber-50 rounded-xl text-sm text-amber-800 relative">
          <button
            onClick={() => setShowHelp(false)}
            className="absolute top-2 right-2 text-amber-400 hover:text-amber-600"
          >
            ×
          </button>
          {helpText}
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* 求助按钮 */}
        <button
          onClick={handleHelp}
          disabled={isLoading}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
            "bg-amber-100 text-amber-600 hover:bg-amber-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors"
          )}
          title="求助"
        >
          <Lightbulb className="w-5 h-5" />
        </button>

        {/* 输入框 */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="说点什么哄哄TA..."
            disabled={isLoading}
            className={cn(
              "w-full px-4 py-3 pr-12 rounded-xl resize-none",
              "bg-gray-100 focus:bg-white focus:ring-2 focus:ring-pink-300",
              "placeholder:text-gray-400",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all"
            )}
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
        </div>

        {/* 语音按钮 */}
        <button
          onClick={handleVoiceInput}
          disabled={isLoading}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
            isRecording 
              ? "bg-red-100 text-red-600 animate-pulse" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-colors"
          )}
          title={isRecording ? "停止录音" : "语音输入"}
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* 发送按钮 */}
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
            "bg-pink-500 text-white hover:bg-pink-600",
            "disabled:bg-gray-200 disabled:text-gray-400",
            "disabled:cursor-not-allowed",
            "transition-colors"
          )}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* 提示 */}
      <p className="text-xs text-gray-400 mt-2 text-center">
        按 Enter 发送 · 还能求助 {3 - state.helpUsedCount} 次
      </p>
    </div>
  );
}
