'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, User, LogOut } from 'lucide-react';

interface HeaderNavProps {
  showBack?: boolean;
  backHref?: string;
  title?: string;
}

export function HeaderNav({ showBack = false, backHref = '/', title }: HeaderNavProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* 左侧 */}
        <div className="flex items-center">
          {showBack ? (
            <Link 
              href={backHref}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>返回</span>
            </Link>
          ) : title ? (
            <h1 className="text-lg font-bold text-gray-800">{title}</h1>
          ) : (
            <Link href="/" className="text-xl font-bold text-pink-500">
              哄哄模拟器
            </Link>
          )}
        </div>

        {/* 右侧 - 根据登录状态显示不同内容 */}
        <div className="flex items-center gap-3">
          {user ? (
            // 已登录状态
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{user.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>退出</span>
              </button>
            </>
          ) : (
            // 未登录状态
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 text-sm text-pink-500 font-medium hover:text-pink-600 transition-colors"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="px-3 py-1.5 text-sm bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
