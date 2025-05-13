"use client";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { ServiceRequestData } from "~/lib/types";

// Dynamically import the PDF componen
const PDFDownload = dynamic(() => import("./pdf-document"), {
  loading: () => (
    <Button disabled>
      <Download className="mr-2 h-4 w-4" />
      Loading...
    </Button>
  ),
  ssr: false,
});

interface Props {
  serviceRequest: ServiceRequestData;
}

export default function GeneratePDFButton({ serviceRequest }: Props) {
  console.log("IN GENERATE", serviceRequest);
  if (!serviceRequest?.customer || !serviceRequest?.subcontractor) {
    return null;
  }

  return <PDFDownload serviceRequest={serviceRequest} />;
}
