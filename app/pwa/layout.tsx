import React from "react";
import AddCategoryModal from "../_components/addCategory.modal";
import CalendarModal from "../_components/calendar.modal";
import ClockModal from "../_components/clock.modal";

export default function PWARootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClockModal>
      <CalendarModal>
        <AddCategoryModal>{children}</AddCategoryModal>
      </CalendarModal>
    </ClockModal>
  );
}
