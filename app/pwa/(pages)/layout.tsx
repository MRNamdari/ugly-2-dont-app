"use client";
import React from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutTransition } from "@/app/_components/layout-transition";

const Calendar = dynamic(() => import("@/app/_components/calendar.modal"), {
  ssr: false,
});
const Clock = dynamic(() => import("@/app/_components/clock.modal"), {
  ssr: false,
});
const DeleteModal = dynamic(() => import("@/app/_components/delete.modal"), {
  ssr: false,
});
const AddModal = dynamic(() => import("@/app/_components/add.modal"), {
  ssr: false,
});
export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Calendar />
      <Clock />
      <DeleteModal />
      <AddModal />
      <LayoutTransition>
        <motion.main
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-dvh grid grid-rows-[5rem_1fr] max-w-screen-sm mx-auto"
        >
          {children}
        </motion.main>
      </LayoutTransition>
    </>
  );
}
