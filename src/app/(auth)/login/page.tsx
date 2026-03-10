"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saveId, setSaveId] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left - Branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-white border-r border-gray-200">
        <div className="text-center">
          <h1 className="text-[80px] font-extrabold text-gray-900 leading-none tracking-tight">
            Medi<span className="text-blue-600">W</span>
          </h1>
          <p className="text-gray-400 text-base font-light mt-4 tracking-wide">
            Electronic Medical Records
          </p>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8">
        <div className="w-full max-w-[440px] bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900">
              Medi<span className="text-blue-600">W</span>
            </h1>
          </div>

          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">로그인</h2>
            <p className="text-sm text-gray-400">계정 정보를 입력하여 시작하세요</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">이메일</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">비밀번호</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveId}
                  onChange={(e) => setSaveId(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">로그인 유지</span>
              </label>
              <button type="button" className="text-xs text-gray-400 hover:text-blue-600 transition-colors">
                비밀번호 찾기
              </button>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/30 mt-2"
            >
              로그인
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[11px] text-gray-300">또는</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Sign up */}
            <button
              type="button"
              className="w-full py-3 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              회원가입
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-gray-300 mt-6">
          © 2026 MediW · 이용약관 · 개인정보처리방침
        </p>
      </div>
    </div>
  );
}
