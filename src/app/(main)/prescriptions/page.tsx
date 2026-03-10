"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getStatusColor, getStatusLabel } from "@/lib/utils";
import { Search, Filter, Pill, Printer } from "lucide-react";
import { useState } from "react";

const prescriptions = [
  { id: "1", date: "2024-03-15", patient: "김영수", chartNo: "C-2024-0001", doctor: "김의사", diagnosis: "긴장성 두통", items: ["타이레놀 500mg", "근이완제"], totalDays: 5, status: "DISPENSED" },
  { id: "2", date: "2024-03-15", patient: "이미영", chartNo: "C-2024-0023", doctor: "김의사", diagnosis: "급성 기관지염", items: ["아목시실린 500mg", "타이레놀 500mg", "뮤코펙트 30mg"], totalDays: 5, status: "PENDING" },
  { id: "3", date: "2024-03-14", patient: "박지훈", chartNo: "C-2024-0045", doctor: "김의사", diagnosis: "급성 위장염", items: ["겔포스", "가스모틴", "스멕타"], totalDays: 3, status: "DISPENSED" },
  { id: "4", date: "2024-03-14", patient: "최수연", chartNo: "C-2024-0067", doctor: "박의사", diagnosis: "접촉성 피부염", items: ["세티리진", "더모베이트 크림"], totalDays: 7, status: "DISPENSED" },
  { id: "5", date: "2024-03-13", patient: "정하늘", chartNo: "C-2024-0089", doctor: "김의사", diagnosis: "요추 염좌", items: ["세레브렉스", "마이오날", "가스터"], totalDays: 5, status: "DISPENSED" },
  { id: "6", date: "2024-03-13", patient: "강민서", chartNo: "C-2024-0102", doctor: "김의사", diagnosis: "기능성 소화불량", items: ["가스모틴", "란소프라졸"], totalDays: 14, status: "PENDING" },
];

export default function PrescriptionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = prescriptions.filter((p) => {
    const matchSearch = p.patient.includes(search) || p.chartNo.includes(search);
    const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">처방 관리</h1>
          <p className="text-sm text-gray-500">처방전 조회 및 관리</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2">
        {[
          { key: "ALL", label: "전체", count: prescriptions.length },
          { key: "PENDING", label: "대기", count: prescriptions.filter(p => p.status === "PENDING").length },
          { key: "DISPENSED", label: "조제완료", count: prescriptions.filter(p => p.status === "DISPENSED").length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === tab.key
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
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
                <TableHead>처방일</TableHead>
                <TableHead>환자명</TableHead>
                <TableHead>차트번호</TableHead>
                <TableHead>담당의</TableHead>
                <TableHead>진단명</TableHead>
                <TableHead>처방 약품</TableHead>
                <TableHead>일수</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((rx) => (
                <TableRow key={rx.id}>
                  <TableCell className="font-medium">{rx.date}</TableCell>
                  <TableCell className="font-medium">{rx.patient}</TableCell>
                  <TableCell className="text-gray-500">{rx.chartNo}</TableCell>
                  <TableCell>{rx.doctor}</TableCell>
                  <TableCell className="text-gray-600">{rx.diagnosis}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {rx.items.map((item, idx) => (
                        <span key={idx} className="rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700">
                          {item}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{rx.totalDays}일</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(rx.status)}`}>
                      {getStatusLabel(rx.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {rx.status === "PENDING" && (
                        <Button size="sm">조제완료</Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <Printer size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
