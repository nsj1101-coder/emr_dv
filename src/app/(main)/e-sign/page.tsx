"use client";

import { Construction } from "lucide-react";

export default function ESignPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-[#F4F6FA]">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-bold text-gray-900">전자서명</h1>
      </div>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <Construction className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">서비스 준비중</h2>
          <p className="text-sm leading-relaxed text-gray-500">
            해당 기능은 현재 개발 중입니다.
            <br />
            빠른 시일 내에 제공할 예정입니다.
          </p>
        </div>
      </div>
    </div>
  );
}
