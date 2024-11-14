import React from "react";
import AddCategoryModal from "../_components/addEditCategory.modal";
import CalendarModal from "../_components/calendar.modal";
import ClockModal from "../_components/clock.modal";
import DeleteModal from "../_components/delete.modal";
import AddModal from "../_components/add.modal";
import SelectionModal from "../_components/selection.modal";

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
              <AddCategoryModal>{children}</AddCategoryModal>
            </SelectionModal>
          </CalendarModal>
        </ClockModal>
      </DeleteModal>
    </AddModal>
  );
}
