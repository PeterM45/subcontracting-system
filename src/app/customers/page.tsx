import { Suspense } from "react";
import { CustomerList } from "~/app/_components/customers/customer-list";
import { CreateCustomerDialog } from "~/app/_components/customers/create-customer-dialog";
import { Skeleton } from "~/components/ui/skeleton";

function CustomerListSkeleton() {
  return (
    <div className="mt-6 rounded-md border">
      <div className="space-y-3 p-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>
        <CreateCustomerDialog />
      </div>

      <Suspense fallback={<CustomerListSkeleton />}>
        <CustomerList />
      </Suspense>
    </main>
  );
}
