import { NewServiceRequestForm } from "~/app/_components/service-requests/new-service-request-form";
import { BackButton } from "@/components/ui/back-button";

export default function NewServiceRequestPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="text-2xl font-bold">New Service Request</h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          Create a new service request by filling out the customer and service
          information below.
        </p>
      </div>
      <NewServiceRequestForm />
    </div>
  );
}
