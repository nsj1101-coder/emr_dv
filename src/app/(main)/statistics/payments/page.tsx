"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Download,
} from "lucide-react";

type Tab = "수납" | "미수&환불내역";

const paymentRows = [
  { label: "총 환자", value: "298명", prevValue: "281명", change: "+6.1%", positive: true },
  { label: "총 수납", value: "₩38,750,000", prevValue: "₩35,160,000", change: "+10.2%", positive: true },
  { label: "카드 수납", value: "₩25,200,000", prevValue: "₩23,225,000", change: "+8.5%", positive: true },
  { label: "현금 수납", value: "₩8,350,000", prevValue: "₩8,626,000", change: "-3.2%", positive: false },
  { label: "청구 수납", value: "₩3,200,000", prevValue: "₩3,024,000", change: "+5.8%", positive: true },
  { label: "계좌 이체", value: "₩1,500,000", prevValue: "₩1,469,000", change: "+2.1%", positive: true },
  { label: "선납금 수납", value: "₩500,000", prevValue: "₩446,400", change: "+12.0%", positive: true },
  { label: "현금영수증", value: "₩6,230,000", prevValue: "₩5,974,000", change: "+4.3%", positive: true },
];

const dailyPayments = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  value: Math.floor(800000 + Math.random() * 1800000),
}));

const maxDaily = Math.max(...dailyPayments.map((d) => d.value));

const refundRows = [
  { label: "환불 환자수", value: "12명", prevValue: "9명" },
  { label: "총 환불 건", value: "15건", prevValue: "11건" },
  { label: "환불 금액", value: "₩2,450,000", prevValue: "₩1,870,000" },
  { label: "미수 건수", value: "23건", prevValue: "19건" },
  { label: "미수 금액", value: "₩4,870,000", prevValue: "₩3,920,000" },
];

const misuData = [
  { patientNo: "P-20260301", name: "김영수", phone: "010-1234-5678", date: "2026-03-01", receiptNo: "R-00123", amount: "₩85,000" },
  { patientNo: "P-20260215", name: "이미경", phone: "010-2345-6789", date: "2026-03-02", receiptNo: "R-00124", amount: "₩120,000" },
  { patientNo: "P-20260118", name: "박준혁", phone: "010-3456-7890", date: "2026-03-03", receiptNo: "R-00125", amount: "₩250,000" },
  { patientNo: "P-20260305", name: "최수연", phone: "010-4567-8901", date: "2026-03-04", receiptNo: "R-00126", amount: "₩180,000" },
  { patientNo: "P-20260220", name: "정하늘", phone: "010-5678-9012", date: "2026-03-05", receiptNo: "R-00127", amount: "₩95,000" },
  { patientNo: "P-20260108", name: "한소희", phone: "010-6789-0123", date: "2026-03-05", receiptNo: "R-00128", amount: "₩310,000" },
  { patientNo: "P-20260312", name: "오민재", phone: "010-7890-1234", date: "2026-03-06", receiptNo: "R-00129", amount: "₩145,000" },
  { patientNo: "P-20260225", name: "송민지", phone: "010-8901-2345", date: "2026-03-07", receiptNo: "R-00130", amount: "₩420,000" },
  { patientNo: "P-20260303", name: "강태현", phone: "010-9012-3456", date: "2026-03-08", receiptNo: "R-00131", amount: "₩75,000" },
  { patientNo: "P-20260128", name: "윤지혜", phone: "010-0123-4567", date: "2026-03-09", receiptNo: "R-00132", amount: "₩560,000" },
];

export default function PaymentsStatisticsPage() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(3);
  const [activeTab, setActiveTab] = useState<Tab>("수납");

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

  return (
    <div className="h-screen flex flex-col bg-[#F4F6FA]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h1 className="text-[15px] font-semibold text-gray-900">수납 통계</h1>
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

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 flex-shrink-0">
        <div className="flex gap-0">
          {(["수납", "미수&환불내역"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {activeTab === "수납" ? (
          <>
            {/* Summary Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div>
                  <span className="text-[11px] text-gray-400 block mb-0.5">총 환자수</span>
                  <span className="text-lg font-bold text-gray-900">298명</span>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div>
                  <span className="text-[11px] text-gray-400 block mb-0.5">총 수납</span>
                  <span className="text-lg font-bold text-blue-600">₩38,750,000</span>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div>
                  <span className="text-[11px] text-gray-400 block mb-0.5">카드</span>
                  <span className="text-[15px] font-bold text-gray-800">₩25,200,000</span>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div>
                  <span className="text-[11px] text-gray-400 block mb-0.5">현금</span>
                  <span className="text-[15px] font-bold text-gray-800">₩8,350,000</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-500">+10.2%</span>
                <span className="text-[11px] text-gray-400 ml-1">전월대비</span>
              </div>
            </div>

            {/* Payment Detail Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-[13px] font-semibold text-gray-900">수납 상세 내역</h2>
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
                  {paymentRows.map((row, i) => {
                    const isTotal = row.label === "총 수납";
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

            {/* Daily Payment Bar Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[13px] font-semibold text-gray-900">일별 수납 현황</h2>
                <span className="text-[11px] text-gray-400">{year}년 {month}월</span>
              </div>
              <div className="flex items-end gap-[3px] h-44">
                {dailyPayments.map((d) => {
                  const heightPct = (d.value / maxDaily) * 100;
                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex items-end justify-center h-32">
                        <div
                          className="w-full max-w-[16px] rounded-t-sm bg-blue-300 hover:bg-blue-500 transition-colors"
                          style={{ height: `${heightPct}%` }}
                          title={`${d.day}일: ₩${d.value.toLocaleString()}`}
                        />
                      </div>
                      {d.day % 5 === 1 && (
                        <span className="text-[9px] text-gray-400">{d.day}일</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Refund & Outstanding Summary Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-[13px] font-semibold text-gray-900">환불 / 미수 요약</h2>
                <span className="text-[11px] text-gray-400">{year}년 {month}월 기준</span>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="text-[11px] font-semibold text-gray-500 text-left py-2.5 px-5 w-[50px]">No</th>
                    <th className="text-[11px] font-semibold text-gray-500 text-left py-2.5 px-4">항목</th>
                    <th className="text-[11px] font-semibold text-gray-500 text-right py-2.5 px-4">당월</th>
                    <th className="text-[11px] font-semibold text-gray-500 text-right py-2.5 px-5">전월</th>
                  </tr>
                </thead>
                <tbody>
                  {refundRows.map((row, i) => {
                    const isAmount = row.label.includes("금액");
                    return (
                      <tr
                        key={row.label}
                        className="border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="py-3 px-5">
                          <span className="text-[11px] text-gray-400">{i + 1}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-medium text-gray-800">{row.label}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`text-xs font-semibold tabular-nums ${isAmount ? "text-red-500" : "text-gray-900"}`}>
                            {row.value}
                          </span>
                        </td>
                        <td className="py-3 px-5 text-right">
                          <span className="text-xs text-gray-400 tabular-nums">{row.prevValue}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Outstanding (미수) Detail Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-[13px] font-semibold text-gray-900">미수 내역</h2>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400">총 {misuData.length}건</span>
                  <span className="text-[11px] font-semibold text-red-500">₩2,240,000</span>
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="text-[11px] font-semibold text-gray-500 text-left py-2.5 px-5 w-[50px]">No</th>
                    <th className="text-[11px] font-semibold text-gray-500 text-left py-2.5 px-4">환자번호</th>
                    <th className="text-[11px] font-semibold text-gray-500 text-left py-2.5 px-4">환자명</th>
                    <th className="text-[11px] font-semibold text-gray-500 text-left py-2.5 px-4">연락처</th>
                    <th className="text-[11px] font-semibold text-gray-500 text-left py-2.5 px-4">진료일</th>
                    <th className="text-[11px] font-semibold text-gray-500 text-left py-2.5 px-4">접수번호</th>
                    <th className="text-[11px] font-semibold text-gray-500 text-right py-2.5 px-5">미수금액</th>
                  </tr>
                </thead>
                <tbody>
                  {misuData.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="py-3 px-5">
                        <span className="text-[11px] text-gray-400">{i + 1}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-gray-500 font-mono">{row.patientNo}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-medium text-gray-800">{row.name}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-gray-500">{row.phone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-gray-500">{row.date}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-gray-500 font-mono">{row.receiptNo}</span>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <span className="text-xs font-semibold text-red-500">{row.amount}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
