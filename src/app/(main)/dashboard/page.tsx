"use client";

import { useState, useEffect } from "react";
/* eslint-disable @next/next/no-img-element */

function useCurrentTime() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return time;
}

export default function DashboardPage() {
  const now = useCurrentTime();

  const dateStr = now.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  const displayHours = (hours % 12 || 12).toString().padStart(2, "0");

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-6 py-3">
        <div />
        <div className="flex items-center gap-3">
          <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col px-10 pb-10">
        {/* 시계 영역 */}
        <div className="mt-4 mb-6">
          <p className="text-sm text-slate-500 mb-1">{dateStr}</p>
          <div className="flex items-baseline gap-3">
            <h1 className="text-7xl font-bold text-slate-800 tracking-tight tabular-nums">
              {displayHours}:{minutes} <span className="text-4xl font-medium text-slate-500">{ampm}</span>
            </h1>
          </div>
          <div className="mt-4">
            <p className="text-lg text-slate-600">
              <span className="font-semibold">최신영</span> 선생님,
            </p>
            <p className="text-lg text-slate-500">오늘 하루도 화이팅하세요!</p>
          </div>
        </div>

        {/* 일러스트 영역 */}
        
      </div>
    </div>
  );
}
