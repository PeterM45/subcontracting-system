import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Waste Management<span className="text-primary"> CRM</span>
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="hover:bg-accent flex max-w-xs flex-col gap-4 rounded-xl border p-4"
            href="/customers"
          >
            <h3 className="text-2xl font-bold">Customers →</h3>
            <div className="text-lg">
              Manage your customer relationships, track contacts, and maintain
              detailed records.
            </div>
          </Link>
          <Link
            className="hover:bg-accent flex max-w-xs flex-col gap-4 rounded-xl border p-4"
            href="/dashboard"
          >
            <h3 className="text-2xl font-bold">Dashboard →</h3>
            <div className="text-lg">
              View key metrics, track performance, and monitor business
              operations.
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
