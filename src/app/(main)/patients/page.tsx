"use client";

import {
  Search,
  UserPlus,
  Star,
  Activity,
  Shield,
  Calendar,
  Hash,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
  Send,
  FileText,
  ImageIcon,
  Trash2,
  RotateCcw,
  Edit3,
  Check,
  Info,
  ClipboardList,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// ─── Types ───

type VisitRecord = {
  id: string;
  date: string;
  dayOfWeek: string;
  time: string;
  doctor: string;
  insurance: string;
  visitType: "초진" | "재진";
  cc: string;
  bodyPart: string;
  symptoms: string;
  diagnoses: Diagnosis[];
  prescriptions: Prescription[];
  plan: string;
};

type Patient = {
  id: string;
  name: string;
  gender: "남" | "여";
  age: number;
  chartNumber: string;
  phone: string;
  insurance: string;
  lastVisit: string;
  diagnosis: string;
  status: "활성" | "비활성";
  isVip: boolean;
  address: string;
  totalVisits: number;
  visitHistory: VisitRecord[];
  memo: string;
};

type Diagnosis = { code: string; name: string; type: "상병" | "처방" | "진찰료" | "처방전" };
type Prescription = {
  id: string;
  code: string;
  name: string;
  shortName: string;
  days: number;
  times: number;
  qty: number;
  insuranceType: string;
  price: number;
  taxable: boolean;
};

type FilterTab = "전체" | "활성" | "비활성" | "VIP";

// ─── 약물 DB ───
const medicationDB = [
  { code: "672300240", name: "타이레놀8시간이알서방정(아세트아미노펜)_(0.65g/1정)", shortName: "타이레놀8시간이알서방정", category: "오더", price: 70, taxable: false },
  { code: "672300253", name: "어린이타이레놀현탁액(아세트아미노펜(미분화))_(16g/500mL)(무색소)", shortName: "어린이타이레놀현탁액", category: "처방아이템", price: 120, taxable: false },
  { code: "641500070", name: "아목시실린캡슐500mg", shortName: "아목시실린캡슐", category: "오더", price: 85, taxable: false },
  { code: "645001230", name: "세티리진정10mg", shortName: "세티리진정", category: "오더", price: 45, taxable: false },
  { code: "670800120", name: "이부프로펜정400mg", shortName: "이부프로펜정", category: "처방아이템", price: 55, taxable: false },
];

const diseaseDB = [
  { code: "L85.3", name: "피부건조증" },
  { code: "L29.9", name: "상세불명의 가려움" },
  { code: "J06.9", name: "급성 상기도 감염" },
  { code: "K30", name: "기능성 소화불량" },
  { code: "M54.5", name: "요통" },
  { code: "R51", name: "두통" },
  { code: "M51.1", name: "요추 추간판 탈출증" },
  { code: "S13.4", name: "경추 염좌" },
  { code: "M17.9", name: "골관절염 (무릎)" },
  { code: "M75.1", name: "어깨 충돌 증후군" },
  { code: "M79.1", name: "근막통증 증후군" },
  { code: "G56.0", name: "손목 터널 증후군" },
  { code: "M47.8", name: "퇴행성 디스크 질환" },
  { code: "M48.0", name: "척추관 협착증" },
  { code: "M72.2", name: "족저근막염" },
];

const orderSets = [
  { name: "★면절치료/피마틸릉증", starred: true },
  { name: "통증 치료", starred: false },
  { name: "처치실 처방", starred: false },
  { name: "검사 처방", starred: false },
  { name: "물리치료", starred: false },
  { name: "물리 검사", starred: false },
  { name: "보험 서류", starred: false },
  { name: "비급여/가정방문의료", starred: false },
  { name: "처방 서류", starred: false },
  { name: "다이어트", starred: false },
  { name: "금연 진료", starred: false },
  { name: "액션", starred: false },
  { name: "회부공", starred: false },
];

// ─── Dummy patients ───

const patients: Patient[] = [
  {
    id: "1",
    name: "김영수",
    gender: "남",
    age: 45,
    chartNumber: "C-2024-0001",
    phone: "010-1234-5678",
    insurance: "건강보험",
    lastVisit: "2026-03-10",
    diagnosis: "요추 추간판 탈출증",
    status: "활성",
    isVip: true,
    address: "서울시 강남구 역삼동",
    totalVisits: 28,
    visitHistory: [
      {
        id: "v1-1", date: "2026-03-10", dayOfWeek: "화", time: "10:30", doctor: "김의사", insurance: "건강보험", visitType: "재진",
        cc: "허리 통증 지속", bodyPart: "허리", symptoms: "요추부 방사통, 좌측 하지 저림",
        diagnoses: [
          { code: "M51.1", name: "요추 추간판 탈출증", type: "상병" },
          { code: "", name: "재진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" },
        ],
        prescriptions: [],
        plan: "도수치료 + 물리치료. 주 2회 내원 유지.",
      },
      {
        id: "v1-2", date: "2026-03-03", dayOfWeek: "화", time: "11:00", doctor: "김의사", insurance: "건강보험", visitType: "재진",
        cc: "허리 통증 호전 중", bodyPart: "허리", symptoms: "요추부 통증 감소, 좌측 하지 저림 경감",
        diagnoses: [
          { code: "M51.1", name: "요추 추간판 탈출증", type: "상병" },
          { code: "", name: "재진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" },
        ],
        prescriptions: [],
        plan: "도수치료 지속",
      },
      {
        id: "v1-3", date: "2026-02-24", dayOfWeek: "월", time: "14:00", doctor: "박의사", insurance: "건강보험", visitType: "재진",
        cc: "허리 통증 악화", bodyPart: "허리", symptoms: "요추부 심한 방사통, 보행 장애",
        diagnoses: [
          { code: "M51.1", name: "요추 추간판 탈출증", type: "상병" },
          { code: "", name: "재진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" },
        ],
        prescriptions: [
          { id: "rx1-1", code: "670800120", name: "이부프로펜정400mg", shortName: "이부프로펜정", days: 7, times: 3, qty: 1, insuranceType: "급여", price: 55, taxable: false },
        ],
        plan: "물리치료 + 주사치료. 약물 병행.",
      },
    ],
    memo: "직장인, 장시간 앉아서 근무. 주 2회 내원 권장.",
  },
  {
    id: "2",
    name: "이미영",
    gender: "여",
    age: 32,
    chartNumber: "C-2024-0023",
    phone: "010-2345-6789",
    insurance: "건강보험",
    lastVisit: "2026-03-09",
    diagnosis: "경추 염좌",
    status: "활성",
    isVip: false,
    address: "서울시 서초구 반포동",
    totalVisits: 12,
    visitHistory: [
      {
        id: "v2-1", date: "2026-03-09", dayOfWeek: "월", time: "09:30", doctor: "이의사", insurance: "건강보험", visitType: "재진",
        cc: "목 통증", bodyPart: "경추", symptoms: "경추부 통증, 회전 제한",
        diagnoses: [
          { code: "S13.4", name: "경추 염좌", type: "상병" },
          { code: "", name: "재진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" },
        ],
        prescriptions: [],
        plan: "물리치료 지속",
      },
      {
        id: "v2-2", date: "2026-03-02", dayOfWeek: "월", time: "10:00", doctor: "이의사", insurance: "건강보험", visitType: "초진",
        cc: "갑자기 목이 안 돌아감", bodyPart: "경추", symptoms: "경추부 급성 통증, 좌측 회전 장애",
        diagnoses: [
          { code: "S13.4", name: "경추 염좌", type: "상병" },
          { code: "", name: "초진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" },
        ],
        prescriptions: [
          { id: "rx2-1", code: "672300240", name: "타이레놀8시간이알서방정(아세트아미노펜)_(0.65g/1정)", shortName: "타이레놀8시간이알서방정", days: 5, times: 3, qty: 1, insuranceType: "비급여", price: 70, taxable: false },
        ],
        plan: "도수치료 + 약물 처방",
      },
    ],
    memo: "",
  },
  {
    id: "3",
    name: "박지훈",
    gender: "남",
    age: 58,
    chartNumber: "C-2024-0045",
    phone: "010-3456-7890",
    insurance: "의료급여 1종",
    lastVisit: "2026-03-08",
    diagnosis: "골관절염 (무릎)",
    status: "활성",
    isVip: false,
    address: "서울시 송파구 잠실동",
    totalVisits: 35,
    visitHistory: [
      {
        id: "v3-1", date: "2026-03-08", dayOfWeek: "일", time: "13:00", doctor: "박의사", insurance: "의료급여 1종", visitType: "재진",
        cc: "무릎 통증 지속", bodyPart: "무릎", symptoms: "양측 슬관절 통증, 보행 시 악화",
        diagnoses: [
          { code: "M17.9", name: "골관절염 (무릎)", type: "상병" },
          { code: "", name: "재진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" },
        ],
        prescriptions: [],
        plan: "주사치료 + 물리치료",
      },
      {
        id: "v3-2", date: "2026-03-01", dayOfWeek: "토", time: "11:30", doctor: "박의사", insurance: "의료급여 1종", visitType: "재진",
        cc: "무릎 부종", bodyPart: "무릎", symptoms: "우측 슬관절 부종, 열감",
        diagnoses: [
          { code: "M17.9", name: "골관절염 (무릎)", type: "상병" },
          { code: "", name: "재진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" },
        ],
        prescriptions: [
          { id: "rx3-1", code: "670800120", name: "이부프로펜정400mg", shortName: "이부프로펜정", days: 7, times: 2, qty: 1, insuranceType: "급여", price: 55, taxable: false },
        ],
        plan: "물리치료. 인공관절 수술 검토 예정.",
      },
    ],
    memo: "고혈압 약 복용 중. 무릎 인공관절 수술 고려.",
  },
  {
    id: "4",
    name: "최수연",
    gender: "여",
    age: 27,
    chartNumber: "C-2024-0067",
    phone: "010-4567-8901",
    insurance: "건강보험",
    lastVisit: "2026-03-07",
    diagnosis: "어깨 충돌 증후군",
    status: "활성",
    isVip: true,
    address: "경기도 성남시 분당구",
    totalVisits: 8,
    visitHistory: [
      {
        id: "v4-1", date: "2026-03-07", dayOfWeek: "토", time: "15:00", doctor: "김의사", insurance: "건강보험", visitType: "재진",
        cc: "어깨 통증", bodyPart: "우측 어깨", symptoms: "우측 견관절 통증, 외전 시 악화",
        diagnoses: [
          { code: "M75.1", name: "어깨 충돌 증후군", type: "상병" },
          { code: "", name: "재진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" },
        ],
        prescriptions: [],
        plan: "도수치료. 운동 복귀 목표 설정.",
      },
      {
        id: "v4-2", date: "2026-02-28", dayOfWeek: "금", time: "14:30", doctor: "김의사", insurance: "건강보험", visitType: "초진",
        cc: "수영 후 어깨 통증 발생", bodyPart: "우측 어깨", symptoms: "우측 견관절 충돌 증상, 야간통",
        diagnoses: [
          { code: "M75.1", name: "어깨 충돌 증후군", type: "상병" },
          { code: "", name: "초진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" },
        ],
        prescriptions: [
          { id: "rx4-1", code: "645001230", name: "세티리진정10mg", shortName: "세티리진정", days: 3, times: 1, qty: 1, insuranceType: "급여", price: 45, taxable: false },
        ],
        plan: "물리치료 + 운동치료 시작",
      },
    ],
    memo: "수영 선수 출신. 운동 복귀 목표.",
  },
  {
    id: "5",
    name: "정하늘",
    gender: "남",
    age: 41,
    chartNumber: "C-2024-0089",
    phone: "010-5678-9012",
    insurance: "건강보험",
    lastVisit: "2026-03-05",
    diagnosis: "근막통증 증후군",
    status: "활성",
    isVip: false,
    address: "서울시 마포구 합정동",
    totalVisits: 15,
    visitHistory: [
      {
        id: "v5-1", date: "2026-03-05", dayOfWeek: "목", time: "16:00", doctor: "이의사", insurance: "건강보험", visitType: "재진",
        cc: "어깨/등 근육 통증", bodyPart: "승모근, 견갑골 주위", symptoms: "승모근 압통점, 두통 동반",
        diagnoses: [
          { code: "M79.1", name: "근막통증 증후군", type: "상병" },
          { code: "R51", name: "두통", type: "상병" },
          { code: "", name: "재진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" },
        ],
        prescriptions: [
          { id: "rx5-1", code: "672300240", name: "타이레놀8시간이알서방정(아세트아미노펜)_(0.65g/1정)", shortName: "타이레놀8시간이알서방정", days: 5, times: 3, qty: 1, insuranceType: "비급여", price: 70, taxable: false },
        ],
        plan: "도수치료 + IMS. 스트레칭 교육.",
      },
    ],
    memo: "",
  },
  {
    id: "6",
    name: "강민서",
    gender: "여",
    age: 35,
    chartNumber: "C-2024-0102",
    phone: "010-6789-0123",
    insurance: "산재보험",
    lastVisit: "2026-02-28",
    diagnosis: "손목 터널 증후군",
    status: "활성",
    isVip: false,
    address: "서울시 영등포구 여의도동",
    totalVisits: 10,
    visitHistory: [
      {
        id: "v6-1", date: "2026-02-28", dayOfWeek: "금", time: "09:00", doctor: "박의사", insurance: "산재보험", visitType: "재진",
        cc: "손목 저림 지속", bodyPart: "양측 손목", symptoms: "양측 수근관 압통, 야간 저림 호소",
        diagnoses: [
          { code: "G56.0", name: "손목 터널 증후군", type: "상병" },
          { code: "", name: "재진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" },
        ],
        prescriptions: [],
        plan: "물리치료 + 보조기 착용 유지. 키보드 사용 줄이도록 권고.",
      },
    ],
    memo: "사무직. 키보드 사용 시간 줄이도록 권고.",
  },
  {
    id: "7",
    name: "홍길동",
    gender: "남",
    age: 52,
    chartNumber: "C-2024-0115",
    phone: "010-7890-1234",
    insurance: "건강보험",
    lastVisit: "2026-02-20",
    diagnosis: "퇴행성 디스크 질환",
    status: "비활성",
    isVip: false,
    address: "경기도 고양시 일산동구",
    totalVisits: 22,
    visitHistory: [
      {
        id: "v7-1", date: "2026-02-20", dayOfWeek: "목", time: "10:00", doctor: "김의사", insurance: "건강보험", visitType: "재진",
        cc: "허리 통증", bodyPart: "요추", symptoms: "요추부 만성 통증, 앉은 자세 시 악화",
        diagnoses: [
          { code: "M47.8", name: "퇴행성 디스크 질환", type: "상병" },
          { code: "", name: "재진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" },
        ],
        prescriptions: [],
        plan: "도수치료. 타병원 전원 검토.",
      },
    ],
    memo: "타병원 전원 예정.",
  },
  {
    id: "8",
    name: "윤서현",
    gender: "여",
    age: 29,
    chartNumber: "C-2024-0128",
    phone: "010-8901-2345",
    insurance: "자동차보험",
    lastVisit: "2026-03-10",
    diagnosis: "경추 염좌 (교통사고)",
    status: "활성",
    isVip: true,
    address: "서울시 용산구 이태원동",
    totalVisits: 18,
    visitHistory: [
      {
        id: "v8-1", date: "2026-03-10", dayOfWeek: "화", time: "11:00", doctor: "이의사", insurance: "자동차보험", visitType: "재진",
        cc: "목 통증 지속", bodyPart: "경추", symptoms: "경추부 통증, 두통 동반, ROM 제한",
        diagnoses: [
          { code: "S13.4", name: "경추 염좌 (교통사고)", type: "상병" },
          { code: "R51", name: "두통", type: "상병" },
          { code: "", name: "재진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" },
        ],
        prescriptions: [
          { id: "rx8-1", code: "672300240", name: "타이레놀8시간이알서방정(아세트아미노펜)_(0.65g/1정)", shortName: "타이레놀8시간이알서방정", days: 7, times: 3, qty: 1, insuranceType: "비급여", price: 70, taxable: false },
        ],
        plan: "물리치료 + 도수치료. 보험사 서류 발급 예정.",
      },
      {
        id: "v8-2", date: "2026-03-07", dayOfWeek: "토", time: "14:00", doctor: "이의사", insurance: "자동차보험", visitType: "재진",
        cc: "목 통증", bodyPart: "경추", symptoms: "경추부 통증 지속",
        diagnoses: [
          { code: "S13.4", name: "경추 염좌 (교통사고)", type: "상병" },
          { code: "", name: "재진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" },
        ],
        prescriptions: [],
        plan: "물리치료 지속",
      },
      {
        id: "v8-3", date: "2026-03-04", dayOfWeek: "수", time: "09:30", doctor: "김의사", insurance: "자동차보험", visitType: "초진",
        cc: "교통사고 후 목/허리 통증", bodyPart: "경추, 요추", symptoms: "경추부 급성 통증, 요추부 타박",
        diagnoses: [
          { code: "S13.4", name: "경추 염좌 (교통사고)", type: "상병" },
          { code: "M54.5", name: "요통", type: "상병" },
          { code: "", name: "초진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" },
        ],
        prescriptions: [
          { id: "rx8-2", code: "670800120", name: "이부프로펜정400mg", shortName: "이부프로펜정", days: 7, times: 3, qty: 1, insuranceType: "급여", price: 55, taxable: false },
          { id: "rx8-3", code: "641500070", name: "아목시실린캡슐500mg", shortName: "아목시실린캡슐", days: 5, times: 2, qty: 1, insuranceType: "급여", price: 85, taxable: false },
        ],
        plan: "도수치료 + 주사치료. 약물 병행. 보험사 서류 준비.",
      },
    ],
    memo: "교통사고 후유증. 보험사 서류 필요.",
  },
  {
    id: "9",
    name: "오태민",
    gender: "남",
    age: 63,
    chartNumber: "C-2024-0140",
    phone: "010-9012-3456",
    insurance: "건강보험",
    lastVisit: "2026-01-15",
    diagnosis: "척추관 협착증",
    status: "비활성",
    isVip: false,
    address: "서울시 종로구 혜화동",
    totalVisits: 40,
    visitHistory: [
      {
        id: "v9-1", date: "2026-01-15", dayOfWeek: "목", time: "10:30", doctor: "박의사", insurance: "건강보험", visitType: "재진",
        cc: "하지 방사통", bodyPart: "요추", symptoms: "양측 하지 방사통, 간헐적 파행",
        diagnoses: [
          { code: "M48.0", name: "척추관 협착증", type: "상병" },
          { code: "", name: "재진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" },
        ],
        prescriptions: [
          { id: "rx9-1", code: "672300240", name: "타이레놀8시간이알서방정(아세트아미노펜)_(0.65g/1정)", shortName: "타이레놀8시간이알서방정", days: 14, times: 3, qty: 1, insuranceType: "비급여", price: 70, taxable: false },
        ],
        plan: "물리치료. 보존적 치료 유지. 수술 재논의 예정.",
      },
    ],
    memo: "당뇨 있음. 수술 권유하였으나 보존적 치료 희망.",
  },
  {
    id: "10",
    name: "신예린",
    gender: "여",
    age: 38,
    chartNumber: "C-2024-0155",
    phone: "010-0123-4567",
    insurance: "건강보험",
    lastVisit: "2026-03-09",
    diagnosis: "족저근막염",
    status: "활성",
    isVip: false,
    address: "서울시 강동구 천호동",
    totalVisits: 6,
    visitHistory: [
      {
        id: "v10-1", date: "2026-03-09", dayOfWeek: "월", time: "16:30", doctor: "김의사", insurance: "건강보험", visitType: "재진",
        cc: "발바닥 통증", bodyPart: "우측 족저", symptoms: "우측 족저부 압통, 기상 시 악화",
        diagnoses: [
          { code: "M72.2", name: "족저근막염", type: "상병" },
          { code: "", name: "재진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" },
        ],
        prescriptions: [],
        plan: "체외충격파 + 물리치료. 스트레칭 교육.",
      },
      {
        id: "v10-2", date: "2026-03-02", dayOfWeek: "월", time: "15:00", doctor: "김의사", insurance: "건강보험", visitType: "초진",
        cc: "아침에 발바닥이 아픔", bodyPart: "우측 족저", symptoms: "우측 족저근막 압통, 보행 시 통증",
        diagnoses: [
          { code: "M72.2", name: "족저근막염", type: "상병" },
          { code: "", name: "초진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" },
        ],
        prescriptions: [
          { id: "rx10-1", code: "670800120", name: "이부프로펜정400mg", shortName: "이부프로펜정", days: 5, times: 2, qty: 1, insuranceType: "급여", price: 55, taxable: false },
        ],
        plan: "물리치료 시작. 인솔 착용 권고.",
      },
    ],
    memo: "",
  },
];

// ─── Helpers ───

const insuranceBadgeColor = (type: string) => {
  switch (type) {
    case "건강보험": return "bg-blue-100 text-blue-600";
    case "의료급여 1종":
    case "의료급여 2종": return "bg-green-100 text-green-600";
    case "산재보험": return "bg-orange-100 text-orange-600";
    case "자동차보험": return "bg-purple-100 text-purple-600";
    default: return "bg-gray-100 text-gray-600";
  }
};

// ─── 수납 추가 팝업 ───
function PaymentModal({ amount, onClose }: { amount: number; onClose: () => void }) {
  const [payMethod, setPayMethod] = useState("카드");
  const [installment, setInstallment] = useState("일시불");
  const [taxable, setTaxable] = useState(true);
  const [terminalSync, setTerminalSync] = useState(true);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[420px]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800">수납 추가</h2>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <div className={`w-8 h-4.5 rounded-full relative transition-colors ${taxable ? "bg-blue-500" : "bg-gray-300"}`}
                onClick={() => setTaxable(!taxable)}>
                <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-all ${taxable ? "left-[18px]" : "left-0.5"}`} />
              </div>
              <span className="text-[11px] text-gray-500">과세적용</span>
            </label>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><X size={16} /></button>
          </div>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">보험 금액</span>
            <span className="text-sm font-semibold text-gray-800">{amount.toLocaleString()} 원</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">비과세금액</span>
            <span className="text-sm text-gray-600">{amount.toLocaleString()} 원</span>
          </div>
          <div>
            <label className="text-[11px] text-gray-400 mb-1 block">비과세 본계금액 *</label>
            <input type="text" defaultValue={amount.toLocaleString()}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400" />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 mb-1 block">결제수단 *</label>
            <div className="flex gap-2">
              {["카드", "현금", "할인금", "선납금"].map((m) => (
                <button key={m} onClick={() => setPayMethod(m)}
                  className={`flex-1 py-2 text-[11px] rounded-lg border transition-colors ${
                    payMethod === m ? "border-blue-400 bg-blue-50 text-blue-600 font-semibold" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}>{m}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] text-gray-400 mb-1 block">할부 선택 *</label>
            <select value={installment} onChange={(e) => setInstallment(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400">
              <option>일시불</option><option>2개월</option><option>3개월</option><option>6개월</option><option>12개월</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${terminalSync ? "bg-blue-500" : "bg-gray-300"}`}
              onClick={() => setTerminalSync(!terminalSync)}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${terminalSync ? "left-[18px]" : "left-0.5"}`} />
            </div>
            <span className="text-xs text-gray-500">단말기 연동</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">취소</button>
          <button onClick={onClose} className="px-5 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            {amount.toLocaleString()}원 수납
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 처방 상세 패널 ───
function PrescriptionPanel({
  prescription, onUpdate, onDelete, onClose,
}: {
  prescription: Prescription;
  onUpdate: (p: Prescription) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [days, setDays] = useState(prescription.days);
  const [times, setTimes] = useState(prescription.times);
  const [qty, setQty] = useState(prescription.qty);
  const [insuranceType, setInsuranceType] = useState(prescription.insuranceType);
  const [price, setPrice] = useState(prescription.price);
  const [taxable, setTaxable] = useState(prescription.taxable);

  const handleSave = () => {
    onUpdate({ ...prescription, days, times, qty, insuranceType, price: price * days * qty, taxable });
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mt-3">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-0.5">{prescription.shortName}</p>
          <p className="text-[11px] text-gray-400">{prescription.code} {prescription.name}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <label className="text-[10px] text-gray-400 block mb-0.5">일수</label>
          <input type="number" value={days} onChange={(e) => setDays(Number(e.target.value) || 1)} min={1}
            className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs text-center focus:border-blue-400 focus:outline-none" />
        </div>
        <div>
          <label className="text-[10px] text-gray-400 block mb-0.5">횟수</label>
          <input type="number" value={times} onChange={(e) => setTimes(Number(e.target.value) || 1)} min={1}
            className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs text-center focus:border-blue-400 focus:outline-none" />
        </div>
        <div>
          <label className="text-[10px] text-gray-400 block mb-0.5">정</label>
          <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value) || 1)} min={1}
            className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs text-center focus:border-blue-400 focus:outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label className="text-[10px] text-gray-400 block mb-0.5">본인부담</label>
          <select value={insuranceType} onChange={(e) => setInsuranceType(e.target.value)}
            className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:border-blue-400 focus:outline-none">
            <option>비급여</option><option>급여</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] text-gray-400 block mb-0.5">급여 금액 *</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)}
            className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:border-blue-400 focus:outline-none" />
        </div>
      </div>
      <label className="flex items-center gap-2 mb-3">
        <input type="checkbox" checked={taxable} onChange={(e) => setTaxable(e.target.checked)} className="w-3.5 h-3.5 rounded border-gray-300" />
        <span className="text-[11px] text-gray-500">비급여 시, 금액 금액 적용 / 과세적용</span>
      </label>
      <div className="flex justify-end gap-2">
        <button onClick={onDelete} className="px-3 py-1.5 text-[11px] text-red-500 border border-red-200 rounded-lg hover:bg-red-50">처방삭제</button>
        <button onClick={() => { handleSave(); onClose(); }} className="px-3 py-1.5 text-[11px] text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50">닫기</button>
      </div>
    </div>
  );
}

// ─── Main Page ───

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("전체");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Visit history state
  const [visitRecords, setVisitRecords] = useState<VisitRecord[]>([]);
  const [selectedVisit, setSelectedVisit] = useState<VisitRecord | null>(null);

  // Notes
  const [noteText, setNoteText] = useState("");
  const [patientNotes, setPatientNotes] = useState<{ text: string; time: string; author: string }[]>([]);

  // Order set search
  const [orderSearch, setOrderSearch] = useState("");

  // Record editing
  const [editingRecord, setEditingRecord] = useState(false);
  const [recordText, setRecordText] = useState("");

  // Diagnosis & prescription search
  const [diagSearch, setDiagSearch] = useState("");
  const [diagSearchFocused, setDiagSearchFocused] = useState(false);
  const [activeSearchTab, setActiveSearchTab] = useState("전체(요약)");
  const [editingPrescription, setEditingPrescription] = useState<string | null>(null);
  const [diseaseInput, setDiseaseInput] = useState("");
  const [diseaseSearchFocused, setDiseaseSearchFocused] = useState(false);

  // Payment
  const [showPayment, setShowPayment] = useState(false);

  const diagSearchRef = useRef<HTMLDivElement>(null);
  const diseaseSearchRef = useRef<HTMLDivElement>(null);

  // Select patient handler
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setVisitRecords(patient.visitHistory);
    setSelectedVisit(patient.visitHistory.length > 0 ? patient.visitHistory[0] : null);
    setEditingRecord(false);
    setEditingPrescription(null);
    setDiagSearch("");
    setDiseaseInput("");
    setPatientNotes([]);
    setNoteText("");
  };

  // Select visit handler
  const handleSelectVisit = (visit: VisitRecord) => {
    setSelectedVisit(visit);
    setRecordText(visit.symptoms);
    setEditingRecord(false);
    setEditingPrescription(null);
  };

  // Total amount
  const totalAmount = selectedVisit
    ? selectedVisit.prescriptions.reduce((sum, p) => sum + p.price * p.days * p.qty, 0)
      + (selectedVisit.diagnoses.some((d) => d.type === "진찰료") ? 3700 : 0)
    : 0;

  // Outside click handler
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (diagSearchRef.current && !diagSearchRef.current.contains(e.target as Node)) setDiagSearchFocused(false);
      if (diseaseSearchRef.current && !diseaseSearchRef.current.contains(e.target as Node)) setDiseaseSearchFocused(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredOrders = orderSearch ? orderSets.filter((o) => o.name.includes(orderSearch)) : orderSets;

  const diagSearchResults = diagSearch.length >= 1
    ? medicationDB.filter((m) => m.name.includes(diagSearch) || m.shortName.includes(diagSearch) || m.code.includes(diagSearch))
    : [];

  const diseaseSearchResults = diseaseInput.length >= 1
    ? diseaseDB.filter((d) => d.name.includes(diseaseInput) || d.code.includes(diseaseInput))
    : [];

  const searchTabs = ["전체(요약)", "상병", "오더", "오더세트", "구입아이템", "처방아이템", "단축어"];

  // New chart
  const handleNewChart = () => {
    if (!selectedPatient) return;
    const now = new Date();
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const newVisit: VisitRecord = {
      id: `v${Date.now()}`,
      date: now.toISOString().split("T")[0],
      dayOfWeek: days[now.getDay()],
      time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
      doctor: "김의사",
      insurance: selectedPatient.insurance,
      visitType: "재진",
      cc: "",
      bodyPart: "",
      symptoms: "",
      diagnoses: [{ code: "", name: "재진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" }],
      prescriptions: [],
      plan: "",
    };
    const updated = [newVisit, ...visitRecords];
    setVisitRecords(updated);
    setSelectedVisit(newVisit);
    setEditingRecord(true);
    setRecordText("");
  };

  // Add prescription
  const addPrescription = (med: typeof medicationDB[0]) => {
    if (!selectedVisit) return;
    const newRx: Prescription = {
      id: `rx${Date.now()}`,
      code: med.code,
      name: med.name,
      shortName: med.shortName,
      days: 1, times: 1, qty: 1,
      insuranceType: "비급여",
      price: med.price,
      taxable: med.taxable,
    };
    const updated = { ...selectedVisit, prescriptions: [...selectedVisit.prescriptions, newRx] };
    setSelectedVisit(updated);
    setVisitRecords((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    setDiagSearch("");
    setDiagSearchFocused(false);
    setEditingPrescription(newRx.id);
  };

  // Add disease
  const addDisease = (d: typeof diseaseDB[0]) => {
    if (!selectedVisit) return;
    const newDiag: Diagnosis = { code: d.code, name: d.name, type: "상병" };
    const updated = { ...selectedVisit, diagnoses: [...selectedVisit.diagnoses, newDiag] };
    setSelectedVisit(updated);
    setVisitRecords((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    setDiseaseInput("");
    setDiseaseSearchFocused(false);
  };

  // Update prescription
  const updatePrescription = (p: Prescription) => {
    if (!selectedVisit) return;
    const updated = { ...selectedVisit, prescriptions: selectedVisit.prescriptions.map((rx) => (rx.id === p.id ? p : rx)) };
    setSelectedVisit(updated);
    setVisitRecords((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
  };

  // Delete prescription
  const deletePrescription = (id: string) => {
    if (!selectedVisit) return;
    const updated = { ...selectedVisit, prescriptions: selectedVisit.prescriptions.filter((rx) => rx.id !== id) };
    setSelectedVisit(updated);
    setVisitRecords((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    setEditingPrescription(null);
  };

  // Send note
  const handleSendNote = () => {
    if (!noteText.trim()) return;
    const now = new Date();
    setPatientNotes((prev) => [...prev, {
      text: noteText,
      time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
      author: "김의사",
    }]);
    setNoteText("");
  };

  // Filtering
  const filtered = patients.filter((p) => {
    const matchesSearch =
      search.length === 0 ||
      p.name.includes(search) ||
      p.chartNumber.includes(search) ||
      p.phone.includes(search);
    const matchesFilter =
      activeFilter === "전체" ||
      (activeFilter === "활성" && p.status === "활성") ||
      (activeFilter === "비활성" && p.status === "비활성") ||
      (activeFilter === "VIP" && p.isVip);
    return matchesSearch && matchesFilter;
  });

  const filterTabs: { label: FilterTab; count: number }[] = [
    { label: "전체", count: patients.length },
    { label: "활성", count: patients.filter((p) => p.status === "활성").length },
    { label: "비활성", count: patients.filter((p) => p.status === "비활성").length },
    { label: "VIP", count: patients.filter((p) => p.isVip).length },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#F4F6FA]">
      {/* Top header bar */}
      <div className="flex items-center gap-4 px-6 py-3 bg-white border-b border-gray-200 shrink-0">
        <h1 className="text-sm font-bold text-gray-800 shrink-0">환자</h1>
        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          <span>전체 환자 <span className="font-semibold text-gray-600">1,247</span>명</span>
          <span className="text-gray-200">|</span>
          <span>오늘 방문 <span className="font-semibold text-gray-600">23</span>명</span>
          <span className="text-gray-200">|</span>
          <span>이번 달 신규 <span className="font-semibold text-gray-600">45</span>명</span>
        </div>
        <div className="ml-auto">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            <UserPlus size={14} />
            신규환자 등록
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Patient list (~280px) */}
        <div className="w-[280px] shrink-0 bg-white border-r border-gray-200 flex flex-col">
          {/* Search bar */}
          <div className="px-3 py-3 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="이름, 차트번호, 전화번호"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-7 text-xs focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100">
            {filterTabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveFilter(tab.label)}
                className={`px-2 py-1 text-[11px] rounded-md transition-colors ${
                  activeFilter === tab.label
                    ? "bg-blue-600 text-white font-medium"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                {tab.label}
                <span className={`ml-1 ${activeFilter === tab.label ? "text-blue-200" : "text-gray-300"}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Patient list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map((patient) => (
              <div
                key={patient.id}
                onClick={() => handleSelectPatient(patient)}
                className={`px-3 py-2.5 border-b border-gray-50 cursor-pointer transition-colors ${
                  selectedPatient?.id === patient.id ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[13px] font-bold text-gray-900">{patient.name}</span>
                  <span className="text-[11px] text-gray-400">
                    {patient.gender} · {patient.age}세
                  </span>
                  {patient.isVip && (
                    <span className="flex items-center gap-0.5 text-[10px] px-1 py-0 rounded bg-amber-100 text-amber-600 font-medium">
                      <Star size={8} className="fill-amber-400" />
                      VIP
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-0.5">
                  <span className="font-mono text-gray-500">{patient.chartNumber}</span>
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0 rounded-full font-medium ${insuranceBadgeColor(patient.insurance)}`}>
                    {patient.insurance}
                  </span>
                  <span className="text-[10px] text-gray-400">최근 {patient.lastVisit}</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 truncate">{patient.diagnosis}</p>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-xs text-gray-400">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right panel - Detail */}
        {selectedPatient ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Patient info bar */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-b border-gray-200 shrink-0">
              <span className="text-xs text-gray-400">no. {selectedPatient.chartNumber}</span>
              <span className="text-sm font-bold text-gray-900">{selectedPatient.name}</span>
              <span className="text-xs text-gray-400">{selectedPatient.gender}, {selectedPatient.age}세</span>
              <span className="text-xs text-gray-400">(생년월일 미등록)</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${insuranceBadgeColor(selectedPatient.insurance)}`}>{selectedPatient.insurance}</span>
              <span className="text-xs text-gray-400 ml-2">체온 36.5</span>
              <span className="text-xs text-blue-500 ml-2 cursor-pointer hover:underline">가족관계추가</span>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-4 gap-3 px-4 py-3 bg-white border-b border-gray-200 shrink-0">
              {[
                { label: "총 내원횟수", value: selectedPatient.totalVisits.toString(), unit: "회", icon: Activity, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
                { label: "최근 내원일", value: selectedPatient.lastVisit, unit: "", icon: Calendar, iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
                { label: "보험유형", value: selectedPatient.insurance, unit: "", icon: Shield, iconBg: "bg-violet-100", iconColor: "text-violet-600" },
                { label: "VIP여부", value: selectedPatient.isVip ? "VIP" : "일반", unit: "", icon: Star, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-gray-400">{stat.label}</span>
                    <div className={`p-1.5 rounded-2xl ${stat.iconBg} shadow-sm`}>
                      <stat.icon size={13} className={stat.iconColor} />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-gray-900">{stat.value}</span>
                    {stat.unit && <span className="text-xs text-gray-400">{stat.unit}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* 3-column layout */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left column: 내원이력 */}
              <div className="w-[240px] shrink-0 bg-white border-r border-gray-200 flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <span className="text-sm font-bold text-gray-800">내원이력</span>
                  <button className="text-gray-400 hover:text-gray-600"><FileText size={14} /></button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {visitRecords.map((visit) => (
                    <button
                      key={visit.id}
                      onClick={() => handleSelectVisit(visit)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors ${
                        selectedVisit?.id === visit.id ? "bg-blue-50 border-l-2 border-l-blue-500" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold ${selectedVisit?.id === visit.id ? "text-blue-600" : "text-gray-700"}`}>
                          {visit.date} ({visit.dayOfWeek})
                        </span>
                        {selectedVisit?.id === visit.id && <Check size={12} className="text-blue-500" />}
                      </div>
                      <p className="text-[11px] text-gray-400 mb-1">담당의: {visit.doctor}</p>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-600">{visit.insurance}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{visit.visitType}</span>
                      </div>
                      {visit.cc && (
                        <div className="text-[11px] text-gray-500 space-y-0.5">
                          <p>· {visit.cc}</p>
                          {visit.bodyPart && <p>· 부위: {visit.bodyPart}</p>}
                          <p>· 증상: {visit.symptoms}</p>
                        </div>
                      )}
                      {visit.diagnoses.filter((d) => d.type === "상병").length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <p className="text-[10px] text-gray-400 mb-1">진단/처방란</p>
                          {visit.diagnoses.filter((d) => d.type === "상병").map((d, i) => (
                            <p key={i} className="text-[11px] text-gray-500">{d.name}</p>
                          ))}
                          <button className="text-[10px] text-blue-500 mt-1 hover:underline">진료 확인</button>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
                  <button onClick={handleNewChart} className="flex items-center gap-1 px-3 py-1.5 text-[11px] bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <Plus size={12} /> 새 차트
                  </button>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <span>{visitRecords.length}개 중 {selectedVisit ? visitRecords.indexOf(selectedVisit) + 1 : 0}</span>
                    <button className="p-0.5 hover:text-gray-600"><ChevronLeft size={12} /></button>
                    <button className="p-0.5 hover:text-gray-600"><ChevronRight size={12} /></button>
                  </div>
                </div>
              </div>

              {/* Center column: 진료 콘텐츠 */}
              <div className="flex-1 overflow-y-auto bg-[#F4F6FA] flex flex-col">
                {selectedVisit ? (
                  <>
                    {/* Date header */}
                    <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shrink-0">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-800">{selectedVisit.date} ({selectedVisit.dayOfWeek}) {selectedVisit.time}</span>
                        <span className="text-xs text-gray-400">진술: {selectedVisit.doctor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-[11px] px-2.5 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50">바코드</button>
                        <button className="text-[11px] px-2.5 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50">PACS</button>
                        <button className="text-[11px] px-2.5 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50">연결진료</button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                      {/* 처방 추가 */}
                      <div className="flex items-center justify-between">
                        <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"><Plus size={14} /> 처방 추가</button>
                        <button className="text-xs text-blue-500 hover:underline">처방 리스트</button>
                      </div>

                      {/* 진료기록 + 이미지 */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-bold text-gray-800">진료기록</h3>
                            <button className="text-gray-400 hover:text-gray-600"><Settings size={14} /></button>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <span className="text-[11px] text-gray-400">부위:</span>
                              <p className="text-xs text-gray-600 mt-0.5">{selectedVisit.bodyPart || "-"}</p>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <button className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">오늘 0</button>
                              <button className="text-[11px] px-2 py-0.5 rounded text-gray-400 hover:bg-gray-50">진료</button>
                            </div>
                            <div>
                              <span className="text-[11px] text-gray-400">증상:</span>
                              {editingRecord ? (
                                <textarea value={recordText} onChange={(e) => setRecordText(e.target.value)}
                                  className="w-full mt-1 border border-blue-300 rounded-lg px-3 py-2 text-xs text-gray-700 h-20 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
                                  placeholder="증상을 입력하세요" autoFocus />
                              ) : (
                                <p className="text-xs text-gray-600 mt-0.5">{selectedVisit.symptoms || "-"}</p>
                              )}
                            </div>
                            {selectedVisit.plan && (
                              <div className="pt-2 border-t border-gray-100">
                                <span className="text-[11px] text-gray-400">Plan:</span>
                                <p className="text-xs text-gray-600 mt-0.5">{selectedVisit.plan}</p>
                              </div>
                            )}
                            <div className="flex justify-end">
                              <button onClick={() => setEditingRecord(!editingRecord)}
                                className="text-[11px] px-3 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50">
                                {editingRecord ? "저장" : "편집기"}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-bold text-gray-800">이미지</h3>
                            <button className="text-[11px] px-2 py-0.5 rounded border border-gray-200 text-gray-400 hover:bg-gray-50">전체</button>
                          </div>
                          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <ImageIcon size={24} className="text-gray-300 mx-auto mb-2" />
                              <p className="text-[11px] text-gray-300">이미지 없음</p>
                              <button className="text-[11px] text-blue-500 mt-2 hover:underline">+ 추가</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 진단 및 처방 */}
                      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xs font-bold text-gray-800">진단 및 처방</h3>
                            <button className="text-[11px] text-blue-500 hover:underline">마약류조회</button>
                          </div>
                          <div className="flex items-center gap-1">
                            <button className="p-1 text-gray-400 hover:text-gray-600"><RotateCcw size={13} /></button>
                            <button className="p-1 text-gray-400 hover:text-gray-600"><Trash2 size={13} /></button>
                            <button className="p-1 text-gray-400 hover:text-gray-600"><Settings size={13} /></button>
                          </div>
                        </div>

                        {/* Drug search */}
                        <div ref={diagSearchRef} className="relative mb-3">
                          <input type="text" value={diagSearch} onChange={(e) => setDiagSearch(e.target.value)}
                            onFocus={() => setDiagSearchFocused(true)}
                            placeholder="약물/처방 검색 (예: 타이레놀)"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400" />
                          {diagSearchFocused && diagSearch.length >= 1 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-[320px] overflow-y-auto">
                              <div className="flex items-center gap-0 px-3 py-2 border-b border-gray-100 overflow-x-auto">
                                {searchTabs.map((tab) => (
                                  <button key={tab} onClick={() => setActiveSearchTab(tab)}
                                    className={`text-[11px] px-2 py-1 rounded whitespace-nowrap transition-colors ${
                                      activeSearchTab === tab ? "text-blue-600 font-semibold" : "text-gray-400 hover:text-gray-600"
                                    }`}>{tab}</button>
                                ))}
                              </div>
                              {diagSearchResults.length > 0 ? (
                                <div className="divide-y divide-gray-50">
                                  {diagSearchResults.filter((m) => m.category === "오더").length > 0 && (
                                    <div className="px-4 py-2">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-[11px] text-gray-400 font-medium">오더</span>
                                        <button className="text-[11px] text-blue-500">더보기</button>
                                      </div>
                                      {diagSearchResults.filter((m) => m.category === "오더").map((m) => (
                                        <button key={m.code} onClick={() => addPrescription(m)}
                                          className="w-full text-left py-1.5 text-xs text-gray-600 hover:text-blue-600 flex items-center gap-2">
                                          <Search size={11} className="text-gray-300 shrink-0" />
                                          <span><span className="text-blue-500 font-medium">{m.shortName}</span>{m.name.replace(m.shortName, "")}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                  {diagSearchResults.filter((m) => m.category === "처방아이템").length > 0 && (
                                    <div className="px-4 py-2">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-[11px] text-gray-400 font-medium">처방아이템</span>
                                        <button className="text-[11px] text-blue-500">더보기</button>
                                      </div>
                                      {diagSearchResults.filter((m) => m.category === "처방아이템").map((m) => (
                                        <button key={m.code} onClick={() => addPrescription(m)}
                                          className="w-full text-left py-1.5 text-xs text-gray-600 hover:text-blue-600 flex items-center gap-2">
                                          <Search size={11} className="text-gray-300 shrink-0" />
                                          <span className="text-gray-400 mr-1">{m.code}</span>
                                          <span><span className="text-blue-500 font-medium">{m.shortName}</span>{m.name.replace(m.shortName, "")}</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="px-4 py-4 text-center text-xs text-gray-400">검색 결과가 없습니다.</div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Disease search */}
                        <div ref={diseaseSearchRef} className="relative mb-3">
                          <input type="text" value={diseaseInput} onChange={(e) => setDiseaseInput(e.target.value)}
                            onFocus={() => setDiseaseSearchFocused(true)}
                            placeholder="주상병을 입력해주세요."
                            className="w-full border border-dashed border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none" />
                          {diseaseSearchFocused && diseaseInput.length >= 1 && diseaseSearchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-[200px] overflow-y-auto">
                              {diseaseSearchResults.map((d) => (
                                <button key={d.code} onClick={() => addDisease(d)}
                                  className="w-full text-left px-4 py-2 text-xs hover:bg-blue-50 transition-colors">
                                  <span className="text-blue-500 font-medium">{d.code}</span>
                                  <span className="text-gray-600 ml-2">{d.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Diagnosis list */}
                        <div className="space-y-1.5">
                          {selectedVisit.diagnoses.map((d, i) => (
                            <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 border border-gray-100">
                              <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-gray-300" />
                              <div className="flex-1">
                                {d.code && <span className="text-xs text-blue-500 mr-2">{d.code}</span>}
                                <span className="text-xs text-gray-700">{d.name}</span>
                                {d.type === "진찰료" && <span className="text-[10px] text-gray-400 ml-2">스마트진찰료</span>}
                              </div>
                            </div>
                          ))}

                          {/* Prescription list */}
                          {selectedVisit.prescriptions.map((rx) => (
                            <div key={rx.id}>
                              <div
                                onClick={() => setEditingPrescription(editingPrescription === rx.id ? null : rx.id)}
                                className={`flex items-center gap-3 py-2 px-3 rounded-lg cursor-pointer border transition-colors ${
                                  editingPrescription === rx.id ? "border-blue-300 bg-blue-50/50" : "border-gray-100 hover:bg-gray-50"
                                }`}
                              >
                                <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-gray-300" />
                                <div className="flex-1">
                                  <span className="text-xs text-blue-600 font-medium">{rx.shortName}</span>
                                  <span className="text-[11px] text-gray-400 ml-2">({rx.insuranceType}, {rx.price}원 x {rx.days}일 x {rx.qty}정)</span>
                                </div>
                                <span className="text-xs font-semibold text-gray-700">{(rx.price * rx.days * rx.qty).toLocaleString()}원</span>
                              </div>
                              {editingPrescription === rx.id && (
                                <PrescriptionPanel
                                  prescription={rx}
                                  onUpdate={updatePrescription}
                                  onDelete={() => deletePrescription(rx.id)}
                                  onClose={() => setEditingPrescription(null)}
                                />
                              )}
                            </div>
                          ))}

                          {/* Prescription documents */}
                          {selectedVisit.prescriptions.length > 0 && (
                            <>
                              <div className="flex items-center gap-3 py-2 px-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                                <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-gray-300" />
                                <span className="text-xs text-gray-500">처방전(원외보관함)</span>
                              </div>
                              <div className="flex items-center gap-3 py-2 px-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                                <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-gray-300" />
                                <span className="text-xs text-gray-500">처방전(약국제출용)</span>
                              </div>
                            </>
                          )}
                        </div>

                        {selectedVisit.prescriptions.length > 0 && (
                          <div className="flex justify-end pt-3">
                            <button className="text-[11px] px-3 py-1 text-blue-500 hover:underline">재산정</button>
                          </div>
                        )}
                      </div>

                      {/* 액션 */}
                      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs font-bold text-gray-800">액션</h3>
                          <button className="text-gray-400 hover:text-gray-600"><Settings size={14} /></button>
                        </div>
                        <div className="flex items-center gap-2 py-3 justify-center">
                          <Info size={14} className="text-gray-300" />
                          <p className="text-xs text-gray-400">추가할 수 있는 액션이 없습니다.</p>
                        </div>
                      </div>

                      {/* 수납내역 */}
                      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xs font-bold text-gray-800">수납내역</h3>
                          <button className="text-gray-400 hover:text-gray-600"><Settings size={14} /></button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-xs text-gray-600 font-medium">발생금액</span>
                            <span className="text-sm font-bold text-gray-900">{totalAmount.toLocaleString()}원</span>
                          </div>
                          <div className="flex items-center justify-between py-1">
                            <span className="text-[11px] text-gray-500">· 환자부담 총액</span>
                            <span className="text-[11px] text-gray-600">{totalAmount.toLocaleString()}원</span>
                          </div>
                          {selectedVisit.diagnoses.some((d) => d.type === "진찰료") && (
                            <div className="flex items-center justify-between py-1">
                              <span className="text-[11px] text-gray-400 ml-3">진찰료</span>
                              <span className="text-[11px] text-gray-500">3,700원</span>
                            </div>
                          )}
                          {selectedVisit.prescriptions.map((rx) => (
                            <div key={rx.id} className="flex items-center justify-between py-1">
                              <span className="text-[11px] text-gray-400 ml-3">{rx.shortName} ({rx.days}일 x {rx.qty}정)</span>
                              <span className="text-[11px] text-gray-500">{(rx.price * rx.days * rx.qty).toLocaleString()}원</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-gray-100 mt-3 pt-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 font-medium">수납금액</span>
                            <span className="text-xs text-gray-500">0원</span>
                          </div>
                          <button onClick={() => setShowPayment(true)} className="flex items-center gap-1 text-xs text-blue-500 hover:underline">
                            <Plus size={12} /> 수납 추가
                          </button>
                        </div>
                        <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between">
                          <span className="text-xs text-gray-600 font-medium">남은 금액</span>
                          <span className="text-sm font-bold text-red-500">{totalAmount.toLocaleString()}원</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="sticky bottom-0 flex items-center justify-between px-5 py-2.5 bg-white border-t border-gray-200 shrink-0">
                      <div className="flex items-center gap-2">
                        <button className="text-[11px] px-3 py-1.5 text-gray-500 hover:bg-gray-50 rounded-md">루틴</button>
                        <button className="text-[11px] px-3 py-1.5 text-gray-500 hover:bg-gray-50 rounded-md">···</button>
                      </div>
                      <div className="flex items-center gap-2">
                        <select className="text-[11px] border border-gray-200 rounded-md px-2 py-1 text-gray-500">
                          <option>대기</option><option>진료중</option><option>완료</option>
                        </select>
                        <button onClick={() => setShowPayment(true)}
                          className="px-4 py-1.5 text-[11px] bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                          수납 ›
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xs text-gray-400">내원이력을 선택해주세요.</p>
                  </div>
                )}
              </div>

              {/* Right column: 오더세트 + 환자기록 */}
              <div className="w-[220px] shrink-0 border-l border-gray-200 flex flex-col bg-white">
                <div className="flex-1 flex flex-col border-b border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-800">오더세트</span>
                      <span className="text-[11px] text-blue-500">피부질환으로</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600"><Settings size={14} /></button>
                  </div>
                  <div className="px-3 py-2">
                    <div className="relative">
                      <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="오더세트 검색" value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-[11px] focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto px-2">
                    {filteredOrders.map((order, i) => (
                      <button key={i} className="w-full text-left px-3 py-2 text-[12px] text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors flex items-center gap-2">
                        {order.starred && <Star size={11} className="text-amber-400 fill-amber-400" />}
                        {order.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-[280px] flex flex-col">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-800">환자기록</span>
                    <button className="text-gray-400 hover:text-gray-600"><Edit3 size={14} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 py-3">
                    {patientNotes.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <Info size={18} className="text-gray-200 mb-2" />
                        <p className="text-xs text-gray-400 font-medium">해당 환자의 기록이 없습니다.</p>
                        <p className="text-[11px] text-gray-300 mt-1">이곳에서 기록을 남기고 공유해 보세요.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {patientNotes.map((note, i) => (
                          <div key={i} className="bg-blue-50 rounded-lg px-3 py-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-semibold text-blue-600">{note.author}</span>
                              <span className="text-[10px] text-gray-400">{note.time}</span>
                            </div>
                            <p className="text-[11px] text-gray-600">{note.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-2.5 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <input type="text" value={noteText} onChange={(e) => setNoteText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendNote()}
                        placeholder="@태그 또는 메모 입력..."
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-[11px] text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400" />
                      <button onClick={handleSendNote} className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        <Send size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="p-4 rounded-2xl bg-gray-100 shadow-sm mb-4">
              <ClipboardList size={32} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400 font-medium">환자를 선택해주세요</p>
            <p className="text-[11px] text-gray-300 mt-1">좌측 목록에서 환자를 선택하면 상세 정보가 표시됩니다.</p>
          </div>
        )}
      </div>

      {/* Payment modal */}
      {showPayment && <PaymentModal amount={totalAmount} onClose={() => setShowPayment(false)} />}
    </div>
  );
}
