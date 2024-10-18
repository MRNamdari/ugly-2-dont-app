export default function CategoryPage({ params }: { params: { id: string } }) {
  return <p>Category {params.id}</p>;
}
