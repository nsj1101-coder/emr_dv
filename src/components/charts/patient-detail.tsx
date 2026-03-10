"use client";

import {
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
  Star,
  Search,
  Info,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

type PatientInfo = {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  patientNo?: string;
  ssn?: string;
  insurance?: string;
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

type ChartRecord = {
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

const sampleCharts: ChartRecord[] = [
  {
    id: "c1",
    date: "2024-05-17",
    dayOfWeek: "금",
    time: "15:56",
    doctor: "김의원",
    insurance: "건강보험",
    visitType: "재진",
    cc: "피부 발진 심함",
    bodyPart: "부위",
    symptoms: "피부 발진, 가려움",
    diagnoses: [
      { code: "L85.3", name: "피부건조증", type: "상병" },
      { code: "L29.9", name: "상세불명의 가려움", type: "상병" },
      { code: "", name: "재진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" },
    ],
    prescriptions: [],
    plan: "비급여+올돌스크리+피부연고 7:3,+1  |  알러 마태트로 조정",
  },
  {
    id: "c2",
    date: "2024-05-15",
    dayOfWeek: "수",
    time: "10:30",
    doctor: "김의원",
    insurance: "건강보험",
    visitType: "초진",
    cc: "피부 발진, 가려움증 - Onset: 3 days",
    bodyPart: "머리, 목, 얼굴",
    symptoms: "피부 발진, 가려움",
    diagnoses: [
      { code: "L29.9", name: "상세불명의 가려움", type: "상병" },
    ],
    prescriptions: [],
    plan: "",
  },
];

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
            <input
              type="text"
              defaultValue={amount.toLocaleString()}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-400 mb-1 block">결제수단 *</label>
            <div className="flex gap-2">
              {["카드", "현금", "할인금", "선납금"].map((m) => (
                <button
                  key={m}
                  onClick={() => setPayMethod(m)}
                  className={`flex-1 py-2 text-[11px] rounded-lg border transition-colors ${
                    payMethod === m ? "border-blue-400 bg-blue-50 text-blue-600 font-semibold" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] text-gray-400 mb-1 block">할부 선택 *</label>
            <select
              value={installment}
              onChange={(e) => setInstallment(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option>일시불</option>
              <option>2개월</option>
              <option>3개월</option>
              <option>6개월</option>
              <option>12개월</option>
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
  prescription,
  onUpdate,
  onDelete,
  onClose,
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

// ─── 메인 ───
export function PatientDetail({
  patient,
  onBack,
  roomName,
}: {
  patient: PatientInfo;
  onBack: () => void;
  roomName: string;
}) {
  const [charts, setCharts] = useState<ChartRecord[]>(sampleCharts);
  const [selectedChart, setSelectedChart] = useState<ChartRecord>(sampleCharts[0]);
  const [noteText, setNoteText] = useState("");
  const [patientNotes, setPatientNotes] = useState<{ text: string; time: string; author: string }[]>([]);
  const [orderSearch, setOrderSearch] = useState("");
  const [editingRecord, setEditingRecord] = useState(false);
  const [recordText, setRecordText] = useState(selectedChart.symptoms);

  // 진단 및 처방
  const [diagSearch, setDiagSearch] = useState("");
  const [diagSearchFocused, setDiagSearchFocused] = useState(false);
  const [activeSearchTab, setActiveSearchTab] = useState("전체(요약)");
  const [editingPrescription, setEditingPrescription] = useState<string | null>(null);
  const [diseaseInput, setDiseaseInput] = useState("");
  const [diseaseSearchFocused, setDiseaseSearchFocused] = useState(false);

  // 수납
  const [showPayment, setShowPayment] = useState(false);

  const diagSearchRef = useRef<HTMLDivElement>(null);
  const diseaseSearchRef = useRef<HTMLDivElement>(null);

  // 현재 차트의 총 금액 계산
  const totalAmount = selectedChart.prescriptions.reduce((sum, p) => sum + p.price * p.days * p.qty, 0)
    + (selectedChart.diagnoses.some((d) => d.type === "진찰료") ? 3700 : 0);

  // 외부 클릭 처리
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

  const handleNewChart = () => {
    const now = new Date();
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const newChart: ChartRecord = {
      id: `c${Date.now()}`,
      date: now.toISOString().split("T")[0],
      dayOfWeek: days[now.getDay()],
      time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
      doctor: "김의원",
      insurance: "건강보험",
      visitType: "재진",
      cc: "",
      bodyPart: "",
      symptoms: "",
      diagnoses: [{ code: "", name: "재진진찰료-의원,보건의료원등급 내 피료", type: "진찰료" }],
      prescriptions: [],
      plan: "",
    };
    const updated = [newChart, ...charts];
    setCharts(updated);
    setSelectedChart(newChart);
    setEditingRecord(true);
    setRecordText("");
  };

  const addPrescription = (med: typeof medicationDB[0]) => {
    const newRx: Prescription = {
      id: `rx${Date.now()}`,
      code: med.code,
      name: med.name,
      shortName: med.shortName,
      days: 1,
      times: 1,
      qty: 1,
      insuranceType: "비급여",
      price: med.price,
      taxable: med.taxable,
    };
    const updated = { ...selectedChart, prescriptions: [...selectedChart.prescriptions, newRx] };
    setSelectedChart(updated);
    setCharts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setDiagSearch("");
    setDiagSearchFocused(false);
    setEditingPrescription(newRx.id);
  };

  const addDisease = (d: typeof diseaseDB[0]) => {
    const newDiag: Diagnosis = { code: d.code, name: d.name, type: "상병" };
    const updated = { ...selectedChart, diagnoses: [...selectedChart.diagnoses, newDiag] };
    setSelectedChart(updated);
    setCharts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setDiseaseInput("");
    setDiseaseSearchFocused(false);
  };

  const updatePrescription = (p: Prescription) => {
    const updated = { ...selectedChart, prescriptions: selectedChart.prescriptions.map((rx) => (rx.id === p.id ? p : rx)) };
    setSelectedChart(updated);
    setCharts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const deletePrescription = (id: string) => {
    const updated = { ...selectedChart, prescriptions: selectedChart.prescriptions.filter((rx) => rx.id !== id) };
    setSelectedChart(updated);
    setCharts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setEditingPrescription(null);
  };

  const handleSendNote = () => {
    if (!noteText.trim()) return;
    const now = new Date();
    setPatientNotes((prev) => [...prev, {
      text: noteText,
      time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
      author: "김의원",
    }]);
    setNoteText("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* 상단 환자 정보 바 */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-b border-gray-200 shrink-0">
        <button onClick={onBack} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <span className="text-xs text-gray-400">no. {patient.patientNo || "1579190"}</span>
        <span className="text-sm font-bold text-gray-900">{patient.name}</span>
        <span className="text-xs text-gray-400">{patient.gender}, {patient.age}세</span>
        <span className="text-xs text-gray-400">({patient.ssn || "1989-01-01"})</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-medium">{patient.insurance || "건강보험"}</span>
        <span className="text-xs text-gray-400 ml-2">체온 36.5</span>
        <span className="text-xs text-blue-500 ml-2 cursor-pointer hover:underline">가족관계추가</span>
      </div>

      {/* 메인 3단 레이아웃 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 좌: 내원이력 */}
        <div className="w-[260px] shrink-0 bg-white border-r border-gray-200 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-800">내원이력</span>
            <button className="text-gray-400 hover:text-gray-600"><FileText size={14} /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {charts.map((chart) => (
              <button
                key={chart.id}
                onClick={() => { setSelectedChart(chart); setRecordText(chart.symptoms); setEditingRecord(false); setEditingPrescription(null); }}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors ${
                  selectedChart.id === chart.id ? "bg-blue-50 border-l-2 border-l-blue-500" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold ${selectedChart.id === chart.id ? "text-blue-600" : "text-gray-700"}`}>
                    {chart.date} ({chart.dayOfWeek})
                  </span>
                  {selectedChart.id === chart.id && <Check size={12} className="text-blue-500" />}
                </div>
                <p className="text-[11px] text-gray-400 mb-1">담당의: {chart.doctor}</p>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-600">{chart.insurance}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{chart.visitType}</span>
                </div>
                {chart.cc && (
                  <div className="text-[11px] text-gray-500 space-y-0.5">
                    <p>· {chart.cc}</p>
                    {chart.bodyPart && <p>· 부위: {chart.bodyPart}</p>}
                    <p>· 증상: {chart.symptoms}</p>
                  </div>
                )}
                {chart.diagnoses.filter((d) => d.type === "상병").length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 mb-1">진단/처방란</p>
                    {chart.diagnoses.filter((d) => d.type === "상병").map((d, i) => (
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
              <span>{charts.length}개 중 {charts.indexOf(selectedChart) + 1}</span>
              <button className="p-0.5 hover:text-gray-600"><ChevronLeft size={12} /></button>
              <button className="p-0.5 hover:text-gray-600"><ChevronRight size={12} /></button>
            </div>
          </div>
        </div>

        {/* 중: 진료 콘텐츠 */}
        <div className="flex-1 overflow-y-auto bg-[#F4F6FA]">
          {/* 날짜 헤더 */}
          <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-800">{selectedChart.date} ({selectedChart.dayOfWeek}) {selectedChart.time}</span>
              <span className="text-xs text-gray-400">진술: {selectedChart.doctor}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-[11px] px-2.5 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50">바코드</button>
              <button className="text-[11px] px-2.5 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50">PACS</button>
              <button className="text-[11px] px-2.5 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50">연결진료</button>
            </div>
          </div>

          <div className="p-5 space-y-4">
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
                    <p className="text-xs text-gray-600 mt-0.5">{selectedChart.bodyPart || "-"}</p>
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
                      <p className="text-xs text-gray-600 mt-0.5">{selectedChart.symptoms || "-"}</p>
                    )}
                  </div>
                  {selectedChart.plan && (
                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-[11px] text-gray-400">Plan:</span>
                      <p className="text-xs text-gray-600 mt-0.5">{selectedChart.plan}</p>
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

              {/* 약물 검색 */}
              <div ref={diagSearchRef} className="relative mb-3">
                <input
                  type="text"
                  value={diagSearch}
                  onChange={(e) => setDiagSearch(e.target.value)}
                  onFocus={() => setDiagSearchFocused(true)}
                  placeholder="약물/처방 검색 (예: 타이레놀)"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                {diagSearchFocused && diagSearch.length >= 1 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-[320px] overflow-y-auto">
                    {/* 탭 */}
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
                        {/* 오더 그룹 */}
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
                        {/* 처방아이템 그룹 */}
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

              {/* 주상병 입력 */}
              <div ref={diseaseSearchRef} className="relative mb-3">
                <input
                  type="text"
                  value={diseaseInput}
                  onChange={(e) => setDiseaseInput(e.target.value)}
                  onFocus={() => setDiseaseSearchFocused(true)}
                  placeholder="주상병을 입력해주세요."
                  className="w-full border border-dashed border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none"
                />
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

              {/* 진단 목록 */}
              <div className="space-y-1.5">
                {selectedChart.diagnoses.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 border border-gray-100">
                    <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded border-gray-300" />
                    <div className="flex-1">
                      {d.code && <span className="text-xs text-blue-500 mr-2">{d.code}</span>}
                      <span className="text-xs text-gray-700">{d.name}</span>
                      {d.type === "진찰료" && <span className="text-[10px] text-gray-400 ml-2">스마트진찰료</span>}
                    </div>
                  </div>
                ))}

                {/* 처방 목록 */}
                {selectedChart.prescriptions.map((rx) => (
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
                        <span className="text-[11px] text-gray-400 ml-2">({rx.insuranceType}, {rx.price}원 × {rx.days}일 × {rx.qty}정)</span>
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

                {/* 처방전 항목 */}
                {selectedChart.prescriptions.length > 0 && (
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

              {selectedChart.prescriptions.length > 0 && (
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
                {selectedChart.diagnoses.some((d) => d.type === "진찰료") && (
                  <div className="flex items-center justify-between py-1">
                    <span className="text-[11px] text-gray-400 ml-3">진찰료</span>
                    <span className="text-[11px] text-gray-500">3,700원</span>
                  </div>
                )}
                {selectedChart.prescriptions.map((rx) => (
                  <div key={rx.id} className="flex items-center justify-between py-1">
                    <span className="text-[11px] text-gray-400 ml-3">{rx.shortName} ({rx.days}일 × {rx.qty}정)</span>
                    <span className="text-[11px] text-gray-500">{(rx.price * rx.days * rx.qty).toLocaleString()}원</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 mt-3 pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">수납금액</span>
                  <span className="text-xs text-gray-500">0원</span>
                </div>
                <button
                  onClick={() => setShowPayment(true)}
                  className="flex items-center gap-1 text-xs text-blue-500 hover:underline"
                >
                  <Plus size={12} /> 수납 추가
                </button>
              </div>

              <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between">
                <span className="text-xs text-gray-600 font-medium">남은 금액</span>
                <span className="text-sm font-bold text-red-500">{totalAmount.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          {/* 하단 바 */}
          <div className="sticky bottom-0 flex items-center justify-between px-5 py-2.5 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <button className="text-[11px] px-3 py-1.5 text-gray-500 hover:bg-gray-50 rounded-md">루틴</button>
              <button className="text-[11px] px-3 py-1.5 text-gray-500 hover:bg-gray-50 rounded-md">···</button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{roomName}</span>
              <select className="text-[11px] border border-gray-200 rounded-md px-2 py-1 text-gray-500">
                <option>대기</option><option>진료중</option><option>완료</option>
              </select>
              <button onClick={() => setShowPayment(true)}
                className="px-4 py-1.5 text-[11px] bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                수납 ›
              </button>
            </div>
          </div>
        </div>

        {/* 우: 오더세트 + 환자기록 */}
        <div className="w-[240px] shrink-0 border-l border-gray-200 flex flex-col bg-white">
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

      {/* 수납 추가 팝업 */}
      {showPayment && <PaymentModal amount={totalAmount} onClose={() => setShowPayment(false)} />}
    </div>
  );
}
