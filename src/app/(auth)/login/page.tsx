"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saveId, setSaveId] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 실제 인증 로직
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#dce3ed] relative overflow-hidden">
      {/* 왼쪽 의사 일러스트 */}
      <div className="absolute left-[calc(50%-370px)] bottom-[calc(50%-180px)] w-[200px] h-[280px] pointer-events-none hidden lg:block">
        <svg viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 의사 캐릭터 - 왼쪽 */}
          <ellipse cx="100" cy="270" rx="60" ry="8" fill="#c4d0e0" opacity="0.5" />
          {/* 바지 */}
          <path d="M70 180 L60 260 L90 260 L95 200 L105 200 L110 260 L140 260 L130 180Z" fill="#5cc8d9" />
          {/* 상의 (가운) */}
          <path d="M65 100 L60 185 L140 185 L135 100 Q100 90 65 100Z" fill="white" />
          {/* 가운 안쪽 */}
          <rect x="85" y="110" width="30" height="70" rx="2" fill="#5cc8d9" opacity="0.3" />
          {/* 넥타이 */}
          <path d="M97 105 L100 145 L103 105Z" fill="#2a7ab5" />
          {/* 팔 왼쪽 */}
          <path d="M65 105 L40 160 L50 165 L70 115Z" fill="white" />
          {/* 팔 오른쪽 (들고있는) */}
          <path d="M135 105 L155 145 L160 140 L140 100Z" fill="white" />
          {/* 손 */}
          <circle cx="45" cy="163" r="8" fill="#f5c6a0" />
          <circle cx="158" cy="142" r="8" fill="#f5c6a0" />
          {/* 클립보드 */}
          <rect x="148" y="128" width="25" height="30" rx="3" fill="#4a90c4" />
          <rect x="152" y="135" width="17" height="2" rx="1" fill="white" opacity="0.6" />
          <rect x="152" y="140" width="17" height="2" rx="1" fill="white" opacity="0.6" />
          <rect x="152" y="145" width="12" height="2" rx="1" fill="white" opacity="0.6" />
          {/* 머리 */}
          <ellipse cx="100" cy="75" rx="30" ry="35" fill="#f5c6a0" />
          {/* 머리카락 */}
          <path d="M70 65 Q75 35 100 30 Q125 35 130 65 Q125 50 100 48 Q75 50 70 65Z" fill="#3a5a8c" />
          {/* 눈 */}
          <circle cx="90" cy="72" r="2.5" fill="#333" />
          <circle cx="110" cy="72" r="2.5" fill="#333" />
          {/* 입 */}
          <path d="M93 82 Q100 87 107 82" stroke="#333" strokeWidth="1.5" fill="none" />
          {/* 안경 */}
          <circle cx="90" cy="72" r="8" stroke="#3a5a8c" strokeWidth="1.5" fill="none" />
          <circle cx="110" cy="72" r="8" stroke="#3a5a8c" strokeWidth="1.5" fill="none" />
          <line x1="98" y1="72" x2="102" y2="72" stroke="#3a5a8c" strokeWidth="1.5" />
        </svg>
      </div>

      {/* 오른쪽 의료진 일러스트 */}
      <div className="absolute right-[calc(50%-370px)] bottom-[calc(50%-180px)] w-[180px] h-[280px] pointer-events-none hidden lg:block">
        <svg viewBox="0 0 180 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* 그림자 */}
          <ellipse cx="90" cy="270" rx="55" ry="8" fill="#c4d0e0" opacity="0.5" />
          {/* 바지 */}
          <path d="M60 185 L50 260 L80 260 L85 205 L95 205 L100 260 L130 260 L120 185Z" fill="#1a4a7a" />
          {/* 상의 */}
          <path d="M55 105 L55 190 L125 190 L125 105 Q90 95 55 105Z" fill="#7ec8e3" />
          {/* 팔 왼쪽 */}
          <path d="M55 110 L30 170 L42 175 L62 118Z" fill="#7ec8e3" />
          {/* 팔 오른쪽 */}
          <path d="M125 110 L148 155 L155 148 L130 105Z" fill="#7ec8e3" />
          {/* 손 */}
          <circle cx="36" cy="173" r="8" fill="#f5c6a0" />
          <circle cx="150" cy="150" r="8" fill="#f5c6a0" />
          {/* 청진기 */}
          <path d="M80 115 Q60 140 65 165" stroke="#333" strokeWidth="2" fill="none" />
          <circle cx="65" cy="168" r="5" fill="#333" />
          {/* 머리 */}
          <ellipse cx="90" cy="75" rx="28" ry="33" fill="#f5c6a0" />
          {/* 머리카락 */}
          <path d="M62 65 Q70 30 90 25 Q110 30 118 65 L115 55 Q105 40 90 38 Q75 40 65 55Z" fill="#2a5a3a" />
          {/* 수술모 */}
          <path d="M62 58 Q65 40 90 35 Q115 40 118 58 Q110 50 90 48 Q70 50 62 58Z" fill="#5cc8d9" />
          {/* 눈 */}
          <circle cx="80" cy="72" r="2.5" fill="#333" />
          <circle cx="100" cy="72" r="2.5" fill="#333" />
          {/* 입 */}
          <path d="M83 83 Q90 87 97 83" stroke="#333" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* 로그인 카드 */}
      <div className="relative z-10 w-full max-w-[420px] bg-white rounded-2xl shadow-lg px-10 py-12">
        {/* 로고 */}
        <div className="mb-10">
          <h1 className="text-3xl font-light tracking-tight">
            <span className="text-[#6b9dc2]">Dr.</span>
            <br />
            <span className="text-[#8bafc4] text-4xl">palette</span>
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          {/* 이메일 */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              type="email"
              placeholder="palette@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-b border-gray-300 focus:border-[#6b9dc2] outline-none text-sm text-gray-700 placeholder:text-gray-400 transition-colors"
            />
          </div>

          {/* 비밀번호 */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              type="password"
              placeholder="••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-b border-gray-300 focus:border-[#6b9dc2] outline-none text-sm text-gray-700 placeholder:text-gray-400 transition-colors"
            />
          </div>

          {/* ID 저장 & 비밀번호 찾기 */}
          <div className="flex items-center justify-between pt-3 pb-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={saveId}
                onChange={(e) => setSaveId(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-gray-300 text-[#6b9dc2] focus:ring-[#6b9dc2]"
              />
              <span className="text-xs text-gray-500">ID 저장</span>
            </label>
            <button type="button" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              비밀번호를 잊으셨나요?
            </button>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full py-2.5 bg-[#a8c8e0] hover:bg-[#8bb5d4] text-white text-sm rounded-md transition-colors"
          >
            로그인
          </button>

          {/* 회원가입 버튼 */}
          <button
            type="button"
            className="w-full py-2.5 border border-gray-300 text-gray-500 text-sm rounded-md hover:bg-gray-50 transition-colors"
          >
            회원가입
          </button>
        </form>

        {/* 저작권 */}
        <p className="text-center text-[10px] text-gray-300 mt-6">ⓒ 주식회사 닥터팔레트</p>
      </div>
    </div>
  );
}
