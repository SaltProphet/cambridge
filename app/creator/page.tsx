import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Video, TrendingUp } from "lucide-react";

export default function CreatorPage() {
  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Tier"
          value="—"
          description="No data yet"
          icon={TrendingUp}
        />
        <MetricCard
          title="Rooms"
          value="0"
          description="No data yet"
          icon={Video}
        />
        <MetricCard
          title="Hours Used"
          value="0"
          description="No data yet"
          icon={Clock}
        />
        <MetricCard
          title="Sessions"
          value="0"
          description="No data yet"
          icon={Users}
        />
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No data yet
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Breakdown</CardTitle>
            <CardDescription>Hours by room</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No data yet
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-2 h-2 bg-foreground rounded-full mt-2" />
            <div>
              <h3 className="font-semibold mb-1">Status</h3>
              <p className="text-sm text-muted-foreground">
                No data yet
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
