import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(amount);
}

export function getAge(birthDate: Date | string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function getGenderLabel(gender: string): string {
  return gender === "MALE" ? "남" : "여";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    SCHEDULED: "bg-blue-100 text-blue-700",
    CHECKED_IN: "bg-yellow-100 text-yellow-700",
    IN_PROGRESS: "bg-green-100 text-green-700",
    COMPLETED: "bg-gray-100 text-gray-600",
    CANCELLED: "bg-red-100 text-red-700",
    NO_SHOW: "bg-orange-100 text-orange-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    DISPENSED: "bg-green-100 text-green-700",
    ORDERED: "bg-blue-100 text-blue-700",
    COLLECTED: "bg-indigo-100 text-indigo-700",
    UNPAID: "bg-red-100 text-red-700",
    PAID: "bg-green-100 text-green-700",
    PARTIAL: "bg-amber-100 text-amber-700",
    REFUNDED: "bg-gray-100 text-gray-600",
  };
  return colors[status] || "bg-gray-100 text-gray-600";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    SCHEDULED: "예약", CHECKED_IN: "접수완료", IN_PROGRESS: "진료중", COMPLETED: "완료",
    CANCELLED: "취소", NO_SHOW: "미방문", PENDING: "대기", DISPENSED: "조제완료",
    ORDERED: "오더", COLLECTED: "채취완료", UNPAID: "미수납", PAID: "수납완료",
    PARTIAL: "부분수납", REFUNDED: "환불", OUTPATIENT: "외래", INPATIENT: "입원",
    EMERGENCY: "응급", FOLLOW_UP: "재진", NATIONAL: "건강보험", MEDICAID: "의료급여",
    INDUSTRIAL: "산재보험", CAR: "자동차보험", SELF_PAY: "비급여",
    BLOOD: "혈액검사", URINE: "소변검사", IMAGING: "영상검사", PATHOLOGY: "병리검사", OTHER: "기타",
  };
  return labels[status] || status;
}
