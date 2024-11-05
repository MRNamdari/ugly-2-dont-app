"use client";
import React from "react";
import { LayoutTransition } from "@/app/_components/layout-transition";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutTransition>{children}</LayoutTransition>;
}
