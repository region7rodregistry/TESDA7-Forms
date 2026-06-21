import { NttcRegistryTable } from "@/components/issuances/NttcRegistryTable";

export default function NttcRegistryPage() {
  return (
    // Break out of the admin layout's centered max-w-7xl column so the wide,
    // many-column registry can use the full viewport width.
    <div className="mx-[calc(50%-50vw)] w-screen space-y-6 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold">NTTC Registry</h1>
        <p className="text-sm text-muted-foreground">
          Flat, spreadsheet-style view of all certified issuances — copy the full dataset for
          reporting.
        </p>
      </div>
      <NttcRegistryTable />
    </div>
  );
}
