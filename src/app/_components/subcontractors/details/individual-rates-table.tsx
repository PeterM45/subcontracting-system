import { type RouterOutputs } from "~/trpc/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Rate = RouterOutputs["rate"]["getBySubcontractor"][0];

export function RatesTable({ rates }: { rates: Rate[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Rates</CardTitle>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {rates.map((rate) => (
              <TableRow key={rate.id}>
                <TableCell>{rate.serviceType}</TableCell>
                <TableCell>{rate.materialType}</TableCell>
                <TableCell>{rate.binSize}</TableCell>
                <TableCell className="text-right">${rate.baseRate}</TableCell>
                <TableCell className="text-right">
                  {rate.dumpFee ? `$${rate.dumpFee}` : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {rate.rentalRate ? `$${rate.rentalRate}` : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
