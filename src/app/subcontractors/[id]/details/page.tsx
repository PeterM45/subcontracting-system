import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { PageContent } from "~/app/subcontractors/[id]/page-content";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params);
  const numId = Number(id);
  if (isNaN(numId)) {
    notFound();
  }

  const subcontractor = await api.subcontractor.getById({ id: numId });
  return { title: subcontractor?.name ?? "Subcontractor Details" };
}

export default async function SubcontractorPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await Promise.resolve(params);
  const numId = Number(id);
  if (isNaN(numId)) return notFound();
  const subcontractor = await api.subcontractor.getById({ id: numId });
  if (!subcontractor) return notFound();
  const initialRates = await api.rate.getBySubcontractor({
    subcontractorId: numId,
  });
  return (
    <>
      <PageContent subcontractor={subcontractor} initialRates={initialRates} />
    </>
  );
}
