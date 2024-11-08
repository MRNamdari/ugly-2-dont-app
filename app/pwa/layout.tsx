import React from "react";
import AddCategoryModal from "../_components/addCategory.modal";

export default function PWARootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AddCategoryModal>{children}</AddCategoryModal>;
}
