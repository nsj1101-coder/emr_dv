"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
} from "lucide-react";

const revenueRows = [
  { label: "총 환자", value: "342명", prevValue: "316명", change: "+8.2%", positive: true },
  { label: "총매출", value: "₩45,230,000", prevValue: "₩40,200,000", change: "+12.5%", positive: true },
  { label: "급여 총액", value: "₩28,450,000", prevValue: "₩26,080,000", change: "+9.1%", positive: true },
  { label: "공단 부담금", value: "₩19,200,000", prevValue: "₩17,890,000", change: "+7.3%", positive: true },
  { label: "본인 부담금", value: "₩9,250,000", prevValue: "₩8,300,000", change: "+11.4%", positive: true },
  { label: "비급여총액", value: "₩12,800,000", prevValue: "₩11,060,000", change: "+15.7%", positive: true },
  { label: "자보청구 총액", value: "₩3,980,000", prevValue: "₩4,074,000", change: "-2.3%", positive: false },
  { label: "지원금", value: "₩850,000", prevValue: "₩809,500", change: "+5.0%", positive: true },
  { label: "할인금", value: "₩320,000", prevValue: "₩308,300", change: "+3.8%", positive: true },
  { label: "선납금 관리 총액", value: "₩2,150,000", prevValue: "₩2,024,500", change: "+6.2%", positive: true },
  { label: "선납금 입금 총액", value: "₩1,800,000", prevValue: "₩1,722,600", change: "+4.5%", positive: true },
  { label: "선납금 출금 총액", value: "₩350,000", prevValue: "₩354,200", change: "-1.2%", positive: false },
];

const monthlyRevenue = [
  { month: "1월", value: 38200000, display: "3,820만" },
  { month: "2월", value: 35800000, display: "3,580만" },
  { month: "3월", value: 45230000, display: "4,523만" },
  { month: "4월", value: 41500000, display: "4,150만" },
  { month: "5월", value: 39700000, display: "3,970만" },
  { month: "6월", value: 42100000, display: "4,210만" },
  { month: "7월", value: 36900000, display: "3,690만" },
  { month: "8월", value: 34500000, display: "3,450만" },
  { month: "9월", value: 40200000, display: "4,020만" },
  { month: "10월", value: 43800000, display: "4,380만" },
  { month: "11월", value: 41300000, display: "4,130만" },
  { month: "12월", value: 44100000, display: "4,410만" },
];

const maxMonthly = Math.max(...monthlyRevenue.map((d) => d.value));

export default function RevenueStatisticsPage() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(3);

  const handlePrev = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNext = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const totalRevenue = revenueRows.find((r) => r.label === "총매출");

  return (
    <div className="h-screen flex flex-col bg-[#F4F6FA]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h1 className="text-[15px] font-semibold text-gray-900">매출 통계</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
          <div className="flex items-center gap-2">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ))}
            </select>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}월
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleNext}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
          <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg">
            {year}년 {month}월
          </span>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors border border-gray-200">
            <Download className="w-3.5 h-3.5" />
            내보내기
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Summary Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div>
              <span className="text-[11px] text-gray-400 block mb-0.5">총 환자수</span>
              <span className="text-lg font-bold text-gray-900">342명</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <span className="text-[11px] text-gray-400 block mb-0.5">총 매출</span>
              <span className="text-lg font-bold text-blue-600">₩45,230,000</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <span className="text-[11px] text-gray-400 block mb-0.5">급여</span>
              <span className="text-[15px] font-bold text-gray-800">₩28,450,000</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <span className="text-[11px] text-gray-400 block mb-0.5">비급여</span>
              <span className="text-[15px] font-bold text-gray-800">₩12,800,000</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-500">+12.5%</span>
            <span className="text-[11px] text-gray-400 ml-1">전월대비</span>
          </div>
        </div>

        {/* Revenue Detail Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-gray-900">매출 상세 내역</h2>
            <span className="text-[11px] text-gray-400">{year}년 {month}월 기준</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-[11px] font-semibold text-gray-500 text-left py-2.5 px-5 w-[50px]">No</th>
                <th className="text-[11px] font-semibold text-gray-500 text-left py-2.5 px-4">항목</th>
                <th className="text-[11px] font-semibold text-gray-500 text-right py-2.5 px-4">당월</th>
                <th className="text-[11px] font-semibold text-gray-500 text-right py-2.5 px-4">전월</th>
                <th className="text-[11px] font-semibold text-gray-500 text-right py-2.5 px-5 w-[120px]">증감률</th>
              </tr>
            </thead>
            <tbody>
              {revenueRows.map((row, i) => {
                const isTotal = row.label === "총매출";
                return (
                  <tr
                    key={row.label}
                    className={`border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors ${
                      isTotal ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <td className="py-3 px-5">
                      <span className="text-[11px] text-gray-400">{i + 1}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs ${isTotal ? "font-bold text-blue-700" : "font-medium text-gray-800"}`}>
                        {row.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`text-xs font-semibold tabular-nums ${isTotal ? "text-blue-700" : "text-gray-900"}`}>
                        {row.value}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-xs text-gray-400 tabular-nums">{row.prevValue}</span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {row.positive ? (
                          <TrendingUp className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                        <span
                          className={`text-xs font-semibold tabular-nums ${
                            row.positive ? "text-emerald-500" : "text-red-500"
                          }`}
                        >
                          {row.change}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Monthly Revenue Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-semibold text-gray-900">월별 매출 추이</h2>
            <span className="text-[11px] text-gray-400">{year}년</span>
          </div>
          <div className="flex items-end gap-3 h-52">
            {monthlyRevenue.map((d, idx) => {
              const heightPct = (d.value / maxMonthly) * 100;
              const isCurrent = idx + 1 === month;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] text-gray-500 font-medium">{d.display}</span>
                  <div className="w-full flex items-end justify-center h-40">
                    <div
                      className={`w-full max-w-[40px] rounded-t-md transition-all ${
                        isCurrent ? "bg-blue-500" : "bg-blue-200"
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span
                    className={`text-[11px] ${
                      isCurrent ? "text-blue-600 font-semibold" : "text-gray-500"
                    }`}
                  >
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
