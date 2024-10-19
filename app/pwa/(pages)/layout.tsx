import React from "react";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-dvh w-full grid grid-rows-[3rem_1fr] px-6 pt-6 max-w-screen-sm mx-auto">
      {children}
    </main>
  );
}
