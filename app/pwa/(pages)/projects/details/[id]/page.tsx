export default function ProjectPage({ params }: { params: { id: string } }) {
  return <p>Project {params.id}</p>;
}
