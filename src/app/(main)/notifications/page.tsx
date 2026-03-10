"use client";

import { useState } from "react";
import {
  Bell,
  Monitor,
  Calendar,
  Stethoscope,
  CreditCard,
  X,
  CheckCheck,
} from "lucide-react";

type NotificationType = "시스템" | "예약" | "진료" | "수납";
type FilterType = "전체" | NotificationType;

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  timeAgo: string;
  isRead: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "시스템",
    title: "시스템 점검 안내",
    description:
      "3월 15일(토) 02:00~06:00 서버 점검이 예정되어 있습니다. 해당 시간 동안 서비스 이용이 제한될 수 있습니다.",
    timeAgo: "5분 전",
    isRead: false,
  },
  {
    id: 2,
    type: "예약",
    title: "신규 예약 등록",
    description:
      "김민수 환자가 3월 12일 오전 10:30 내과 진료를 예약하였습니다.",
    timeAgo: "12분 전",
    isRead: false,
  },
  {
    id: 3,
    type: "진료",
    title: "검사 결과 도착",
    description:
      "박영희 환자의 혈액검사(CBC) 결과가 도착하였습니다. 일부 수치가 정상 범위를 벗어났습니다.",
    timeAgo: "30분 전",
    isRead: false,
  },
  {
    id: 4,
    type: "수납",
    title: "수납 완료",
    description:
      "이정호 환자의 진료비 45,000원 수납이 완료되었습니다. (카드결제)",
    timeAgo: "1시간 전",
    isRead: false,
  },
  {
    id: 5,
    type: "예약",
    title: "예약 취소",
    description:
      "최수진 환자가 3월 11일 오후 2:00 피부과 예약을 취소하였습니다.",
    timeAgo: "1시간 전",
    isRead: true,
  },
  {
    id: 6,
    type: "진료",
    title: "처방전 확인 필요",
    description:
      "강태영 환자의 처방전에 약물 상호작용 경고가 발생하였습니다. 확인이 필요합니다.",
    timeAgo: "2시간 전",
    isRead: false,
  },
  {
    id: 7,
    type: "시스템",
    title: "소프트웨어 업데이트 완료",
    description:
      "EMR 시스템 v2.4.1 업데이트가 완료되었습니다. 새로운 기능: 전자처방전 개선, 차트 검색 속도 향상.",
    timeAgo: "3시간 전",
    isRead: true,
  },
  {
    id: 8,
    type: "수납",
    title: "미수납 알림",
    description:
      "정은지 환자의 진료비 120,000원이 미수납 상태입니다. 3일이 경과하였습니다.",
    timeAgo: "4시간 전",
    isRead: true,
  },
  {
    id: 9,
    type: "예약",
    title: "내일 예약 리마인더",
    description:
      "내일(3월 11일) 총 18건의 예약이 있습니다. 오전 9건, 오후 9건.",
    timeAgo: "5시간 전",
    isRead: true,
  },
  {
    id: 10,
    type: "진료",
    title: "영상검사 결과 등록",
    description:
      "한지민 환자의 X-ray(흉부) 영상 결과가 등록되었습니다.",
    timeAgo: "어제",
    isRead: true,
  },
  {
    id: 11,
    type: "수납",
    title: "보험 청구 반려",
    description:
      "오승훈 환자의 건강보험 청구건이 반려되었습니다. 사유: 서류 미비. 재청구가 필요합니다.",
    timeAgo: "어제",
    isRead: true,
  },
  {
    id: 12,
    type: "시스템",
    title: "데이터 백업 완료",
    description:
      "3월 9일 정기 데이터 백업이 정상적으로 완료되었습니다. 백업 용량: 2.4GB.",
    timeAgo: "어제",
    isRead: true,
  },
];

const typeConfig: Record<
  NotificationType,
  { icon: typeof Bell; bgColor: string; textColor: string; borderColor: string }
> = {
  시스템: {
    icon: Monitor,
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
    borderColor: "border-blue-600",
  },
  예약: {
    icon: Calendar,
    bgColor: "bg-green-100",
    textColor: "text-green-600",
    borderColor: "border-green-600",
  },
  진료: {
    icon: Stethoscope,
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
    borderColor: "border-purple-600",
  },
  수납: {
    icon: CreditCard,
    bgColor: "bg-orange-100",
    textColor: "text-orange-600",
    borderColor: "border-orange-600",
  },
};

const filterTabs: FilterType[] = ["전체", "시스템", "예약", "진료", "수납"];

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("전체");
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications =
    activeFilter === "전체"
      ? notifications
      : notifications.filter((n) => n.type === activeFilter);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  return (
    <div className="h-screen flex flex-col bg-[#F4F6FA]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[15px] font-semibold text-gray-900">알림</h1>
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            모두 읽음
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1">
          {filterTabs.map((tab) => {
            const count =
              tab === "전체"
                ? notifications.length
                : notifications.filter((n) => n.type === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeFilter === tab
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {tab}
                <span
                  className={`ml-1 text-[11px] ${
                    activeFilter === tab ? "text-blue-100" : "text-gray-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="flex flex-col gap-2">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Bell className="w-10 h-10 mb-3 text-gray-300" />
              <p className="text-sm">알림이 없습니다</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const config = typeConfig[notification.type];
              const Icon = config.icon;
              return (
                <div
                  key={notification.id}
                  onClick={() => toggleRead(notification.id)}
                  className={`group bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    !notification.isRead
                      ? "bg-blue-50/60 border-l-2 border-l-blue-600"
                      : ""
                  }`}
                >
                  {/* Type Icon */}
                  <div
                    className={`w-8 h-8 rounded-2xl shadow-sm ${config.bgColor} flex items-center justify-center flex-shrink-0 mt-0.5`}
                  >
                    <Icon className={`w-4 h-4 ${config.textColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${config.bgColor} ${config.textColor}`}
                        >
                          {notification.type}
                        </span>
                        <h3
                          className={`text-[13px] ${
                            !notification.isRead
                              ? "font-semibold text-gray-900"
                              : "font-medium text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[11px] text-gray-400">
                          {notification.timeAgo}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-100 transition-all"
                        >
                          <X className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
                      {notification.description}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="flex justify-center mt-4 mb-6">
            <button className="px-5 py-2 text-xs font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors">
              더 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
