// app/components/ClientLayoutWrapper.tsx
'use client';

import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/sonner";

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const Sidebar = dynamic(() => import("@/components/Sidebar"), { ssr: false });

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex h-[calc(100vh-64px)] md:px-4">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 p-4 bg-gray-100 overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </div>
      <Toaster position="top-center" />
    </>
  );
}
