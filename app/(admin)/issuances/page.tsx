import { IssuancesTable } from "@/components/issuances/IssuancesTable";

export default function IssuancesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">NTTC Issuances Registry</h1>
        <p className="text-sm text-muted-foreground">
          Certified trainer records. Search, sort, view the submitted NTTC form, or export to Excel.
        </p>
      </div>
      <IssuancesTable />
    </div>
  );
}
