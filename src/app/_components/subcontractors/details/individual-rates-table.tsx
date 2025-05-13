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
import {
  formatServiceType,
  formatMaterialType,
  formatCurrency,
} from "~/lib/formatting";
import { Trash2, Plus } from "lucide-react";
import type { Rate, Subcontractor } from "~/lib/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
              <TableHead className="text-right">Rate Structure</TableHead>
              <TableHead className="text-right">Rental Rate</TableHead>
              <TableHead className="text-right">Additional Costs</TableHead>
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
                <TableCell className="text-right">
                  {rate.rateStructure.flatRate !== undefined ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">
                            {formatCurrency(rate.rateStructure.flatRate)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Flat Rate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">
                            {formatCurrency(rate.rateStructure.baseRate)} +{" "}
                            {formatCurrency(rate.rateStructure.dumpFee)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Base Rate + Dump Fee</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(rate.rateStructure.rentalRate)}
                </TableCell>
                <TableCell className="text-right">
                  {rate.rateStructure.additionalCosts.length > 0 ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 px-2 hover:bg-transparent"
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          {rate.rateStructure.additionalCosts.length} costs
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          {rate.rateStructure.additionalCosts.map(
                            (cost, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between"
                              >
                                <span>{cost.name}</span>
                                <span>
                                  {cost.isPercentage
                                    ? `${cost.amount}%`
                                    : formatCurrency(cost.amount)}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {rate.notes ?? "-"}
                </TableCell>
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
