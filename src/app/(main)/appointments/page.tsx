"use client";

import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  UserCheck,
  Stethoscope,
  CheckCircle,
  X,
  User,
  Phone,
  GripVertical,
} from "lucide-react";
import { useState, useCallback, useRef, useEffect, DragEvent } from "react";

type AppointmentStatus = "SCHEDULED" | "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED";

type Appointment = {
  id: string;
  patient: string;
  age: number;
  gender: "남" | "여";
  phone: string;
  chartNo: string;
  doctor: string;
  department: string;
  symptom: string;
  status: AppointmentStatus;
  dayOffset: number;
  hour: number;
  minute: number;
  duration: number;
};

const patientDB = [
  { name: "김영수", phone: "010-1234-5678", chartNo: "C-2024-0001", age: 45, gender: "남" as const },
  { name: "이미영", phone: "010-2345-6789", chartNo: "C-2024-0023", age: 32, gender: "여" as const },
  { name: "박지훈", phone: "010-3456-7890", chartNo: "C-2024-0045", age: 58, gender: "남" as const },
  { name: "최수연", phone: "010-4567-8901", chartNo: "C-2024-0067", age: 27, gender: "여" as const },
  { name: "정하늘", phone: "010-5678-9012", chartNo: "C-2024-0089", age: 41, gender: "남" as const },
  { name: "강민서", phone: "010-6789-0123", chartNo: "C-2024-0102", age: 35, gender: "여" as const },
  { name: "홍길동", phone: "010-7890-1234", chartNo: "C-2024-0115", age: 52, gender: "남" as const },
  { name: "윤서현", phone: "010-8901-2345", chartNo: "C-2024-0128", age: 29, gender: "여" as const },
  { name: "오태민", phone: "010-9012-3456", chartNo: "C-2024-0140", age: 63, gender: "남" as const },
  { name: "신예린", phone: "010-0123-4567", chartNo: "C-2024-0155", age: 38, gender: "여" as const },
];

const statusConfig: Record<
  AppointmentStatus,
  { label: string; color: string; bg: string; border: string; dot: string; badgeBg: string; badgeText: string }
> = {
  SCHEDULED: {
    label: "예약",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-l-blue-400",
    dot: "bg-blue-400",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-600",
  },
  CHECKED_IN: {
    label: "접수완료",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-l-amber-400",
    dot: "bg-amber-400",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-600",
  },
  IN_PROGRESS: {
    label: "진료중",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-l-emerald-400",
    dot: "bg-emerald-400",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-600",
  },
  COMPLETED: {
    label: "완료",
    color: "text-gray-500",
    bg: "bg-gray-50",
    border: "border-l-gray-300",
    dot: "bg-gray-300",
    badgeBg: "bg-gray-100",
    badgeText: "text-gray-500",
  },
};

const initialAppointments: Appointment[] = [
  { id: "1", patient: "김영수", age: 45, gender: "남", phone: "010-1234-5678", chartNo: "C-2024-0001", doctor: "김의사", department: "내과", symptom: "두통, 어지러움", status: "COMPLETED", dayOffset: 0, hour: 9, minute: 0, duration: 30 },
  { id: "2", patient: "이미영", age: 32, gender: "여", phone: "010-2345-6789", chartNo: "C-2024-0023", doctor: "김의사", department: "내과", symptom: "기침, 발열", status: "IN_PROGRESS", dayOffset: 0, hour: 10, minute: 0, duration: 30 },
  { id: "3", patient: "박지훈", age: 58, gender: "남", phone: "010-3456-7890", chartNo: "C-2024-0045", doctor: "김의사", department: "내과", symptom: "복통, 설사", status: "CHECKED_IN", dayOffset: 1, hour: 9, minute: 30, duration: 30 },
  { id: "4", patient: "최수연", age: 27, gender: "여", phone: "010-4567-8901", chartNo: "C-2024-0067", doctor: "박의사", department: "외과", symptom: "피부 발진", status: "SCHEDULED", dayOffset: 1, hour: 11, minute: 0, duration: 30 },
  { id: "5", patient: "정하늘", age: 41, gender: "남", phone: "010-5678-9012", chartNo: "C-2024-0089", doctor: "김의사", department: "내과", symptom: "허리 통증", status: "SCHEDULED", dayOffset: 2, hour: 14, minute: 0, duration: 60 },
  { id: "6", patient: "강민서", age: 35, gender: "여", phone: "010-6789-0123", chartNo: "C-2024-0102", doctor: "박의사", department: "외과", symptom: "소화불량, 위산 역류", status: "SCHEDULED", dayOffset: 2, hour: 10, minute: 0, duration: 30 },
  { id: "7", patient: "홍길동", age: 52, gender: "남", phone: "010-7890-1234", chartNo: "C-2024-0115", doctor: "김의사", department: "내과", symptom: "관절통", status: "SCHEDULED", dayOffset: 3, hour: 13, minute: 0, duration: 30 },
  { id: "8", patient: "윤서현", age: 29, gender: "여", phone: "010-8901-2345", chartNo: "C-2024-0128", doctor: "박의사", department: "외과", symptom: "고열, 오한", status: "SCHEDULED", dayOffset: 3, hour: 15, minute: 30, duration: 30 },
  { id: "9", patient: "오태민", age: 63, gender: "남", phone: "010-9012-3456", chartNo: "C-2024-0140", doctor: "김의사", department: "내과", symptom: "척추 통증", status: "SCHEDULED", dayOffset: 4, hour: 9, minute: 0, duration: 60 },
  { id: "10", patient: "신예린", age: 38, gender: "여", phone: "010-0123-4567", chartNo: "C-2024-0155", doctor: "박의사", department: "외과", symptom: "족저근막염", status: "SCHEDULED", dayOffset: 4, hour: 16, minute: 0, duration: 30 },
];

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];
const MONTH_DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
const HOURS = Array.from({ length: 10 }, (_, i) => i + 9);

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatMonth(d: Date): string {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
}

function getMonthCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay(); // 0=Sun
  const daysInMonth = lastDay.getDate();

  const cells: (Date | null)[] = [];

  // Leading empty cells
  for (let i = 0; i < startDayOfWeek; i++) {
    cells.push(null);
  }

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }

  // Trailing empty cells to fill grid rows
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isSameWeek(date: Date, weekStart: Date): boolean {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const ws = new Date(weekStart);
  ws.setHours(0, 0, 0, 0);
  return d >= ws && d <= weekEnd;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [search, setSearch] = useState("");
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  // New appointment form state
  const [newForm, setNewForm] = useState({
    patient: "",
    phone: "",
    chartNo: "",
    age: "",
    gender: "남" as "남" | "여",
    doctor: "김의사",
    department: "내과",
    symptom: "",
    date: "",
    time: "09:00",
    duration: "30",
  });

  // Patient search dropdown
  const [patientQuery, setPatientQuery] = useState("");
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const patientInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        patientInputRef.current &&
        !patientInputRef.current.contains(e.target as Node)
      ) {
        setShowPatientDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredPatients = patientQuery.length > 0
    ? patientDB.filter((p) => p.name.includes(patientQuery) || p.chartNo.includes(patientQuery) || p.phone.includes(patientQuery))
    : [];

  const weekStart = getWeekStart(currentDate);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const counts = {
    total: appointments.length,
    scheduled: appointments.filter((a) => a.status === "SCHEDULED").length,
    inProgress: appointments.filter((a) => a.status === "IN_PROGRESS").length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
  };

  const prevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const goToday = () => setCurrentDate(new Date());

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  // When clicking a date on the monthly calendar, navigate weekly view to that week
  const handleCalendarDateClick = (date: Date) => {
    setCurrentDate(date);
  };

  // Check if a given date has appointments (using dayOffset relative to weekStart)
  const dateHasAppointments = (date: Date): boolean => {
    const ws = getWeekStart(date);
    const dayOfWeek = date.getDay();
    const dayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    // Check if this is within the "current" data week (since our demo data is offset-based)
    const currentWeekStart = getWeekStart(new Date());
    if (isSameWeek(date, currentWeekStart)) {
      return appointments.some((a) => a.dayOffset === dayOffset);
    }
    return false;
  };

  const getAppointmentsForSlot = (dayIndex: number, hour: number) => {
    return appointments.filter((a) => {
      const matchDay = a.dayOffset === dayIndex;
      const matchHour = a.hour === hour;
      const matchSearch =
        search.length === 0 ||
        a.patient.includes(search) ||
        a.chartNo.includes(search) ||
        a.doctor.includes(search);
      return matchDay && matchHour && matchSearch;
    });
  };

  const handleDragStart = useCallback((e: DragEvent<HTMLDivElement>, id: string) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>, dayIndex: number, hour: number) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain");
      if (!id) return;
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, dayOffset: dayIndex, hour, minute: 0 } : a
        )
      );
      setDragId(null);
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDragId(null);
  }, []);

  const handlePatientSelect = (p: typeof patientDB[number]) => {
    setNewForm({
      ...newForm,
      patient: p.name,
      phone: p.phone,
      chartNo: p.chartNo,
      age: String(p.age),
      gender: p.gender,
    });
    setPatientQuery(p.name);
    setShowPatientDropdown(false);
  };

  const handlePatientInputChange = (value: string) => {
    setPatientQuery(value);
    setNewForm({ ...newForm, patient: value });
    setShowPatientDropdown(value.length > 0);
  };

  const handleNewSubmit = () => {
    if (!newForm.patient || !newForm.date || !newForm.time) return;
    const dateObj = new Date(newForm.date);
    const dayOfWeek = dateObj.getDay();
    const dayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const [h, m] = newForm.time.split(":").map(Number);
    const newApt: Appointment = {
      id: String(Date.now()),
      patient: newForm.patient,
      age: parseInt(newForm.age) || 30,
      gender: newForm.gender,
      phone: newForm.phone || "010-0000-0000",
      chartNo: newForm.chartNo || `C-${Date.now()}`,
      doctor: newForm.doctor,
      department: newForm.department,
      symptom: newForm.symptom || "증상 미기재",
      status: "SCHEDULED",
      dayOffset,
      hour: h,
      minute: m,
      duration: parseInt(newForm.duration) || 30,
    };
    setAppointments((prev) => [...prev, newApt]);
    setShowNewModal(false);
    setNewForm({ patient: "", phone: "", chartNo: "", age: "", gender: "남", doctor: "김의사", department: "내과", symptom: "", date: "", time: "09:00", duration: "30" });
    setPatientQuery("");
  };

  // Monthly calendar data
  const monthDays = getMonthCalendarDays(calYear, calMonth);

  return (
    <div className="flex flex-col h-screen bg-[#F4F6FA]">
      {/* Header bar */}
      <div className="flex items-center gap-4 px-6 py-3 bg-white border-b border-gray-200 shrink-0">
        <h1 className="text-sm font-bold text-gray-800 shrink-0">예약</h1>

        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="환자명, 차트번호, 담당의 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-9 pr-4 text-xs focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shrink-0"
        >
          <Plus size={14} />
          신규 예약
        </button>
      </div>

      {/* Main content: LEFT calendar + RIGHT schedule */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Monthly Calendar Panel */}
        <div className="w-[280px] shrink-0 bg-white border-r border-gray-200 flex flex-col">
          {/* Month navigation */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button onClick={prevMonth} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="text-[13px] font-bold text-gray-800">
              {calYear}년 {calMonth + 1}월
            </span>
            <button onClick={nextMonth} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day of week headers */}
          <div className="grid grid-cols-7 px-3 pt-3">
            {MONTH_DAY_LABELS.map((label, i) => (
              <div
                key={label}
                className={`text-center text-[11px] font-medium pb-2 ${
                  i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-gray-400"
                }`}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 px-3 pb-3">
            {monthDays.map((date, idx) => {
              if (!date) {
                return <div key={`empty-${idx}`} className="h-9" />;
              }

              const isToday = isSameDay(date, today);
              const isInSelectedWeek = isSameWeek(date, weekStart);
              const hasApts = dateHasAppointments(date);
              const dayOfWeek = date.getDay();
              const isSunday = dayOfWeek === 0;
              const isSaturday = dayOfWeek === 6;

              return (
                <button
                  key={`day-${date.getDate()}`}
                  onClick={() => handleCalendarDateClick(date)}
                  className={`relative h-9 flex flex-col items-center justify-center rounded-lg text-xs transition-colors
                    ${isToday ? "bg-blue-600 text-white font-bold" : ""}
                    ${!isToday && isInSelectedWeek ? "bg-blue-50 text-blue-700 font-medium" : ""}
                    ${!isToday && !isInSelectedWeek ? "hover:bg-gray-50" : ""}
                    ${!isToday && !isInSelectedWeek && isSunday ? "text-red-400" : ""}
                    ${!isToday && !isInSelectedWeek && isSaturday ? "text-blue-400" : ""}
                    ${!isToday && !isInSelectedWeek && !isSunday && !isSaturday ? "text-gray-700" : ""}
                  `}
                >
                  <span>{date.getDate()}</span>
                  {hasApts && (
                    <span
                      className={`absolute bottom-0.5 w-1 h-1 rounded-full ${
                        isToday ? "bg-white" : "bg-blue-400"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mini legend / info */}
          <div className="px-4 py-3 border-t border-gray-100 mt-auto">
            <div className="text-[11px] text-gray-400 mb-2 font-medium">상태 범례</div>
            <div className="space-y-1.5">
              {(Object.keys(statusConfig) as AppointmentStatus[]).map((key) => {
                const cfg = statusConfig[key];
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <span className="text-[11px] text-gray-500">{cfg.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's summary */}
          <div className="px-4 py-3 border-t border-gray-100">
            <div className="text-[11px] text-gray-400 mb-1 font-medium">오늘의 예약</div>
            <div className="text-lg font-bold text-gray-800">
              {(() => {
                const todayDayOfWeek = new Date().getDay();
                const todayOffset = todayDayOfWeek === 0 ? 6 : todayDayOfWeek - 1;
                const currentWS = getWeekStart(new Date());
                if (isSameWeek(new Date(), currentWS)) {
                  return appointments.filter((a) => a.dayOffset === todayOffset).length;
                }
                return 0;
              })()}
              <span className="text-xs text-gray-400 font-normal ml-1">건</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Weekly Schedule */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats cards */}
          <div className="grid grid-cols-4 gap-4 mb-5">
            {[
              { label: "전체 예약", value: counts.total, icon: Calendar, color: "text-blue-600", bg: "bg-blue-100" },
              { label: "예약 대기", value: counts.scheduled, icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
              { label: "진료중", value: counts.inProgress, icon: Stethoscope, color: "text-emerald-600", bg: "bg-emerald-100" },
              { label: "완료", value: counts.completed, icon: CheckCircle, color: "text-gray-500", bg: "bg-gray-100" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] text-gray-400">{stat.label}</span>
                  <div className={`p-2 rounded-2xl shadow-sm ${stat.bg}`}>
                    <stat.icon size={14} className={stat.color} />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                  <span className="text-xs text-gray-400">건</span>
                </div>
              </div>
            ))}
          </div>

          {/* Week navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <button onClick={prevWeek} className="p-1.5 rounded-lg text-gray-400 hover:bg-white hover:shadow-sm transition-all">
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 rounded-lg bg-white shadow-sm">
                <Calendar size={13} className="text-gray-400" />
                {formatMonth(weekStart)} {weekStart.getDate()}일 ~ {weekDates[6].getMonth() !== weekStart.getMonth() ? `${weekDates[6].getMonth() + 1}월 ` : ""}{weekDates[6].getDate()}일
              </div>
              <button onClick={nextWeek} className="p-1.5 rounded-lg text-gray-400 hover:bg-white hover:shadow-sm transition-all">
                <ChevronRight size={16} />
              </button>
              <button
                onClick={goToday}
                className="ml-2 px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 shadow-sm transition-colors"
              >
                오늘
              </button>
            </div>
            <span className="text-[11px] text-gray-300">드래그하여 시간 변경 가능</span>
          </div>

          {/* Weekly calendar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-gray-100">
              <div className="p-2" />
              {weekDates.map((date, i) => {
                const isToday = formatDate(date) === formatDate(today);
                return (
                  <div
                    key={i}
                    className={`p-2 text-center border-l border-gray-100 ${isToday ? "bg-blue-50" : ""}`}
                  >
                    <div className={`text-[11px] font-medium ${isToday ? "text-blue-600" : "text-gray-400"}`}>
                      {DAY_LABELS[i]}
                    </div>
                    <div
                      className={`text-sm font-bold mt-0.5 ${
                        isToday
                          ? "text-white bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center mx-auto"
                          : "text-gray-700"
                      }`}
                    >
                      {date.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time grid */}
            <div className="max-h-[calc(100vh-360px)] overflow-y-auto">
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-gray-50 min-h-[72px]">
                  {/* Time label */}
                  <div className="p-2 text-right pr-3 border-r border-gray-100">
                    <span className="text-[11px] text-gray-400 font-medium">
                      {String(hour).padStart(2, "0")}:00
                    </span>
                  </div>

                  {/* Day cells */}
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const isToday = formatDate(weekDates[dayIndex]) === formatDate(today);
                    const slotApts = getAppointmentsForSlot(dayIndex, hour);
                    return (
                      <div
                        key={dayIndex}
                        className={`border-l border-gray-100 p-0.5 relative ${
                          isToday ? "bg-blue-50/30" : ""
                        } ${dragId ? "bg-gray-50/50" : ""}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, dayIndex, hour)}
                      >
                        {slotApts.map((apt) => {
                          const cfg = statusConfig[apt.status];
                          return (
                            <div
                              key={apt.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, apt.id)}
                              onDragEnd={handleDragEnd}
                              onClick={() => setSelectedApt(apt)}
                              className={`${cfg.bg} border-l-[3px] ${cfg.border} rounded-r-md p-1.5 mb-0.5 cursor-pointer hover:shadow-sm transition-shadow group ${
                                apt.status === "COMPLETED" ? "opacity-60" : ""
                              }`}
                            >
                              <div className="flex items-start gap-1">
                                <GripVertical size={10} className="text-gray-300 opacity-0 group-hover:opacity-100 mt-0.5 shrink-0 cursor-grab" />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1">
                                    <span className="text-[11px] font-bold text-gray-800 truncate">{apt.patient}</span>
                                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
                                  </div>
                                  <div className="text-[10px] text-gray-400 truncate">
                                    {String(apt.hour).padStart(2, "0")}:{String(apt.minute).padStart(2, "0")} · {apt.doctor}
                                  </div>
                                  <div className="text-[10px] text-gray-400 truncate">{apt.symptom}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      {selectedApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedApt(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">예약 상세</h3>
              <button
                onClick={() => setSelectedApt(null)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-5 space-y-4">
              {/* Patient info */}
              <div className="flex items-center gap-3">
                <div
                  className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-full text-xs font-bold ${
                    selectedApt.gender === "남" ? "bg-blue-50 text-blue-500" : "bg-pink-50 text-pink-500"
                  }`}
                >
                  {selectedApt.patient.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{selectedApt.patient}</span>
                    <span className="text-[11px] text-gray-400">
                      {selectedApt.gender} · {selectedApt.age}세
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusConfig[selectedApt.status].badgeBg} ${statusConfig[selectedApt.status].badgeText}`}>
                      {statusConfig[selectedApt.status].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400">
                    <span className="font-mono">{selectedApt.chartNo}</span>
                    <span className="flex items-center gap-0.5">
                      <Phone size={10} />
                      {selectedApt.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "예약 시간", value: `${String(selectedApt.hour).padStart(2, "0")}:${String(selectedApt.minute).padStart(2, "0")}` },
                  { label: "진료 시간", value: `${selectedApt.duration}분` },
                  { label: "담당의", value: selectedApt.doctor },
                  { label: "진료과", value: selectedApt.department },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-lg px-3 py-2">
                    <div className="text-[10px] text-gray-400 mb-0.5">{item.label}</div>
                    <div className="text-xs font-medium text-gray-700">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Symptom */}
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <div className="text-[10px] text-gray-400 mb-0.5">증상</div>
                <div className="text-xs text-gray-700">{selectedApt.symptom}</div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                {selectedApt.status === "SCHEDULED" && (
                  <button
                    onClick={() => {
                      setAppointments((prev) =>
                        prev.map((a) => (a.id === selectedApt.id ? { ...a, status: "CHECKED_IN" as AppointmentStatus } : a))
                      );
                      setSelectedApt(null);
                    }}
                    className="flex-1 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    접수하기
                  </button>
                )}
                {selectedApt.status === "CHECKED_IN" && (
                  <button
                    onClick={() => {
                      setAppointments((prev) =>
                        prev.map((a) => (a.id === selectedApt.id ? { ...a, status: "IN_PROGRESS" as AppointmentStatus } : a))
                      );
                      setSelectedApt(null);
                    }}
                    className="flex-1 py-2 text-xs font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    진료 시작
                  </button>
                )}
                {selectedApt.status === "IN_PROGRESS" && (
                  <button
                    onClick={() => {
                      setAppointments((prev) =>
                        prev.map((a) => (a.id === selectedApt.id ? { ...a, status: "COMPLETED" as AppointmentStatus } : a))
                      );
                      setSelectedApt(null);
                    }}
                    className="flex-1 py-2 text-xs font-medium text-white bg-gray-500 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    진료 완료
                  </button>
                )}
                <button
                  onClick={() => {
                    setAppointments((prev) => prev.filter((a) => a.id !== selectedApt.id));
                    setSelectedApt(null);
                  }}
                  className="px-4 py-2 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  삭제
                </button>
                <button
                  onClick={() => setSelectedApt(null)}
                  className="px-4 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New appointment modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => { setShowNewModal(false); setShowPatientDropdown(false); }} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">신규 예약</h3>
              <button
                onClick={() => { setShowNewModal(false); setShowPatientDropdown(false); }}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Patient name with search dropdown */}
                <div className="relative">
                  <label className="block text-[11px] text-gray-400 mb-1">환자명 *</label>
                  <input
                    ref={patientInputRef}
                    type="text"
                    value={patientQuery}
                    onChange={(e) => handlePatientInputChange(e.target.value)}
                    onFocus={() => { if (patientQuery.length > 0) setShowPatientDropdown(true); }}
                    placeholder="환자명 검색 또는 직접 입력"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                  {/* Patient search dropdown */}
                  {showPatientDropdown && filteredPatients.length > 0 && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-48 overflow-y-auto"
                    >
                      {filteredPatients.map((p) => (
                        <button
                          key={p.chartNo}
                          type="button"
                          onClick={() => handlePatientSelect(p)}
                          className="w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${p.gender === "남" ? "bg-blue-50 text-blue-500" : "bg-pink-50 text-pink-500"}`}>
                              {p.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-medium text-gray-800">{p.name}</span>
                                <span className="text-[10px] text-gray-400">{p.gender} · {p.age}세</span>
                              </div>
                              <div className="text-[10px] text-gray-400 flex items-center gap-1.5">
                                <span className="font-mono">{p.chartNo}</span>
                                <span>{p.phone}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">전화번호</label>
                  <input
                    type="text"
                    value={newForm.phone}
                    onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                    placeholder="010-0000-0000"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">차트번호</label>
                  <input
                    type="text"
                    value={newForm.chartNo}
                    onChange={(e) => setNewForm({ ...newForm, chartNo: e.target.value })}
                    placeholder="C-2024-XXXX"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">나이</label>
                  <input
                    type="number"
                    value={newForm.age}
                    onChange={(e) => setNewForm({ ...newForm, age: e.target.value })}
                    placeholder="30"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">성별</label>
                  <select
                    value={newForm.gender}
                    onChange={(e) => setNewForm({ ...newForm, gender: e.target.value as "남" | "여" })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                  >
                    <option value="남">남</option>
                    <option value="여">여</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">담당의 *</label>
                  <select
                    value={newForm.doctor}
                    onChange={(e) => setNewForm({ ...newForm, doctor: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                  >
                    <option value="김의사">김의사</option>
                    <option value="박의사">박의사</option>
                    <option value="이의사">이의사</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">예약 날짜 *</label>
                  <input
                    type="date"
                    value={newForm.date}
                    onChange={(e) => setNewForm({ ...newForm, date: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">예약 시간 *</label>
                  <select
                    value={newForm.time}
                    onChange={(e) => setNewForm({ ...newForm, time: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                  >
                    {HOURS.flatMap((h) =>
                      [0, 30].map((m) => {
                        const val = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
                        return <option key={val} value={val}>{val}</option>;
                      })
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">진료 시간</label>
                  <select
                    value={newForm.duration}
                    onChange={(e) => setNewForm({ ...newForm, duration: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                  >
                    <option value="15">15분</option>
                    <option value="30">30분</option>
                    <option value="60">60분</option>
                    <option value="90">90분</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">진료과</label>
                <select
                  value={newForm.department}
                  onChange={(e) => setNewForm({ ...newForm, department: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                  <option value="내과">내과</option>
                  <option value="외과">외과</option>
                  <option value="정형외과">정형외과</option>
                  <option value="피부과">피부과</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">증상</label>
                <textarea
                  value={newForm.symptom}
                  onChange={(e) => setNewForm({ ...newForm, symptom: e.target.value })}
                  placeholder="환자의 주요 증상을 입력하세요"
                  rows={2}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => { setShowNewModal(false); setShowPatientDropdown(false); }}
                  className="px-4 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleNewSubmit}
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  예약 등록
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
