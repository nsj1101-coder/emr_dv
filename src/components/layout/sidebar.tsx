"use client";

import { cn } from "@/lib/utils";
import {
  Bell,
  Home,
  FileText,
  Users,
  TestTubes,
  CalendarCheck,
  BarChart3,
  MessageSquare,
  PenTool,
  Receipt,
  Pill,
  BookOpen,
  Shield,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

type SubMenuItem = {
  href: string;
  label: string;
  badge?: string;
};

type MenuItem = {
  href: string;
  label: string;
  icon: typeof Bell;
  subItems?: SubMenuItem[];
};

const menuItems: MenuItem[] = [
  { href: "/notifications", label: "알림", icon: Bell },
  { href: "/dashboard", label: "홈", icon: Home },
  { href: "/charts", label: "차트", icon: FileText },
  { href: "/patients", label: "환자", icon: Users },
  { href: "/lab", label: "검사", icon: TestTubes },
  { href: "/appointments", label: "예약", icon: CalendarCheck },
  {
    href: "/statistics",
    label: "통계",
    icon: BarChart3,
    subItems: [
      { href: "/statistics/revenue", label: "매출" },
      { href: "/statistics/payments", label: "수납" },
      { href: "/statistics/medical", label: "진료", badge: "준비중" },
    ],
  },
  { href: "/crm", label: "CRM", icon: MessageSquare },
  { href: "/e-sign", label: "전자서명", icon: PenTool },
  { href: "/billing", label: "청구", icon: Receipt },
  { href: "/narcotics", label: "마약류", icon: Pill },
  { href: "/library", label: "라이브러리", icon: BookOpen },
  { href: "/admin", label: "관리", icon: Shield },
  { href: "/settings", label: "설정", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  // Auto-expand submenu when path matches
  useEffect(() => {
    for (const item of menuItems) {
      if (item.subItems && pathname.startsWith(item.href)) {
        setExpandedMenu(item.href);
        break;
      }
    }
  }, [pathname]);

  const handleMenuClick = (item: MenuItem, e: React.MouseEvent) => {
    if (item.subItems && !collapsed) {
      e.preventDefault();
      setExpandedMenu(expandedMenu === item.href ? null : item.href);
    }
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-[#FAFBFD] border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[220px]"
      )}
    >
      {/* Logo + Collapse */}
      <div className="flex h-14 items-center justify-between border-b border-gray-100 px-4">
        {!collapsed && (
          <span className="text-sm font-bold text-gray-800 tracking-tight">Medical Bookings</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {menuItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const isExpanded = expandedMenu === item.href;
          const hasSubItems = item.subItems && item.subItems.length > 0;

          return (
            <div key={item.href}>
              <Link
                href={hasSubItems && !collapsed ? "#" : item.href}
                onClick={(e) => handleMenuClick(item, e)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150",
                  collapsed && "justify-center px-2",
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                )}
              >
                <item.icon size={18} className={cn(isActive ? "text-blue-600" : "text-gray-500")} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {hasSubItems && (
                      isExpanded
                        ? <ChevronUp size={14} className="text-gray-400" />
                        : <ChevronDown size={14} className="text-gray-400" />
                    )}
                  </>
                )}
              </Link>

              {/* Sub-items */}
              {hasSubItems && isExpanded && !collapsed && (
                <div className="ml-7 mt-0.5 space-y-0.5">
                  {item.subItems!.map((sub) => {
                    const isSubActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all duration-150",
                          isSubActive
                            ? "text-blue-600 font-semibold"
                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <span>{sub.label}</span>
                        {sub.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 font-medium">
                            {sub.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
