"use client";

import { AnimatePresence } from "framer-motion";
import { useSelectedLayoutSegment } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useContext, useEffect, useRef } from "react";

function usePreviousValue<T>(value: T): T | undefined {
  const prevValue = useRef<T>();

  useEffect(() => {
    prevValue.current = value;
    return () => {
      prevValue.current = undefined;
    };
  });

  return prevValue.current;
}

function FrozenRouter(props: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const prevContext = usePreviousValue(context) || null;

  const segment = useSelectedLayoutSegment();
  const prevSegment = usePreviousValue(segment);

  const changed =
    segment !== prevSegment &&
    segment !== undefined &&
    prevSegment !== undefined;
  return (
    <LayoutRouterContext.Provider value={changed ? prevContext : context}>
      {props.children}
    </LayoutRouterContext.Provider>
  );
}

interface LayoutTransitionProps {
  children: React.ReactNode;
  segment?: string | null;
}

export function LayoutTransition({
  children,
  segment = useSelectedLayoutSegment(),
}: LayoutTransitionProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <FrozenRouter key={segment}>{children}</FrozenRouter>
    </AnimatePresence>
  );
}
