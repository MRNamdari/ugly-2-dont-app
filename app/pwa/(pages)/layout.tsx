"use client";
import Calendar from "@/app/_components/calendar.modal";
import React from "react";
import { modals } from "@/app/_store/state";
import Clock from "@/app/_components/clock.modal";
export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-dvh w-full grid grid-rows-[3rem_1fr] pt-4 max-w-screen-sm mx-auto">
      <Calendar />
      <Clock />
      {children}
    </main>
  );
}
