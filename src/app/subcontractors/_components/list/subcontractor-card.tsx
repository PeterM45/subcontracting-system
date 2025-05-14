import type { RouterOutputs } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

type Subcontractor = RouterOutputs["subcontractor"]["getAll"][0];

export function SubcontractorCard({
  subcontractor,
}: {
  subcontractor: Subcontractor;
}) {
  return (
    <Link href={`/subcontractors/${subcontractor.id}/details`}>
      <Card className="cursor-pointer transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle>{subcontractor.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {subcontractor.contact && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Contact:</span>{" "}
              {subcontractor.contact}
            </div>
          )}
          {subcontractor.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              {subcontractor.email}
            </div>
          )}
          {subcontractor.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4" />
              {subcontractor.phone}
            </div>
          )}
          {subcontractor.location && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="mt-1 h-4 w-4" />
              <div>{subcontractor.location}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
