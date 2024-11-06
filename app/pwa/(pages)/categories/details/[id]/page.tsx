"use client";

export default function CategoryPage({ params }: { params: { id: string } }) {
  return <div>Category {params.id}</div>;
}
