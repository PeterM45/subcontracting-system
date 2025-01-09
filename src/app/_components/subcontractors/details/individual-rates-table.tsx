import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "~/trpc/react";

import { AddRateDialog } from "~/app/_components/subcontractors/details/add-rate-dialog";
import { EditRateDialog } from "~/app/_components/subcontractors/details/edit-rate-dialog";
import { formatServiceType, formatMaterialType } from "~/lib/formatting";
import { Trash2 } from "lucide-react";
import type { Rate, Subcontractor } from "~/lib/types";

export function RatesTable({
  rates,
  subcontractor,
}: {
  rates: Rate[];
  subcontractor: Subcontractor;
}) {
  const utils = api.useUtils();
  const deleteRate = api.rate.delete.useMutation({
    onSuccess: () => {
      void utils.rate.getBySubcontractor.invalidate({
        subcontractorId: subcontractor.id,
      });
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Current Rates</CardTitle>
        <AddRateDialog subcontractor={subcontractor} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="text-right">Base Rate</TableHead>
              <TableHead className="text-right">Dump Fee</TableHead>
              <TableHead className="text-right">Rental Rate</TableHead>
              <TableHead className="text-right">Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rates.map((rate) => (
              <TableRow key={rate.id}>
                <TableCell>{formatServiceType(rate.serviceType)}</TableCell>
                <TableCell>{formatMaterialType(rate.materialType)}</TableCell>
                <TableCell>{rate.binSize}</TableCell>
                <TableCell className="text-right">${rate.baseRate}</TableCell>
                <TableCell className="text-right">
                  {rate.dumpFee ? `$${rate.dumpFee}` : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {rate.rentalRate ? `$${rate.rentalRate}` : "-"}
                </TableCell>
                <TableCell className="text-right">{rate.notes}</TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditRateDialog rate={rate} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to delete this rate?")
                        ) {
                          deleteRate.mutate({ id: rate.id });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
