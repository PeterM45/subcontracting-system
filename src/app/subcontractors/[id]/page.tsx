// import { notFound } from "next/navigation";
// import { api } from "~/trpc/server";
// import { PageContent } from "./page-content";

// export async function generateMetadata({ params }: { params: { id: string } }) {
//   const { id } = await Promise.resolve(params);
//   const numId = Number(id);
//   if (isNaN(numId)) return { title: "Invalid Subcontractor" };

//   const subcontractor = await api.subcontractor.getById({ id: numId });
//   return { title: subcontractor?.name ?? "Subcontractor Details" };
// }

// export default async function SubcontractorPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const { id } = await Promise.resolve(params);
//   const numId = Number(id);
//   if (isNaN(numId)) return notFound();

//   const subcontractor = await api.subcontractor.getById({ id: numId });
//   if (!subcontractor) return notFound();

//   const rates = await api.rate.getBySubcontractor({
//     subcontractorId: numId,
//   });
//   return <PageContent subcontractor={subcontractor} rates={rates} />;
// }
import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;
