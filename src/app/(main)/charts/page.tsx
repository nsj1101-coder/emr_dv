"use client";

import { Search, UserPlus, ChevronDown, ChevronRight, X, GripVertical } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { PatientDetail } from "@/components/charts/patient-detail";

type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  status: "대기" | "진료" | "수납";
};

type SearchPatient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  patientNo: string;
  ssn: string;
  lastVisit: string;
  phone: string;
  insurance: string;
};

type Room = {
  id: string;
  name: string;
  patients: Patient[];
};

const initialRooms: Room[] = [
  {
    id: "1",
    name: "1. 접수데스크",
    patients: [
      { id: "p1", name: "장취음", age: 34, gender: "남", location: "서울", status: "대기" },
    ],
  },
  {
    id: "2",
    name: "2. 진료실",
    patients: [
      { id: "p2", name: "배근웅", age: 28, gender: "남", location: "성남", status: "대기" },
    ],
  },
  {
    id: "3",
    name: "3. 수술실",
    patients: [],
  },
  {
    id: "4",
    name: "4. 물리치료실",
    patients: [],
  },
  {
    id: "5",
    name: "5. 도수치료실",
    patients: [],
  },
  {
    id: "6",
    name: "6. 수납",
    patients: [
      { id: "p3", name: "김한미", age: 34, gender: "남", location: "서울", status: "대기" },
    ],
  },
];

const searchablePatients: SearchPatient[] = [
  { id: "s1", name: "김위버", age: 35, gender: "남", patientNo: "1579190", ssn: "890101-1••••••", lastVisit: "오늘 15:54", phone: "010-1234-5678", insurance: "건강보험" },
  { id: "s2", name: "김위성", age: 42, gender: "남", patientNo: "1579201", ssn: "820315-1••••••", lastVisit: "2024-03-10", phone: "010-2345-6789", insurance: "건강보험" },
  { id: "s3", name: "김민수", age: 28, gender: "남", patientNo: "1580102", ssn: "960520-1••••••", lastVisit: "2024-03-08", phone: "010-3456-7890", insurance: "건강보험" },
  { id: "s4", name: "박영희", age: 55, gender: "여", patientNo: "1575030", ssn: "690812-2••••••", lastVisit: "2024-03-12", phone: "010-4567-8901", insurance: "건강보험" },
  { id: "s5", name: "이지은", age: 31, gender: "여", patientNo: "1582210", ssn: "930225-2••••••", lastVisit: "2024-03-14", phone: "010-5678-9012", insurance: "건강보험" },
];

// ─── 접수 팝업 ───
function ReceptionModal({
  patient,
  onClose,
}: {
  patient: SearchPatient;
  onClose: () => void;
}) {
  const [activePopupTab, setActivePopupTab] = useState<"접수" | "예약">("접수");
  const [doctor, setDoctor] = useState("김의사");
  const [room, setRoom] = useState("1. 접수데스크");
  const [memo, setMemo] = useState("");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[680px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-gray-800">접수정보</h2>
            <div className="flex gap-1">
              {(["접수", "예약"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivePopupTab(tab)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    activePopupTab === tab ? "bg-blue-500 text-white" : "text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-base font-bold text-gray-900">{patient.name}</span>
            <span className="text-xs text-gray-400">{patient.gender}, {patient.age}세</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>no. {patient.patientNo}</span>
            <span>{patient.ssn}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-medium">{patient.insurance}</span>
          </div>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-3">진료정보</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-gray-400 mb-1 block">담당의</label>
                <select value={doctor} onChange={(e) => setDoctor(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400">
                  <option>김의사</option><option>박의사</option><option>이의사</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-gray-400 mb-1 block">진료실</label>
                <select value={room} onChange={(e) => setRoom(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400">
                  <option>1. 접수데스크</option><option>2. 진료실</option><option>3. 수술실</option><option>4. 물리치료실</option><option>5. 도수치료실</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-3">보험정보</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-gray-400 mb-1 block">보험 유형</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400">
                  <option>건강보험</option><option>의료급여 1종</option><option>의료급여 2종</option><option>산재보험</option><option>자동차보험</option><option>비급여</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-gray-400 mb-1 block">초/재진</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400">
                  <option>재진</option><option>초진</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-3">접수메모</p>
            <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="접수 메모를 입력하세요" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 h-20 resize-none focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">취소</button>
          <button onClick={onClose} className="px-5 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">접수</button>
        </div>
      </div>
    </div>
  );
}

// ─── 신규환자 등록 팝업 ───
function NewPatientModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    gender: "남",
    birth: "",
    phone: "",
    ssn1: "",
    ssn2: "",
    address: "",
    insurance: "건강보험",
    memo: "",
  });

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[580px] max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-800">신규환자 등록</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* 폼 */}
        <div className="px-6 py-5 space-y-5">
          {/* 기본 정보 */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-3">기본 정보</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-gray-400 mb-1 block">이름 *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="환자 이름"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 mb-1 block">성별 *</label>
                <div className="flex gap-2">
                  {["남", "여"].map((g) => (
                    <button
                      key={g}
                      onClick={() => update("gender", g)}
                      className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${
                        form.gender === g
                          ? "border-blue-400 bg-blue-50 text-blue-600 font-semibold"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 주민등록번호 */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-3">주민등록번호</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={form.ssn1}
                onChange={(e) => update("ssn1", e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="생년월일 6자리"
                maxLength={6}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <span className="text-gray-300">-</span>
              <input
                type="password"
                value={form.ssn2}
                onChange={(e) => update("ssn2", e.target.value.replace(/\D/g, "").slice(0, 7))}
                placeholder="•••••••"
                maxLength={7}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* 연락처 */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-3">연락처</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-gray-400 mb-1 block">휴대전화 *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 mb-1 block">주소</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="주소 입력"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          {/* 보험 */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-3">보험정보</p>
            <select
              value={form.insurance}
              onChange={(e) => update("insurance", e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              <option>건강보험</option><option>의료급여 1종</option><option>의료급여 2종</option><option>산재보험</option><option>자동차보험</option><option>비급여</option>
            </select>
          </div>

          {/* 메모 */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-3">메모</p>
            <textarea
              value={form.memo}
              onChange={(e) => update("memo", e.target.value)}
              placeholder="환자 관련 메모"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 h-16 resize-none focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* 하단 */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">취소</button>
          <button onClick={onClose} className="px-5 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">등록</button>
        </div>
      </div>
    </div>
  );
}

// ─── 메인 ───
export default function ChartsPage() {
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState<"대기" | "예약" | "방문">("대기");
  const [roomList, setRoomList] = useState<Room[]>(initialRooms);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(initialRooms[0].patients[0]);
  const [expandedRooms, setExpandedRooms] = useState<Record<string, boolean>>(
    Object.fromEntries(initialRooms.map((r) => [r.id, true]))
  );

  // 드래그앤드롭
  const [dragPatient, setDragPatient] = useState<{ patient: Patient; fromRoomId: string } | null>(null);
  const [dropTargetRoomId, setDropTargetRoomId] = useState<string | null>(null);

  // 우클릭 컨텍스트 메뉴
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; patient: SearchPatient } | null>(null);
  // 접수 팝업
  const [receptionPatient, setReceptionPatient] = useState<SearchPatient | null>(null);
  // 신규환자 팝업
  const [showNewPatient, setShowNewPatient] = useState(false);
  // 진료 상세 화면
  const [detailPatient, setDetailPatient] = useState<Patient | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);

  const tabCounts = {
    대기: roomList.reduce((acc, r) => acc + r.patients.length, 0),
    예약: 0,
    방문: 1,
  };

  // 검색 결과
  const searchResults = search.length >= 1
    ? searchablePatients.filter((p) =>
        p.name.includes(search) || p.patientNo.includes(search) || p.phone.includes(search)
      )
    : [];
  const showSearchDropdown = searchFocused && search.length >= 1;

  // 외부 클릭 핸들러
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    function handleClick() { setContextMenu(null); }
    if (contextMenu) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [contextMenu]);

  const toggleRoom = (id: string) => {
    setExpandedRooms((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleContextMenu = (e: React.MouseEvent, patient: SearchPatient) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, patient });
  };

  // ─── 드래그앤드롭 핸들러 ───
  const handleDragStart = useCallback((patient: Patient, roomId: string) => {
    setDragPatient({ patient, fromRoomId: roomId });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, roomId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTargetRoomId(roomId);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDropTargetRoomId(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, toRoomId: string) => {
    e.preventDefault();
    setDropTargetRoomId(null);

    if (!dragPatient || dragPatient.fromRoomId === toRoomId) {
      setDragPatient(null);
      return;
    }

    setRoomList((prev) =>
      prev.map((room) => {
        if (room.id === dragPatient.fromRoomId) {
          return { ...room, patients: room.patients.filter((p) => p.id !== dragPatient.patient.id) };
        }
        if (room.id === toRoomId) {
          return { ...room, patients: [...room.patients, dragPatient.patient] };
        }
        return room;
      })
    );

    setDragPatient(null);
  }, [dragPatient]);

  const handleDragEnd = useCallback(() => {
    setDragPatient(null);
    setDropTargetRoomId(null);
  }, []);

  return (
    <div className="flex h-screen bg-[#F4F6FA]">
      {/* 환자리스트 패널 */}
      <div className="w-[240px] shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-bold text-gray-800">환자리스트</span>
          <button className="text-gray-400 hover:text-gray-600 text-xs">»</button>
        </div>

        <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-100">
          {(["대기", "예약", "방문"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                activeTab === tab ? "font-bold text-blue-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab} {tabCounts[tab]}
            </button>
          ))}
          <div className="ml-auto">
            <select className="text-[11px] text-gray-400 border border-gray-200 rounded px-1 py-0.5">
              <option>6개 선택됨</option>
            </select>
          </div>
        </div>

        {/* 방/구역별 환자 목록 (드래그앤드롭) */}
        <div className="flex-1 overflow-y-auto">
          {roomList.map((room) => (
            <div
              key={room.id}
              className={`border-b border-gray-50 transition-colors ${
                dropTargetRoomId === room.id ? "bg-blue-50/70" : ""
              }`}
              onDragOver={(e) => handleDragOver(e, room.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, room.id)}
            >
              <button
                onClick={() => toggleRoom(room.id)}
                className="flex items-center justify-between w-full px-4 py-2.5 hover:bg-gray-50 transition-colors"
              >
                <span className="text-xs font-semibold text-gray-700">{room.name}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-gray-400">{room.patients.length}</span>
                  {expandedRooms[room.id] ? (
                    <ChevronDown size={14} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={14} className="text-gray-400" />
                  )}
                </div>
              </button>
              {expandedRooms[room.id] && (
                <div className="pb-1">
                  {room.patients.length === 0 ? (
                    <p className="px-4 py-2 text-[11px] text-gray-300">
                      {dropTargetRoomId === room.id ? "여기에 놓으세요" : "대기 환자가 없습니다."}
                    </p>
                  ) : (
                    room.patients.map((patient) => (
                      <div
                        key={patient.id}
                        draggable
                        onDragStart={() => handleDragStart(patient, room.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => setSelectedPatient(patient)}
                        className={`w-full text-left px-4 py-2 transition-colors cursor-grab active:cursor-grabbing flex items-center gap-2 ${
                          selectedPatient?.id === patient.id ? "bg-blue-50" : "hover:bg-gray-50"
                        } ${dragPatient?.patient.id === patient.id ? "opacity-40" : ""}`}
                      >
                        <GripVertical size={12} className="text-gray-300 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-800">
                              {patient.name}
                              {selectedPatient?.id === patient.id && <span className="text-blue-500">*</span>}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-600 font-medium">
                              {patient.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {patient.gender} {patient.age}세 · {patient.location}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {detailPatient ? (
          /* 진료 상세 화면 */
          <PatientDetail
            patient={{
              ...detailPatient,
              patientNo: "1579190",
              ssn: "1989-01-01",
              insurance: "건강보험",
            }}
            onBack={() => setDetailPatient(null)}
            roomName={roomList.find((r) => r.patients.some((p) => p.id === detailPatient.id))?.name || "1. 접수데스크"}
          />
        ) : (
          <>
            {/* 상단 바 */}
            <div className="flex items-center gap-4 px-6 py-3 bg-white border-b border-gray-200">
              <h1 className="text-sm font-bold text-gray-800 shrink-0">차트</h1>

              <div ref={searchRef} className="relative flex-1 max-w-md">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                <input
                  type="text"
                  placeholder="환자 검색"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-9 pr-8 text-xs focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                {search && (
                  <button
                    onClick={() => { setSearch(""); setSearchFocused(false); }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                  >
                    <X size={14} />
                  </button>
                )}

                {showSearchDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                    {searchResults.length > 0 ? (
                      <div>
                        {searchResults.map((p) => (
                          <div
                            key={p.id}
                            onContextMenu={(e) => handleContextMenu(e, p)}
                            className="px-4 py-3 hover:bg-blue-50/50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-baseline gap-2">
                                <span className="text-sm font-semibold text-blue-600">{p.name}</span>
                                <span className="text-xs text-gray-400">{p.gender}, {p.age}세</span>
                              </div>
                              <span className="text-[11px] text-gray-400">최근방문 {p.lastVisit}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-gray-400">
                              <span>no. {p.patientNo}</span>
                              <span>{p.ssn}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-5 py-5">
                        <p className="text-xs font-semibold text-gray-600 mb-3">검색 결과</p>
                        <div className="flex items-start gap-2 mb-3">
                          <Search size={14} className="text-gray-300 mt-0.5 shrink-0" />
                          <p className="text-xs text-gray-400">아래 검색 규칙을 참고해서 환자를 검색해보세요.</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg px-4 py-3 mb-4">
                          <div className="flex items-start gap-2 mb-2">
                            <span className="text-gray-300 text-xs mt-0.5">ⓘ</span>
                            <p className="text-[11px] text-gray-400">아래를 참고해서 검색해도 환자가 없다면, 신규환자로 등록해주세요.</p>
                          </div>
                          <p className="text-[11px] text-gray-500 ml-5">등록환자는 이름, 전화번호, 생년월일(6자리), 환자번호로 검색할 수 있습니다.</p>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => { setShowNewPatient(true); setSearchFocused(false); }}
                            className="px-4 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            신규환자
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowNewPatient(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <UserPlus size={15} />
                신규환자
              </button>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="flex-1 overflow-y-auto p-8">
              {selectedPatient && (
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-blue-500 mb-2">
                      <span>
                        {roomList.find((r) => r.patients.some((p) => p.id === selectedPatient.id))?.name || "1. 접수데스크"}
                      </span>
                      <span className="text-gray-300">›</span>
                      <span className="text-gray-400">다음 환자 부르기</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <h2 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h2>
                      <span className="text-sm text-gray-400">{selectedPatient.gender}, {selectedPatient.age}세</span>
                    </div>
                    <div className="flex items-center gap-2 mb-5">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 font-medium">건강보험</span>
                      <span className="text-xs text-gray-400">{selectedPatient.location}</span>
                      <span className="text-xs text-gray-400">· 전화번</span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-4 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">자료열기</button>
                      <button
                        onClick={() => setDetailPatient(selectedPatient)}
                        className="px-4 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        진행하기
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <p className="text-xs text-gray-400 mb-2">신규환자</p>
                      <p className="text-sm text-gray-700 mb-6">신규환자를 등록하시겠습니까?</p>
                      <div className="flex justify-center">
                        <button
                          onClick={() => setShowNewPatient(true)}
                          className="px-5 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          신규환자
                        </button>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-xs text-gray-400">접수신청</p>
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white font-bold">0</span>
                      </div>
                      <p className="text-sm text-gray-400">접수 신청 건이 없습니다.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 우클릭 컨텍스트 메뉴 */}
      {contextMenu && (
        <div
          className="fixed z-[90] bg-white rounded-xl shadow-lg border border-gray-200 py-1 min-w-[120px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button onClick={() => setContextMenu(null)} className="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors">예약하기</button>
          <button
            onClick={() => { setReceptionPatient(contextMenu.patient); setContextMenu(null); setSearchFocused(false); }}
            className="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors font-semibold"
          >접수하기</button>
          <button onClick={() => setContextMenu(null)} className="w-full text-left px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors">환자정보</button>
        </div>
      )}

      {/* 접수 팝업 */}
      {receptionPatient && <ReceptionModal patient={receptionPatient} onClose={() => setReceptionPatient(null)} />}

      {/* 신규환자 팝업 */}
      {showNewPatient && <NewPatientModal onClose={() => setShowNewPatient(false)} />}
    </div>
  );
}
