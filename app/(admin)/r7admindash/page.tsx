import { AuthGuard } from "@/components/auth/AuthGuard";
import { ApplicationDashboard } from "@/components/dashboard/ApplicationDashboard";

export default function R7DashboardPage() {
  return (
    <AuthGuard requiredRole="r7admin" fallbackPath="/admindash/onaf">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Region VII — NTTC ONAF Database</h1>
          <p className="text-sm text-muted-foreground">
            Region-wide overview across all provinces. Filter by province, review, and process
            applications.
          </p>
        </div>
        <ApplicationDashboard variant="r7" />
      </div>
    </AuthGuard>
  );
}
