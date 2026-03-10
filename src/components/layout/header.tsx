"use client";

import { Bell, Search, User, LogOut } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">
      {/* Search */}
      <div className="flex flex-1 items-center gap-2">
        <div className="relative w-full max-w-xl">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="환자 검색 (이름, 차트번호, 전화번호)"
            className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-[15px] text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-xl p-3 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <Bell size={22} />
          <span className="absolute right-2 top-2 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
          </span>
        </button>
        <div className="h-8 w-px bg-gray-200" />
        <div className="flex items-center gap-3 rounded-xl border-2 border-gray-200 px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600">
            <User size={18} className="text-white" />
          </div>
          <div>
            <p className="text-[15px] font-bold text-gray-900">김의사</p>
            <p className="text-xs text-gray-500">내과 전문의</p>
          </div>
        </div>
      </div>
    </header>
  );
}
