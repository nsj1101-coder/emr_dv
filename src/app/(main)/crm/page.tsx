"use client";

import {
  Search,
  Users,
  MessageCircle,
  TrendingUp,
  AlertTriangle,
  Phone,
  Calendar,
  Plus,
  Clock,
  Tag,
  FileText,
  ChevronRight,
  User,
  Activity,
} from "lucide-react";
import { useState } from "react";

type ConsultationStatus = "상담중" | "관리중" | "완료" | "이탈위험" | "신규";

type ConsultationNote = {
  date: string;
  content: string;
  staff: string;
};

type ActionItem = {
  date: string;
  action: string;
  done: boolean;
};

type Customer = {
  id: string;
  name: string;
  phone: string;
  age: number;
  gender: "남" | "여";
  interestedProcedures: string[];
  status: ConsultationStatus;
  lastConsultDate: string;
  staff: string;
  source: string;
  notes: ConsultationNote[];
  nextActions: ActionItem[];
  totalSpent: string;
  visitCount: number;
};

const customers: Customer[] = [
  {
    id: "1",
    name: "김서연",
    phone: "010-1234-5678",
    age: 34,
    gender: "여",
    interestedProcedures: ["보톡스", "필러"],
    status: "상담중",
    lastConsultDate: "2026-03-10",
    staff: "이상담",
    source: "네이버 예약",
    notes: [
      { date: "2026-03-10", content: "이마 보톡스 및 팔자 필러 상담. 다음 주 시술 희망.", staff: "이상담" },
      { date: "2026-03-05", content: "전화 상담. 가격 문의 및 시술 후기 요청.", staff: "이상담" },
    ],
    nextActions: [
      { date: "2026-03-13", action: "시술 예약 확인 전화", done: false },
      { date: "2026-03-15", action: "보톡스 시술 예정", done: false },
    ],
    totalSpent: "0",
    visitCount: 1,
  },
  {
    id: "2",
    name: "박지민",
    phone: "010-2345-6789",
    age: 28,
    gender: "여",
    interestedProcedures: ["리프팅", "피부관리"],
    status: "관리중",
    lastConsultDate: "2026-03-08",
    staff: "박매니저",
    source: "인스타그램",
    notes: [
      { date: "2026-03-08", content: "울쎄라 리프팅 2차 시술 완료. 경과 양호.", staff: "박매니저" },
      { date: "2026-02-15", content: "울쎄라 리프팅 1차 시술. 만족도 높음.", staff: "박매니저" },
      { date: "2026-02-01", content: "리프팅 상담. 울쎄라 3회 패키지 결제.", staff: "이상담" },
    ],
    nextActions: [
      { date: "2026-03-22", action: "시술 후 2주 경과 체크 전화", done: false },
      { date: "2026-04-08", action: "울쎄라 3차 시술 예정", done: false },
    ],
    totalSpent: "3,500,000",
    visitCount: 4,
  },
  {
    id: "3",
    name: "이준호",
    phone: "010-3456-7890",
    age: 42,
    gender: "남",
    interestedProcedures: ["보톡스", "레이저"],
    status: "완료",
    lastConsultDate: "2026-03-06",
    staff: "이상담",
    source: "지인 소개",
    notes: [
      { date: "2026-03-06", content: "턱 보톡스 시술 완료. 2주 후 경과 확인 예정.", staff: "이상담" },
      { date: "2026-02-28", content: "보톡스 상담. 사각턱 개선 희망.", staff: "이상담" },
    ],
    nextActions: [
      { date: "2026-03-20", action: "시술 후 경과 확인 전화", done: false },
    ],
    totalSpent: "450,000",
    visitCount: 2,
  },
  {
    id: "4",
    name: "최유나",
    phone: "010-4567-8901",
    age: 31,
    gender: "여",
    interestedProcedures: ["필러", "피부관리", "레이저"],
    status: "이탈위험",
    lastConsultDate: "2026-02-10",
    staff: "박매니저",
    source: "카카오톡",
    notes: [
      { date: "2026-02-10", content: "피부관리 3회차 노쇼. 연락 시도 중.", staff: "박매니저" },
      { date: "2026-01-20", content: "피부관리 2회차 완료. 피부 톤 개선됨.", staff: "박매니저" },
    ],
    nextActions: [
      { date: "2026-03-12", action: "리텐션 문자 발송", done: false },
      { date: "2026-03-15", action: "재방문 유도 전화", done: false },
    ],
    totalSpent: "800,000",
    visitCount: 3,
  },
  {
    id: "5",
    name: "정민수",
    phone: "010-5678-9012",
    age: 37,
    gender: "남",
    interestedProcedures: ["체형관리", "레이저"],
    status: "신규",
    lastConsultDate: "2026-03-10",
    staff: "이상담",
    source: "홈페이지",
    notes: [
      { date: "2026-03-10", content: "체형관리 프로그램 문의. 복부 지방 감소 희망.", staff: "이상담" },
    ],
    nextActions: [
      { date: "2026-03-12", action: "체형관리 프로그램 안내 문자 발송", done: false },
    ],
    totalSpent: "0",
    visitCount: 0,
  },
  {
    id: "6",
    name: "한소희",
    phone: "010-6789-0123",
    age: 26,
    gender: "여",
    interestedProcedures: ["보톡스", "필러", "피부관리"],
    status: "관리중",
    lastConsultDate: "2026-03-09",
    staff: "이상담",
    source: "유튜브",
    notes: [
      { date: "2026-03-09", content: "코 필러 시술 완료. 자연스러운 라인으로 만족.", staff: "이상담" },
      { date: "2026-02-20", content: "코 필러 상담. 자연스러운 코 라인 희망.", staff: "이상담" },
    ],
    nextActions: [
      { date: "2026-03-16", action: "시술 후 1주 경과 체크", done: false },
    ],
    totalSpent: "650,000",
    visitCount: 2,
  },
  {
    id: "7",
    name: "오승우",
    phone: "010-7890-1234",
    age: 45,
    gender: "남",
    interestedProcedures: ["리프팅", "보톡스"],
    status: "상담중",
    lastConsultDate: "2026-03-09",
    staff: "박매니저",
    source: "네이버 예약",
    notes: [
      { date: "2026-03-09", content: "실리프팅 상담. 턱선 및 볼 처짐 개선 희망. 가격 비교 중.", staff: "박매니저" },
    ],
    nextActions: [
      { date: "2026-03-12", action: "실리프팅 상세 견적 발송", done: false },
      { date: "2026-03-14", action: "의사결정 확인 전화", done: false },
    ],
    totalSpent: "0",
    visitCount: 1,
  },
  {
    id: "8",
    name: "윤지혜",
    phone: "010-8901-2345",
    age: 39,
    gender: "여",
    interestedProcedures: ["피부관리", "레이저"],
    status: "완료",
    lastConsultDate: "2026-03-07",
    staff: "박매니저",
    source: "지인 소개",
    notes: [
      { date: "2026-03-07", content: "피코 레이저 5회 완료. 색소 90% 제거. 매우 만족.", staff: "박매니저" },
      { date: "2026-02-07", content: "피코 레이저 4회차. 색소 80% 감소.", staff: "박매니저" },
    ],
    nextActions: [
      { date: "2026-04-07", action: "1개월 후 경과 사진 촬영", done: false },
    ],
    totalSpent: "2,500,000",
    visitCount: 7,
  },
  {
    id: "9",
    name: "송민지",
    phone: "010-9012-3456",
    age: 24,
    gender: "여",
    interestedProcedures: ["보톡스"],
    status: "신규",
    lastConsultDate: "2026-03-10",
    staff: "이상담",
    source: "인스타그램",
    notes: [
      { date: "2026-03-10", content: "입꼬리 보톡스 관심. 가격 및 효과 문의.", staff: "이상담" },
    ],
    nextActions: [
      { date: "2026-03-11", action: "시술 전후 사진 자료 발송", done: false },
    ],
    totalSpent: "0",
    visitCount: 0,
  },
  {
    id: "10",
    name: "강태현",
    phone: "010-0123-4567",
    age: 51,
    gender: "남",
    interestedProcedures: ["리프팅", "체형관리"],
    status: "이탈위험",
    lastConsultDate: "2026-01-25",
    staff: "박매니저",
    source: "홈페이지",
    notes: [
      { date: "2026-01-25", content: "체형관리 상담 후 미결정. 비용 부담 언급.", staff: "박매니저" },
      { date: "2026-01-10", content: "리프팅 상담. 전체적인 안티에이징 관심.", staff: "이상담" },
    ],
    nextActions: [
      { date: "2026-03-11", action: "할인 이벤트 안내 문자", done: false },
    ],
    totalSpent: "0",
    visitCount: 2,
  },
  {
    id: "11",
    name: "임수빈",
    phone: "010-1111-2222",
    age: 33,
    gender: "여",
    interestedProcedures: ["필러", "보톡스", "리프팅"],
    status: "관리중",
    lastConsultDate: "2026-03-08",
    staff: "이상담",
    source: "카카오톡",
    notes: [
      { date: "2026-03-08", content: "팔자 필러 터치업 완료. 볼륨 보충.", staff: "이상담" },
      { date: "2026-02-08", content: "팔자 필러 첫 시술. 자연스러운 결과.", staff: "이상담" },
    ],
    nextActions: [
      { date: "2026-03-22", action: "터치업 후 2주 경과 확인", done: false },
    ],
    totalSpent: "1,200,000",
    visitCount: 3,
  },
  {
    id: "12",
    name: "배진우",
    phone: "010-3333-4444",
    age: 29,
    gender: "남",
    interestedProcedures: ["레이저", "피부관리"],
    status: "상담중",
    lastConsultDate: "2026-03-09",
    staff: "박매니저",
    source: "네이버 예약",
    notes: [
      { date: "2026-03-09", content: "여드름 흉터 레이저 상담. 프락셀 vs 피코 비교 설명.", staff: "박매니저" },
    ],
    nextActions: [
      { date: "2026-03-13", action: "시술 결정 확인 전화", done: false },
    ],
    totalSpent: "0",
    visitCount: 1,
  },
  {
    id: "13",
    name: "나은서",
    phone: "010-5555-6666",
    age: 36,
    gender: "여",
    interestedProcedures: ["체형관리", "피부관리"],
    status: "완료",
    lastConsultDate: "2026-03-05",
    staff: "이상담",
    source: "지인 소개",
    notes: [
      { date: "2026-03-05", content: "체형관리 10회 프로그램 완료. 허리 -5cm 감소.", staff: "이상담" },
      { date: "2026-01-05", content: "체형관리 첫 상담. 산후 복부 관리 희망.", staff: "이상담" },
    ],
    nextActions: [
      { date: "2026-03-19", action: "재등록 안내 전화", done: false },
    ],
    totalSpent: "4,200,000",
    visitCount: 12,
  },
  {
    id: "14",
    name: "조하은",
    phone: "010-7777-8888",
    age: 27,
    gender: "여",
    interestedProcedures: ["보톡스", "피부관리"],
    status: "이탈위험",
    lastConsultDate: "2026-02-05",
    staff: "이상담",
    source: "유튜브",
    notes: [
      { date: "2026-02-05", content: "보톡스 상담 후 타 병원 비교 중이라고 함.", staff: "이상담" },
    ],
    nextActions: [
      { date: "2026-03-12", action: "3월 프로모션 안내 문자", done: false },
    ],
    totalSpent: "0",
    visitCount: 1,
  },
];

type FilterTab = "전체" | "상담중" | "관리중" | "완료" | "이탈";

const statusBadge = (status: ConsultationStatus) => {
  switch (status) {
    case "상담중":
      return "bg-blue-100 text-blue-600";
    case "관리중":
      return "bg-amber-100 text-amber-600";
    case "완료":
      return "bg-emerald-100 text-emerald-600";
    case "이탈위험":
      return "bg-rose-100 text-rose-600";
    case "신규":
      return "bg-violet-100 text-violet-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const activityLog = [
  { time: "10:32", action: "김서연 고객 상담 메모 추가", staff: "이상담", type: "memo" },
  { time: "10:15", action: "정민수 고객 신규 등록", staff: "이상담", type: "new" },
  { time: "09:58", action: "송민지 고객 신규 문의 접수", staff: "이상담", type: "new" },
  { time: "09:45", action: "박지민 고객 울쎄라 2차 시술 완료", staff: "박매니저", type: "procedure" },
  { time: "09:30", action: "한소희 고객 코 필러 시술 예약 확정", staff: "이상담", type: "reservation" },
  { time: "09:12", action: "최유나 고객 이탈 위험 알림 발생", staff: "시스템", type: "alert" },
  { time: "08:50", action: "오승우 고객 실리프팅 상담 접수", staff: "박매니저", type: "consult" },
  { time: "08:30", action: "윤지혜 고객 피코레이저 완료 처리", staff: "박매니저", type: "procedure" },
];

export default function CRMPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("전체");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");

  const filtered = customers.filter((c) => {
    const matchesSearch =
      search.length === 0 ||
      c.name.includes(search) ||
      c.phone.includes(search) ||
      c.interestedProcedures.some((p) => p.includes(search));

    const matchesFilter =
      activeFilter === "전체" ||
      (activeFilter === "상담중" && c.status === "상담중") ||
      (activeFilter === "관리중" && c.status === "관리중") ||
      (activeFilter === "완료" && c.status === "완료") ||
      (activeFilter === "이탈" && c.status === "이탈위험");

    return matchesSearch && matchesFilter;
  });

  const selectedCustomer = customers.find((c) => c.id === selectedId) || null;

  const filterTabs: { label: FilterTab; count: number }[] = [
    { label: "전체", count: customers.length },
    { label: "상담중", count: customers.filter((c) => c.status === "상담중").length },
    { label: "관리중", count: customers.filter((c) => c.status === "관리중").length },
    { label: "완료", count: customers.filter((c) => c.status === "완료").length },
    { label: "이탈", count: customers.filter((c) => c.status === "이탈위험").length },
  ];

  const activityTypeIcon = (type: string) => {
    switch (type) {
      case "memo":
        return "bg-blue-100 text-blue-600";
      case "new":
        return "bg-violet-100 text-violet-600";
      case "procedure":
        return "bg-emerald-100 text-emerald-600";
      case "reservation":
        return "bg-amber-100 text-amber-600";
      case "alert":
        return "bg-rose-100 text-rose-600";
      case "consult":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F4F6FA]">
      {/* Header bar */}
      <div className="flex items-center gap-4 px-6 py-3 bg-white border-b border-gray-200 shrink-0">
        <h1 className="text-sm font-bold text-gray-800 shrink-0">CRM</h1>

        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="고객명, 전화번호, 시술명 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-9 pr-4 text-xs focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        <div className="flex items-center gap-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveFilter(tab.label)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                activeFilter === tab.label
                  ? "bg-blue-600 text-white font-medium"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              {tab.label}
              <span
                className={`ml-1 ${
                  activeFilter === tab.label ? "text-blue-200" : "text-gray-300"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={14} />
          신규 상담 등록
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Stats cards */}
        <div className="grid grid-cols-4 gap-4 px-6 pt-5 pb-4 shrink-0">
          {[
            {
              label: "전체 고객",
              value: "856",
              unit: "명",
              icon: Users,
              color: "text-blue-600",
              bg: "bg-blue-100",
            },
            {
              label: "상담 진행중",
              value: "42",
              unit: "건",
              icon: MessageCircle,
              color: "text-emerald-600",
              bg: "bg-emerald-100",
            },
            {
              label: "이번 달 전환",
              value: "28",
              unit: "건",
              icon: TrendingUp,
              color: "text-violet-600",
              bg: "bg-violet-100",
            },
            {
              label: "이탈 위험",
              value: "15",
              unit: "명",
              icon: AlertTriangle,
              color: "text-rose-600",
              bg: "bg-rose-100",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] text-gray-400">{stat.label}</span>
                <div
                  className={`p-2 rounded-2xl ${stat.bg} shadow-sm`}
                >
                  <stat.icon size={15} className={stat.color} />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-gray-900">
                  {stat.value}
                </span>
                <span className="text-xs text-gray-400">{stat.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main content - Two panels */}
        <div className="flex-1 flex gap-4 px-6 pb-4 overflow-hidden min-h-0">
          {/* Left panel - Customer list */}
          <div className="w-[55%] flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
              <span className="text-xs font-bold text-gray-700">
                고객 목록
              </span>
              <span className="text-[11px] text-gray-400">
                검색결과{" "}
                <span className="font-medium text-gray-600">
                  {filtered.length}
                </span>
                건
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => setSelectedId(customer.id)}
                  className={`px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors ${
                    selectedId === customer.id
                      ? "bg-blue-50/70 border-l-2 border-l-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div
                      className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-[11px] font-bold ${
                        customer.gender === "여"
                          ? "bg-pink-50 text-pink-500"
                          : "bg-blue-50 text-blue-500"
                      }`}
                    >
                      {customer.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] font-bold text-gray-900">
                          {customer.name}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {customer.gender} {customer.age}세
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusBadge(
                            customer.status
                          )}`}
                        >
                          {customer.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <Phone size={10} />
                          {customer.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag size={10} />
                          {customer.interestedProcedures.join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="shrink-0 text-right">
                      <div className="text-[11px] text-gray-400 mb-1">
                        {customer.lastConsultDate}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {customer.staff}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="flex items-center justify-center py-16">
                  <p className="text-xs text-gray-400">
                    검색 결과가 없습니다.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right panel - Customer detail */}
          <div className="w-[45%] flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {selectedCustomer ? (
              <div className="flex-1 overflow-y-auto">
                {/* Customer header */}
                <div className="px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${
                        selectedCustomer.gender === "여"
                          ? "bg-pink-50 text-pink-500"
                          : "bg-blue-50 text-blue-500"
                      }`}
                    >
                      {selectedCustomer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">
                          {selectedCustomer.name}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusBadge(
                            selectedCustomer.status
                          )}`}
                        >
                          {selectedCustomer.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                        <span>
                          {selectedCustomer.gender} {selectedCustomer.age}세
                        </span>
                        <span>|</span>
                        <span>{selectedCustomer.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                      <p className="text-[10px] text-gray-400 mb-0.5">
                        방문횟수
                      </p>
                      <p className="text-xs font-bold text-gray-700">
                        {selectedCustomer.visitCount}회
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                      <p className="text-[10px] text-gray-400 mb-0.5">
                        누적 매출
                      </p>
                      <p className="text-xs font-bold text-gray-700">
                        {selectedCustomer.totalSpent === "0"
                          ? "-"
                          : `${selectedCustomer.totalSpent}원`}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                      <p className="text-[10px] text-gray-400 mb-0.5">
                        유입경로
                      </p>
                      <p className="text-xs font-bold text-gray-700">
                        {selectedCustomer.source}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 관심 시술 tags */}
                <div className="px-5 py-3 border-b border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-500 mb-2">
                    관심 시술
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCustomer.interestedProcedures.map((proc) => (
                      <span
                        key={proc}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-medium"
                      >
                        {proc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 상담 이력 - timeline */}
                <div className="px-5 py-3 border-b border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-500 mb-3">
                    상담 이력
                  </p>
                  <div className="space-y-3">
                    {selectedCustomer.notes.map((note, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="flex flex-col items-center shrink-0">
                          <div className="w-2 h-2 rounded-full bg-blue-600 mt-1" />
                          {idx < selectedCustomer.notes.length - 1 && (
                            <div className="w-px flex-1 bg-gray-200 mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-medium text-gray-600">
                              {note.date}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {note.staff}
                            </span>
                          </div>
                          <p className="text-[12px] text-gray-600 leading-relaxed">
                            {note.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 메모/노트 입력 */}
                <div className="px-5 py-3 border-b border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-500 mb-2">
                    메모 추가
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="상담 메모를 입력하세요..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                    <button
                      onClick={() => setNewNote("")}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shrink-0"
                    >
                      추가
                    </button>
                  </div>
                </div>

                {/* 다음 액션 */}
                <div className="px-5 py-3">
                  <p className="text-[11px] font-semibold text-gray-500 mb-2">
                    다음 액션
                  </p>
                  <div className="space-y-2">
                    {selectedCustomer.nextActions.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-2 rounded-lg bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={item.done}
                          readOnly
                          className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] text-gray-700">
                            {item.action}
                          </p>
                          <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <Calendar size={9} />
                            {item.date}
                          </p>
                        </div>
                        <ChevronRight
                          size={12}
                          className="text-gray-300 shrink-0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                <div className="p-4 rounded-2xl bg-gray-100 shadow-sm mb-4">
                  <User size={24} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  고객을 선택해주세요
                </p>
                <p className="text-[11px] text-gray-400">
                  왼쪽 목록에서 고객을 클릭하면 상세 정보를 확인할 수 있습니다.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom section - 최근 활동 로그 */}
        <div className="px-6 pb-5 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-2xl bg-blue-100 shadow-sm">
                  <Activity size={13} className="text-blue-600" />
                </div>
                <span className="text-xs font-bold text-gray-700">
                  최근 활동 로그
                </span>
              </div>
              <span className="text-[11px] text-gray-400">오늘</span>
            </div>
            <div className="grid grid-cols-4 gap-x-6 gap-y-1.5">
              {activityLog.map((log, idx) => (
                <div key={idx} className="flex items-center gap-2 py-1">
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${activityTypeIcon(log.type).split(" ")[0].replace("bg-", "bg-")}`}
                    style={{
                      backgroundColor:
                        log.type === "memo" || log.type === "consult"
                          ? "#2563eb"
                          : log.type === "new"
                          ? "#7c3aed"
                          : log.type === "procedure"
                          ? "#059669"
                          : log.type === "reservation"
                          ? "#d97706"
                          : log.type === "alert"
                          ? "#e11d48"
                          : "#6b7280",
                    }}
                  />
                  <span className="text-[11px] text-gray-400 shrink-0">
                    {log.time}
                  </span>
                  <span className="text-[11px] text-gray-600 truncate">
                    {log.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
