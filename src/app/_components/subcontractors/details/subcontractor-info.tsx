import { type RouterOutputs } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Subcontractor = RouterOutputs["subcontractor"]["getById"];

export function SubcontractorInfo({
  subcontractor,
}: {
  subcontractor: NonNullable<Subcontractor>;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Contact: {subcontractor.contact}
          </p>
          <p className="text-sm text-muted-foreground">
            Phone: {subcontractor.phone}
          </p>
          <p className="text-sm text-muted-foreground">
            Email: {subcontractor.email}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {subcontractor.location}
          </p>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">
              Lat: {subcontractor.latitude}, Long: {subcontractor.longitude}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
