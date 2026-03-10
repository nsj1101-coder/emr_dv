"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Building2, User, Shield, Database, Bell, Palette } from "lucide-react";
import { useState } from "react";

type Tab = "hospital" | "account" | "notification" | "system";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("hospital");

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "hospital", label: "병원 정보", icon: Building2 },
    { key: "account", label: "계정 관리", icon: User },
    { key: "notification", label: "알림 설정", icon: Bell },
    { key: "system", label: "시스템", icon: Database },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">설정</h1>
        <p className="text-sm text-gray-500">시스템 및 병원 정보 설정</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <nav className="w-48 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "hospital" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>병원 기본 정보</CardTitle>
                  <CardDescription>병원의 기본 정보를 설정합니다</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input label="병원명" defaultValue="메디차트 의원" />
                    <Input label="대표자" defaultValue="김의사" />
                    <Input label="사업자등록번호" defaultValue="123-45-67890" />
                    <Input label="전화번호" defaultValue="02-1234-5678" />
                    <Input label="팩스번호" defaultValue="02-1234-5679" />
                    <Input label="요양기관번호" defaultValue="12345678" />
                  </div>
                  <div className="mt-4">
                    <Input label="주소" defaultValue="서울시 강남구 테헤란로 123, 4층" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>진료 시간</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["월요일", "화요일", "수요일", "목요일", "금요일"].map((day) => (
                      <div key={day} className="flex items-center gap-4">
                        <span className="w-16 text-sm font-medium text-gray-700">{day}</span>
                        <Input type="time" defaultValue="09:00" className="w-32" />
                        <span className="text-gray-400">~</span>
                        <Input type="time" defaultValue="18:00" className="w-32" />
                        <span className="text-xs text-gray-500">(점심 12:30~13:30)</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-4">
                      <span className="w-16 text-sm font-medium text-gray-700">토요일</span>
                      <Input type="time" defaultValue="09:00" className="w-32" />
                      <span className="text-gray-400">~</span>
                      <Input type="time" defaultValue="13:00" className="w-32" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button>변경사항 저장</Button>
              </div>
            </>
          )}

          {activeTab === "account" && (
            <Card>
              <CardHeader>
                <CardTitle>내 계정</CardTitle>
                <CardDescription>계정 정보를 관리합니다</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input label="이름" defaultValue="김의사" />
                  <Input label="이메일" defaultValue="doctor.kim@medichart.kr" type="email" />
                  <Select label="역할" options={[
                    { value: "DOCTOR", label: "의사" },
                    { value: "NURSE", label: "간호사" },
                    { value: "ADMIN", label: "관리자" },
                    { value: "RECEPTIONIST", label: "접수" },
                  ]} />
                  <Input label="전문과" defaultValue="내과" />
                  <Input label="면허번호" defaultValue="12345" />
                  <Input label="연락처" defaultValue="010-9999-8888" />
                </div>
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="mb-4 text-sm font-semibold text-gray-900">비밀번호 변경</h4>
                  <div className="grid grid-cols-1 gap-4 max-w-sm">
                    <Input label="현재 비밀번호" type="password" />
                    <Input label="새 비밀번호" type="password" />
                    <Input label="비밀번호 확인" type="password" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button>저장</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notification" && (
            <Card>
              <CardHeader>
                <CardTitle>알림 설정</CardTitle>
                <CardDescription>알림 수신 방법을 설정합니다</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "신규 예약 알림", desc: "새로운 예약이 등록되면 알림을 받습니다" },
                    { label: "접수 알림", desc: "환자가 접수하면 알림을 받습니다" },
                    { label: "검사 결과 알림", desc: "검사 결과가 나오면 알림을 받습니다" },
                    { label: "미수납 알림", desc: "미수납 건이 발생하면 알림을 받습니다" },
                    { label: "시스템 알림", desc: "시스템 업데이트 등 중요 알림을 받습니다" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" defaultChecked />
                        <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "system" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>데이터베이스</CardTitle>
                  <CardDescription>데이터 관리 옵션</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                      <div>
                        <p className="text-sm font-medium">데이터 백업</p>
                        <p className="text-xs text-gray-500">마지막 백업: 2024-03-15 02:00</p>
                      </div>
                      <Button variant="outline" size="sm">백업 실행</Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                      <div>
                        <p className="text-sm font-medium">데이터 내보내기</p>
                        <p className="text-xs text-gray-500">전체 데이터를 Excel로 내보냅니다</p>
                      </div>
                      <Button variant="outline" size="sm">내보내기</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>시스템 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between"><dt className="text-gray-500">버전</dt><dd>MediChart EMR v1.0.0</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">라이선스</dt><dd>Standard</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">데이터베이스</dt><dd>PostgreSQL 16</dd></div>
                    <div className="flex justify-between"><dt className="text-gray-500">서버 상태</dt><dd className="text-green-600 font-medium">정상</dd></div>
                  </dl>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
