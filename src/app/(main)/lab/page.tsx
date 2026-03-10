"use client";

import { FlaskConical } from "lucide-react";

export default function LabPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-[#F4F6FA]">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 shadow-sm flex items-center justify-center mx-auto mb-4">
          <FlaskConical className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-lg font-bold text-gray-900 mb-1">검사</h1>
        <p className="text-sm text-gray-400">서비스 준비중</p>
        <span className="inline-block mt-3 text-[11px] text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium">
          기획중
        </span>
      </div>
    </div>
  );
}
