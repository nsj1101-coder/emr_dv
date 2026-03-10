"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getStatusColor, getStatusLabel } from "@/lib/utils";
import {
  ArrowLeft,
  Edit,
  Phone,
  Calendar,
  Heart,
  AlertTriangle,
  FileText,
  Pill,
  TestTubes,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const patient = {
  id: "1",
  chartNumber: "C-2024-0001",
  name: "김영수",
  gender: "MALE",
  birthDate: "1979-05-12",
  age: 45,
  phone: "010-1234-5678",
  address: "서울시 강남구 테헤란로 123",
  bloodType: "A+",
  allergies: "페니실린",
  insuranceType: "NATIONAL",
  insuranceNo: "12345678",
  memo: "고혈압 가족력 있음",
};

const visitHistory = [
  { date: "2024-03-15", doctor: "김의사", diagnosis: "긴장성 두통", status: "COMPLETED" },
  { date: "2024-02-28", doctor: "김의사", diagnosis: "급성 위장염", status: "COMPLETED" },
  { date: "2024-01-15", doctor: "박의사", diagnosis: "고혈압 (follow-up)", status: "COMPLETED" },
  { date: "2023-12-20", doctor: "김의사", diagnosis: "독감", status: "COMPLETED" },
];

const prescriptionHistory = [
  { date: "2024-03-15", medicine: "타이레놀 500mg", dosage: "1일 3회, 5일", status: "DISPENSED" },
  { date: "2024-02-28", medicine: "겔포스 현탁액", dosage: "1일 3회, 3일", status: "DISPENSED" },
  { date: "2024-01-15", medicine: "아모디핀 5mg", dosage: "1일 1회, 30일", status: "DISPENSED" },
];

const vitalHistory = [
  { date: "2024-03-15", bp: "128/82", pulse: 72, temp: 36.5, weight: 75.2 },
  { date: "2024-02-28", bp: "135/88", pulse: 78, temp: 37.8, weight: 75.0 },
  { date: "2024-01-15", bp: "140/90", pulse: 75, temp: 36.4, weight: 74.8 },
];

type Tab = "overview" | "visits" | "prescriptions" | "vitals";

export default function PatientDetailPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "개요", icon: FileText },
    { key: "visits", label: "진료 내역", icon: Calendar },
    { key: "prescriptions", label: "처방 이력", icon: Pill },
    { key: "vitals", label: "활력징후", icon: Heart },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/patients">
            <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
              <Badge variant="info">{patient.chartNumber}</Badge>
            </div>
            <p className="text-sm text-gray-500">
              {patient.gender === "MALE" ? "남" : "여"} / {patient.age}세 / {patient.birthDate}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/appointments">
            <Button variant="outline">
              <Calendar size={16} className="mr-1" /> 예약
            </Button>
          </Link>
          <Button>
            <Edit size={16} className="mr-1" /> 정보 수정
          </Button>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <div className="rounded-lg bg-blue-50 p-2"><Phone size={18} className="text-blue-600" /></div>
          <div>
            <p className="text-xs text-gray-500">연락처</p>
            <p className="text-sm font-medium">{patient.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <div className="rounded-lg bg-red-50 p-2"><Heart size={18} className="text-red-600" /></div>
          <div>
            <p className="text-xs text-gray-500">혈액형</p>
            <p className="text-sm font-medium">{patient.bloodType}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <div className="rounded-lg bg-amber-50 p-2"><AlertTriangle size={18} className="text-amber-600" /></div>
          <div>
            <p className="text-xs text-gray-500">알레르기</p>
            <p className="text-sm font-medium text-red-600">{patient.allergies}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <div className="rounded-lg bg-green-50 p-2"><FileText size={18} className="text-green-600" /></div>
          <div>
            <p className="text-xs text-gray-500">보험</p>
            <p className="text-sm font-medium">{getStatusLabel(patient.insuranceType)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>환자 정보</CardTitle></CardHeader>
            <CardContent>
              <dl className="space-y-3">
                {[
                  ["주소", patient.address],
                  ["보험증번호", patient.insuranceNo],
                  ["메모", patient.memo],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex">
                    <dt className="w-24 shrink-0 text-sm text-gray-500">{label}</dt>
                    <dd className="text-sm text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>최근 활력징후</CardTitle></CardHeader>
            <CardContent>
              {vitalHistory[0] && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <p className="text-lg font-bold text-gray-900">{vitalHistory[0].bp}</p>
                    <p className="text-xs text-gray-500">혈압 (mmHg)</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <p className="text-lg font-bold text-gray-900">{vitalHistory[0].pulse}</p>
                    <p className="text-xs text-gray-500">맥박 (bpm)</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <p className="text-lg font-bold text-gray-900">{vitalHistory[0].temp}°C</p>
                    <p className="text-xs text-gray-500">체온</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <p className="text-lg font-bold text-gray-900">{vitalHistory[0].weight}kg</p>
                    <p className="text-xs text-gray-500">체중</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "visits" && (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>진료일</TableHead>
                  <TableHead>담당의</TableHead>
                  <TableHead>진단명</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitHistory.map((visit, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{visit.date}</TableCell>
                    <TableCell>{visit.doctor}</TableCell>
                    <TableCell>{visit.diagnosis}</TableCell>
                    <TableCell>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(visit.status)}`}>
                        {getStatusLabel(visit.status)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === "prescriptions" && (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>처방일</TableHead>
                  <TableHead>약품명</TableHead>
                  <TableHead>용법</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptionHistory.map((rx, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{rx.date}</TableCell>
                    <TableCell>{rx.medicine}</TableCell>
                    <TableCell className="text-gray-500">{rx.dosage}</TableCell>
                    <TableCell>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(rx.status)}`}>
                        {getStatusLabel(rx.status)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === "vitals" && (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>측정일</TableHead>
                  <TableHead>혈압</TableHead>
                  <TableHead>맥박</TableHead>
                  <TableHead>체온</TableHead>
                  <TableHead>체중</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vitalHistory.map((v, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{v.date}</TableCell>
                    <TableCell>{v.bp} mmHg</TableCell>
                    <TableCell>{v.pulse} bpm</TableCell>
                    <TableCell>{v.temp}°C</TableCell>
                    <TableCell>{v.weight} kg</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
