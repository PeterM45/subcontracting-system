import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 grid place-items-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}
