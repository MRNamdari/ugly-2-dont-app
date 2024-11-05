import { AnimatePresence } from "framer-motion";
import React from "react";
import { LayoutTransition } from "../_components/layout-transition";

export default function PWARootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
