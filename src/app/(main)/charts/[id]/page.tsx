"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  Printer,
  Pill,
  TestTubes,
  AlertTriangle,
  Heart,
  Plus,
  Trash2,
  Thermometer,
  Activity,
  Wind,
  Weight,
  User,
  Shield,
  Droplets,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const patientInfo = {
  name: "이미영",
  chartNo: "C-2024-0023",
  gender: "여",
  age: 32,
  bloodType: "B+",
  allergies: "없음",
  insurance: "건강보험",
};

const vitalSigns = {
  bp: "118/76",
  pulse: 88,
  temp: 38.2,
  resp: 20,
  spo2: 97,
  weight: 58.5,
};

export default function ChartDetailPage() {
  const [soap, setSoap] = useState({
    subjective: "3일 전부터 기침이 시작되었으며, 어제부터 발열 동반.\n마른 기침이 점차 가래를 동반하는 기침으로 변화.\n인후통 동반, 두통은 경미.\n식욕 감소, 전신 피로감 호소.",
    objective: "체온 38.2°C, 인후 발적(+), 편도 비대(-)\n양측 폐 청진: 수포음(-), 천명음(-)\n흉부 X-ray: 특이소견 없음",
    assessment: "급성 기관지염 (J20.9)\nR/O 상기도감염",
    plan: "1. 약물 처방: 항생제(아목시실린), 해열진통제, 거담제\n2. 3일 후 재진\n3. 증상 악화 시 즉시 내원 안내\n4. 수분 섭취 권장, 충분한 휴식",
  });

  const [prescriptionItems] = useState([
    { medicine: "아목시실린 500mg", dosage: "1회 1캡슐", frequency: "1일 3회", duration: 5, route: "경구" },
    { medicine: "타이레놀 500mg", dosage: "1회 1정", frequency: "1일 3회", duration: 3, route: "경구" },
    { medicine: "뮤코펙트 30mg", dosage: "1회 1정", frequency: "1일 3회", duration: 5, route: "경구" },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/charts">
            <button className="rounded-xl p-3 text-gray-400 hover:bg-gray-100 transition-colors">
              <ArrowLeft size={24} />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">진료 기록</h1>
            <p className="mt-1 text-lg text-gray-500">2024-03-15 진료</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg"><Printer size={18} /> 인쇄</Button>
          <Button size="lg"><Save size={18} /> 저장</Button>
        </div>
      </div>

      {/* Patient Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
              <User size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-extrabold">{patientInfo.name}</h2>
                <span className="rounded-lg bg-white/20 px-3 py-1 text-sm font-semibold">{patientInfo.chartNo}</span>
              </div>
              <div className="mt-1 flex items-center gap-4 text-blue-100">
                <span className="text-lg">{patientInfo.gender} / {patientInfo.age}세</span>
                <span className="flex items-center gap-1"><Droplets size={16} /> {patientInfo.bloodType}</span>
                <span className="flex items-center gap-1"><Shield size={16} /> {patientInfo.insurance}</span>
              </div>
            </div>
          </div>
          <div>
            {patientInfo.allergies !== "없음" ? (
              <div className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-bold">
                <AlertTriangle size={20} /> 알레르기: {patientInfo.allergies}
              </div>
            ) : (
              <div className="rounded-xl bg-white/10 px-5 py-3 text-sm text-blue-100">
                알레르기 없음
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vitals Row */}
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
        {[
          { label: "혈압", value: vitalSigns.bp, unit: "mmHg", icon: Activity, color: "blue", alert: false },
          { label: "맥박", value: vitalSigns.pulse, unit: "bpm", icon: Heart, color: "pink", alert: false },
          { label: "체온", value: `${vitalSigns.temp}°C`, unit: "", icon: Thermometer, color: "red", alert: vitalSigns.temp >= 37.5 },
          { label: "호흡", value: vitalSigns.resp, unit: "/min", icon: Wind, color: "sky", alert: false },
          { label: "SpO2", value: `${vitalSigns.spo2}%`, unit: "", icon: Activity, color: "purple", alert: false },
          { label: "체중", value: `${vitalSigns.weight}`, unit: "kg", icon: Weight, color: "gray", alert: false },
        ].map((v) => (
          <div key={v.label} className={`rounded-2xl border-2 ${v.alert ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"} p-4 text-center`}>
            <p className="text-sm font-semibold text-gray-500">{v.label}</p>
            <p className={`mt-1 text-2xl font-extrabold ${v.alert ? "text-red-600" : "text-gray-900"}`}>
              {v.value}
            </p>
            {v.unit && <p className="text-xs text-gray-400">{v.unit}</p>}
          </div>
        ))}
      </div>

      {/* SOAP Notes */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {[
          { key: "subjective" as const, label: "S", title: "Subjective (주관적 소견)", color: "border-l-blue-500 bg-blue-50/30" },
          { key: "objective" as const, label: "O", title: "Objective (객관적 소견)", color: "border-l-emerald-500 bg-emerald-50/30" },
          { key: "assessment" as const, label: "A", title: "Assessment (평가/진단)", color: "border-l-amber-500 bg-amber-50/30" },
          { key: "plan" as const, label: "P", title: "Plan (치료계획)", color: "border-l-purple-500 bg-purple-50/30" },
        ].map((section) => (
          <div key={section.key} className={`rounded-2xl border-2 border-l-[6px] ${section.color} p-5`}>
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-extrabold text-gray-700 shadow-sm">
                {section.label}
              </span>
              <h3 className="text-[15px] font-bold text-gray-700">{section.title}</h3>
            </div>
            <textarea
              value={soap[section.key]}
              onChange={(e) => setSoap({ ...soap, [section.key]: e.target.value })}
              rows={section.key === "subjective" || section.key === "objective" ? 7 : 5}
              className="w-full rounded-xl border-2 border-gray-200 bg-white p-4 text-[15px] leading-relaxed text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>
        ))}
      </div>

      {/* Prescription */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-2.5">
              <Pill size={22} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">처방</h3>
            <Badge variant="info" size="sm">{prescriptionItems.length}건</Badge>
          </div>
          <Button variant="outline">
            <Plus size={18} /> 약품 추가
          </Button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-50/80">
              <th className="px-5 py-4 text-left text-sm font-bold text-gray-500">약품명</th>
              <th className="px-5 py-4 text-left text-sm font-bold text-gray-500">1회 용량</th>
              <th className="px-5 py-4 text-left text-sm font-bold text-gray-500">투여횟수</th>
              <th className="px-5 py-4 text-left text-sm font-bold text-gray-500">일수</th>
              <th className="px-5 py-4 text-left text-sm font-bold text-gray-500">경로</th>
              <th className="px-5 py-4 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {prescriptionItems.map((item, idx) => (
              <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-5 py-4 text-[15px] font-semibold text-gray-900">{item.medicine}</td>
                <td className="px-5 py-4 text-[15px] text-gray-600">{item.dosage}</td>
                <td className="px-5 py-4 text-[15px] text-gray-600">{item.frequency}</td>
                <td className="px-5 py-4 text-[15px] font-semibold text-gray-900">{item.duration}일</td>
                <td className="px-5 py-4 text-[15px] text-gray-600">{item.route}</td>
                <td className="px-5 py-4">
                  <button className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lab Order */}
      <div className="rounded-2xl border-2 border-gray-200 bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-50 p-2.5">
              <TestTubes size={22} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">검사 오더</h3>
          </div>
          <Button variant="outline">
            <Plus size={18} /> 검사 추가
          </Button>
        </div>
        <div className="rounded-xl border-2 border-dashed border-gray-300 p-10 text-center">
          <TestTubes size={32} className="mx-auto text-gray-300" />
          <p className="mt-3 text-lg text-gray-400">추가된 검사가 없습니다</p>
          <p className="text-sm text-gray-300">위 버튼을 클릭하여 검사를 추가하세요</p>
        </div>
      </div>
    </div>
  );
}
