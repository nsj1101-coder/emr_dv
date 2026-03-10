"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  UserPlus,
  Clock,
  DollarSign,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Banknote,
  Smartphone,
} from "lucide-react";

const periods = ["오늘", "이번주", "이번달", "올해"] as const;
type Period = (typeof periods)[number];

const metrics = [
  {
    label: "총 매출",
    value: "₩12,450,000",
    change: "+12.5%",
    changeLabel: "전월대비",
    positive: true,
    icon: DollarSign,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    label: "총 환자수",
    value: "342명",
    change: "+8.2%",
    changeLabel: "전월대비",
    positive: true,
    icon: Users,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  {
    label: "신규 환자",
    value: "45명",
    change: "+15.3%",
    changeLabel: "전월대비",
    positive: true,
    icon: UserPlus,
    color: "text-violet-600",
    bgColor: "bg-violet-100",
  },
  {
    label: "평균 진료시간",
    value: "18분",
    change: "-2.1%",
    changeLabel: "전월대비",
    positive: true,
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
];

const revenueData = [
  { day: "월", value: 1850000, display: "185만" },
  { day: "화", value: 2100000, display: "210만" },
  { day: "수", value: 1650000, display: "165만" },
  { day: "목", value: 2400000, display: "240만" },
  { day: "금", value: 2750000, display: "275만" },
  { day: "토", value: 1200000, display: "120만" },
  { day: "일", value: 500000, display: "50만" },
];

const maxRevenue = Math.max(...revenueData.map((d) => d.value));

const departmentData = [
  { name: "내과", count: 98, color: "bg-blue-500" },
  { name: "외과", count: 72, color: "bg-emerald-500" },
  { name: "정형외과", count: 65, color: "bg-violet-500" },
  { name: "피부과", count: 58, color: "bg-amber-500" },
  { name: "소아과", count: 49, color: "bg-rose-500" },
];

const maxDeptCount = Math.max(...departmentData.map((d) => d.count));

const topProcedures = [
  { rank: 1, name: "일반 진찰", count: 156, pct: 45 },
  { rank: 2, name: "혈액 검사", count: 98, pct: 29 },
  { rank: 3, name: "X-ray 촬영", count: 74, pct: 22 },
  { rank: 4, name: "초음파 검사", count: 52, pct: 15 },
  { rank: 5, name: "물리치료", count: 41, pct: 12 },
];

const insuranceTypes = [
  { name: "건강보험", pct: 65, color: "bg-blue-500" },
  { name: "비급여", pct: 20, color: "bg-amber-500" },
  { name: "산재보험", pct: 10, color: "bg-emerald-500" },
  { name: "자동차보험", pct: 5, color: "bg-rose-500" },
];

const recentPayments = [
  {
    date: "2026-03-10",
    time: "14:32",
    patient: "김영수",
    amount: "₩85,000",
    method: "카드",
    methodIcon: CreditCard,
    status: "완료",
  },
  {
    date: "2026-03-10",
    time: "14:15",
    patient: "이미경",
    amount: "₩120,000",
    method: "현금",
    methodIcon: Banknote,
    status: "완료",
  },
  {
    date: "2026-03-10",
    time: "13:48",
    patient: "박준혁",
    amount: "₩45,000",
    method: "카드",
    methodIcon: CreditCard,
    status: "완료",
  },
  {
    date: "2026-03-10",
    time: "13:20",
    patient: "최수연",
    amount: "₩210,000",
    method: "간편결제",
    methodIcon: Smartphone,
    status: "완료",
  },
  {
    date: "2026-03-10",
    time: "12:55",
    patient: "정하늘",
    amount: "₩65,000",
    method: "카드",
    methodIcon: CreditCard,
    status: "미수",
  },
  {
    date: "2026-03-10",
    time: "11:40",
    patient: "한소희",
    amount: "₩95,000",
    method: "현금",
    methodIcon: Banknote,
    status: "완료",
  },
  {
    date: "2026-03-09",
    time: "17:10",
    patient: "오민재",
    amount: "₩155,000",
    method: "카드",
    methodIcon: CreditCard,
    status: "완료",
  },
];

export default function StatisticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("이번달");

  return (
    <div className="h-screen flex flex-col bg-[#F4F6FA]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h1 className="text-[15px] font-semibold text-gray-900">통계</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Period tabs */}
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  selectedPeriod === period
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          {/* Date range */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <button className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-medium text-gray-700">
              2026.03.01 - 2026.03.10
            </span>
            <button className="p-1 hover:bg-gray-100 rounded">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Metrics Row */}
        <div className="grid grid-cols-4 gap-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500 font-medium">
                    {m.label}
                  </span>
                  <div className={`w-7 h-7 rounded-2xl shadow-sm ${m.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900">{m.value}</div>
                <div className="flex items-center gap-1 mt-1.5">
                  {m.positive ? (
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span
                    className={`text-[11px] font-semibold ${
                      m.positive ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {m.change}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {m.changeLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Revenue Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[13px] font-semibold text-gray-900">
                일별 매출 현황
              </h2>
              <span className="text-[11px] text-gray-400">이번주</span>
            </div>
            <div className="flex items-end gap-3 h-44">
              {revenueData.map((d) => {
                const heightPct = (d.value / maxRevenue) * 100;
                const isMax = d.value === maxRevenue;
                return (
                  <div
                    key={d.day}
                    className="flex-1 flex flex-col items-center gap-1.5"
                  >
                    <span className="text-[10px] text-gray-500 font-medium">
                      {d.display}
                    </span>
                    <div className="w-full flex items-end justify-center h-32">
                      <div
                        className={`w-full max-w-[36px] rounded-t-md transition-all ${
                          isMax ? "bg-blue-500" : "bg-blue-200"
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-gray-500">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Department Patient Count */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[13px] font-semibold text-gray-900">
                진료과별 환자수
              </h2>
              <span className="text-[11px] text-gray-400">이번달</span>
            </div>
            <div className="space-y-3">
              {departmentData.map((d) => {
                const widthPct = (d.count / maxDeptCount) * 100;
                return (
                  <div key={d.name} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-16 flex-shrink-0 text-right">
                      {d.name}
                    </span>
                    <div className="flex-1 h-6 bg-gray-50 rounded-md overflow-hidden">
                      <div
                        className={`h-full ${d.color} rounded-md transition-all`}
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-10 text-right">
                      {d.count}명
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Procedures & Insurance Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Top Procedures */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h2 className="text-[13px] font-semibold text-gray-900 mb-3">
              인기 진료 항목
            </h2>
            <div className="space-y-2.5">
              {topProcedures.map((p) => (
                <div key={p.rank} className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      p.rank <= 3
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {p.rank}
                  </span>
                  <span className="text-xs text-gray-700 flex-shrink-0 w-20">
                    {p.name}
                  </span>
                  <div className="flex-1 h-5 bg-gray-50 rounded overflow-hidden">
                    <div
                      className="h-full bg-blue-100 rounded"
                      style={{ width: `${p.pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-600 w-12 text-right">
                    {p.count}건
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Insurance Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h2 className="text-[13px] font-semibold text-gray-900 mb-3">
              보험 유형별 분포
            </h2>
            {/* Stacked bar */}
            <div className="flex h-8 rounded-lg overflow-hidden mb-4">
              {insuranceTypes.map((ins) => (
                <div
                  key={ins.name}
                  className={`${ins.color} transition-all relative group`}
                  style={{ width: `${ins.pct}%` }}
                  title={`${ins.name} ${ins.pct}%`}
                />
              ))}
            </div>
            {/* Legend list */}
            <div className="space-y-2.5">
              {insuranceTypes.map((ins) => (
                <div key={ins.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-sm ${ins.color}`} />
                    <span className="text-xs text-gray-600">{ins.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${ins.color} rounded-full`}
                        style={{ width: `${ins.pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-8 text-right">
                      {ins.pct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Payments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-semibold text-gray-900">
              최근 수납 내역
            </h2>
            <button className="text-[11px] text-blue-600 font-medium hover:text-blue-700">
              전체보기
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-[11px] font-medium text-gray-400 text-left py-2 pr-4">
                  일시
                </th>
                <th className="text-[11px] font-medium text-gray-400 text-left py-2 pr-4">
                  환자명
                </th>
                <th className="text-[11px] font-medium text-gray-400 text-right py-2 pr-4">
                  금액
                </th>
                <th className="text-[11px] font-medium text-gray-400 text-left py-2 pr-4">
                  결제수단
                </th>
                <th className="text-[11px] font-medium text-gray-400 text-right py-2">
                  상태
                </th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((p, i) => {
                const MethodIcon = p.methodIcon;
                return (
                  <tr
                    key={i}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                  >
                    <td className="py-2.5 pr-4">
                      <div className="text-xs text-gray-700">{p.date}</div>
                      <div className="text-[10px] text-gray-400">{p.time}</div>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className="text-xs font-medium text-gray-800">
                        {p.patient}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-right">
                      <span className="text-xs font-semibold text-gray-900">
                        {p.amount}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-1.5">
                        <MethodIcon className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {p.method}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          p.status === "완료"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
