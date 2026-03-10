"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/ui/stat-card";
import { getStatusColor, getStatusLabel, formatCurrency } from "@/lib/utils";
import { Search, Receipt, CreditCard, Banknote, TrendingUp, Eye } from "lucide-react";
import { useState } from "react";

const billings = [
  {
    id: "1", date: "2024-03-15", patient: "김영수", chartNo: "C-2024-0001", diagnosis: "긴장성 두통",
    totalAmount: 45000, insurancePay: 31500, patientPay: 13500, status: "PAID", paymentMethod: "카드",
    items: [
      { name: "초진 진찰료", qty: 1, price: 15000 },
      { name: "일반혈액검사 (CBC)", qty: 1, price: 12000 },
      { name: "약제비", qty: 1, price: 18000 },
    ],
  },
  {
    id: "2", date: "2024-03-15", patient: "이미영", chartNo: "C-2024-0023", diagnosis: "급성 기관지염",
    totalAmount: 68000, insurancePay: 47600, patientPay: 20400, status: "UNPAID", paymentMethod: null,
    items: [
      { name: "재진 진찰료", qty: 1, price: 12000 },
      { name: "CRP 검사", qty: 1, price: 15000 },
      { name: "흉부 X-ray", qty: 1, price: 23000 },
      { name: "약제비", qty: 1, price: 18000 },
    ],
  },
  {
    id: "3", date: "2024-03-14", patient: "박지훈", chartNo: "C-2024-0045", diagnosis: "급성 위장염",
    totalAmount: 52000, insurancePay: 36400, patientPay: 15600, status: "PAID", paymentMethod: "현금",
    items: [
      { name: "초진 진찰료", qty: 1, price: 15000 },
      { name: "간기능검사", qty: 1, price: 22000 },
      { name: "약제비", qty: 1, price: 15000 },
    ],
  },
  {
    id: "4", date: "2024-03-14", patient: "최수연", chartNo: "C-2024-0067", diagnosis: "접촉성 피부염",
    totalAmount: 35000, insurancePay: 24500, patientPay: 10500, status: "PAID", paymentMethod: "카드",
    items: [
      { name: "초진 진찰료", qty: 1, price: 15000 },
      { name: "약제비", qty: 1, price: 20000 },
    ],
  },
  {
    id: "5", date: "2024-03-13", patient: "정하늘", chartNo: "C-2024-0089", diagnosis: "요추 염좌",
    totalAmount: 78000, insurancePay: 54600, patientPay: 23400, status: "PARTIAL", paymentMethod: "카드",
    items: [
      { name: "재진 진찰료", qty: 1, price: 12000 },
      { name: "물리치료", qty: 2, price: 25000 },
      { name: "약제비", qty: 1, price: 16000 },
    ],
  },
  {
    id: "6", date: "2024-03-13", patient: "홍길동", chartNo: "C-2024-0115", diagnosis: "고혈압 (재진)",
    totalAmount: 42000, insurancePay: 29400, patientPay: 12600, status: "PAID", paymentMethod: "카드",
    items: [
      { name: "재진 진찰료", qty: 1, price: 12000 },
      { name: "지질검사", qty: 1, price: 18000 },
      { name: "약제비 (30일)", qty: 1, price: 12000 },
    ],
  },
];

export default function BillingPage() {
  const [search, setSearch] = useState("");
  const [selectedBilling, setSelectedBilling] = useState<typeof billings[0] | null>(null);

  const filtered = billings.filter(
    (b) => b.patient.includes(search) || b.chartNo.includes(search)
  );

  const todayTotal = billings.reduce((s, b) => s + b.totalAmount, 0);
  const todayPaid = billings.filter(b => b.status === "PAID").reduce((s, b) => s + b.patientPay, 0);
  const todayUnpaid = billings.filter(b => b.status === "UNPAID").reduce((s, b) => s + b.patientPay, 0);
  const todayInsurance = billings.reduce((s, b) => s + b.insurancePay, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">수납 / 청구</h1>
        <p className="text-sm text-gray-500">진료비 수납 및 보험 청구 관리</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="오늘 총 진료비" value={formatCurrency(todayTotal)} icon={Receipt} iconColor="text-blue-600 bg-blue-50" />
        <StatCard title="수납 완료" value={formatCurrency(todayPaid)} icon={CreditCard} iconColor="text-green-600 bg-green-50" />
        <StatCard title="미수납" value={formatCurrency(todayUnpaid)} change="1건 미수납" changeType="negative" icon={Banknote} iconColor="text-red-600 bg-red-50" />
        <StatCard title="보험 청구액" value={formatCurrency(todayInsurance)} icon={TrendingUp} iconColor="text-purple-600 bg-purple-50" />
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="환자명, 차트번호 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>수납일</TableHead>
                <TableHead>환자명</TableHead>
                <TableHead>차트번호</TableHead>
                <TableHead>진단명</TableHead>
                <TableHead className="text-right">총 진료비</TableHead>
                <TableHead className="text-right">보험부담</TableHead>
                <TableHead className="text-right">본인부담</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>결제수단</TableHead>
                <TableHead>액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.date}</TableCell>
                  <TableCell className="font-medium">{bill.patient}</TableCell>
                  <TableCell className="text-gray-500">{bill.chartNo}</TableCell>
                  <TableCell className="text-gray-600">{bill.diagnosis}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(bill.totalAmount)}</TableCell>
                  <TableCell className="text-right text-gray-500">{formatCurrency(bill.insurancePay)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(bill.patientPay)}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(bill.status)}`}>
                      {getStatusLabel(bill.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500">{bill.paymentMethod || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {bill.status === "UNPAID" && <Button size="sm">수납</Button>}
                      <Button size="sm" variant="ghost" onClick={() => setSelectedBilling(bill)}>
                        <Eye size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Modal isOpen={!!selectedBilling} onClose={() => setSelectedBilling(null)} title="수납 상세" size="md">
        {selectedBilling && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-500">환자: </span><span className="font-medium">{selectedBilling.patient}</span></div>
              <div><span className="text-gray-500">차트번호: </span><span>{selectedBilling.chartNo}</span></div>
              <div><span className="text-gray-500">진단: </span><span>{selectedBilling.diagnosis}</span></div>
              <div><span className="text-gray-500">수납일: </span><span>{selectedBilling.date}</span></div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">항목</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">수량</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">금액</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {selectedBilling.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-3 py-2">{item.name}</td>
                    <td className="px-3 py-2 text-right">{item.qty}</td>
                    <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.price * item.qty)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-gray-200">
                <tr><td className="px-3 py-2 font-medium" colSpan={2}>총 진료비</td><td className="px-3 py-2 text-right font-bold">{formatCurrency(selectedBilling.totalAmount)}</td></tr>
                <tr><td className="px-3 py-2 text-gray-500" colSpan={2}>보험부담금</td><td className="px-3 py-2 text-right text-gray-500">-{formatCurrency(selectedBilling.insurancePay)}</td></tr>
                <tr className="bg-blue-50"><td className="px-3 py-2 font-semibold text-blue-800" colSpan={2}>본인부담금</td><td className="px-3 py-2 text-right font-bold text-blue-800">{formatCurrency(selectedBilling.patientPay)}</td></tr>
              </tfoot>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
}
