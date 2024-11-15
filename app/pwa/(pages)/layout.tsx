"use client";
import React from "react";
import { motion } from "framer-motion";
import { LayoutTransition } from "@/app/_components/layout-transition";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LayoutTransition>
        <motion.main
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto grid h-dvh max-w-screen-sm grid-rows-[5rem_1fr] transition-all duration-300 peer-open:pt-20"
        >
          {children}
        </motion.main>
      </LayoutTransition>
    </>
  );
}
