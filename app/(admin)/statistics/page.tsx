import { StatisticsView } from "@/components/dashboard/StatisticsView";

export default function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Statistics</h1>
        <p className="text-sm text-muted-foreground">
          Distribution of applications by sector, qualification, and province.
        </p>
      </div>
      <StatisticsView />
    </div>
  );
}
