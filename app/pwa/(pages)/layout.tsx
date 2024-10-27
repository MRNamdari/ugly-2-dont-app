"use client";
import React from "react";
import dynamic from "next/dynamic";
const Calendar = dynamic(() => import("@/app/_components/calendar.modal"), {
  ssr: false,
});
const Clock = dynamic(() => import("@/app/_components/clock.modal"), {
  ssr: false,
});
export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-dvh grid grid-rows-[5rem_1fr] max-w-screen-sm mx-auto">
      <Calendar />
      <Clock />
      {children}
    </main>
  );
}
