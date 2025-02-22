"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();

  return (
    <Button variant="ghost" onClick={() => router.back()}>
      <ChevronLeft className="mr-2 h-4 w-4" />
      Back
    </Button>
  );
}
