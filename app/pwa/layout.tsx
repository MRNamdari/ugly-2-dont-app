"use client";
import React from "react";
import AddCategoryModal from "../_components/addEditCategory.modal";
import CalendarModal from "../_components/calendar.modal";
import ClockModal from "../_components/clock.modal";
import DeleteModal from "../_components/delete.modal";
import AddModal from "../_components/add.modal";
import SelectionModal from "../_components/selection.modal";
import TaskFilterModal from "../_components/taskFilter.modal";

export default function PWARootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AddModal>
      <DeleteModal>
        <ClockModal>
          <CalendarModal>
            <SelectionModal>
              <AddCategoryModal>
                <TaskFilterModal>{children}</TaskFilterModal>
              </AddCategoryModal>
            </SelectionModal>
          </CalendarModal>
        </ClockModal>
      </DeleteModal>
    </AddModal>
  );
}
