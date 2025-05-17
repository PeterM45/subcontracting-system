import { type RouterOutputs } from "~/trpc/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Rate = RouterOutputs["rate"]["getAll"][0];

interface RatesTableProps {
  rates: Rate[];
  onRateClick?: (rate: Rate) => void;
}

export function RatesTable({ rates, onRateClick }: RatesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subcontractor</TableHead>
          <TableHead>Service Type</TableHead>
          <TableHead>Bin Size</TableHead>
          <TableHead className="text-right">Lift Rate</TableHead>
          <TableHead className="text-right">Effective Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rates.map((rate) => (
          <TableRow
            key={rate.id}
            onClick={() => onRateClick?.(rate)}
            className={onRateClick ? "cursor-pointer hover:bg-muted/50" : ""}
          >
            <TableCell>{rate.subcontractorId}</TableCell>
            <TableCell>{rate.serviceType}</TableCell>
            <TableCell>{rate.binSize}</TableCell>
            <TableCell className="text-right">${rate.liftRate}</TableCell>
            <TableCell className="text-right">
              {new Date(rate.effectiveDate).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
