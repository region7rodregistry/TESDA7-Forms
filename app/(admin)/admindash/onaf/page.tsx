import { ApplicationDashboard } from "@/components/dashboard/ApplicationDashboard";

export default function OnafDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Applications Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Review, complete, and manage NTTC applications for your province.
        </p>
      </div>
      <ApplicationDashboard variant="focal" />
    </div>
  );
}
