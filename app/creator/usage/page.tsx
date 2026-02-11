import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, TrendingUp, AlertCircle } from "lucide-react";

export default function UsagePage() {
  return (
    <div className="space-y-8">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Monthly Usage</span>
                <span className="text-sm text-muted-foreground">0 / 0</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-foreground rounded-full h-3" style={{ width: "0%" }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                No data yet
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Current Usage"
          value="0"
          description="—"
          icon={Clock}
        />
        <MetricCard
          title="Remaining"
          value="0"
          description="—"
          icon={CheckCircle}
        />
        <MetricCard
          title="Daily Average"
          value="0"
          description="—"
          icon={TrendingUp}
        />
        <MetricCard
          title="Projected"
          value="0"
          description="—"
          icon={AlertCircle}
        />
      </div>

      {/* Usage Caps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Usage Caps</CardTitle>
            <CardDescription>Configured limits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No data yet
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
            <CardDescription>Past usage data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No data yet
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
