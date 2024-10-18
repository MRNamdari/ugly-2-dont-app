export default function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  return <p>Edit Project {params.id}</p>;
}
