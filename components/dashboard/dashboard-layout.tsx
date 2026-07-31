"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopHeader } from "@/components/dashboard/top-header";

export function DashboardLayout({
  children,
  userName,
  userEmail,
  avatarUrl,
  role,
}: {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  role: "worker" | "employer";
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        role={role}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopHeader
          userName={userName}
          userEmail={userEmail}
          avatarUrl={avatarUrl}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="min-h-0 flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
