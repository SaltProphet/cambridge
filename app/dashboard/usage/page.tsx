import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, TrendingUp, AlertCircle } from "lucide-react";

export default function UsagePage() {
  const usagePercentage = 68;
  const isNearLimit = usagePercentage >= 80;
  const isWarning = usagePercentage >= 90;

  return (
    <div className="space-y-8">
      {/* Current Status */}
      <Card className={isWarning ? "border-red-500/50 bg-red-500/5" : isNearLimit ? "border-yellow-500/50 bg-yellow-500/5" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Usage Status</CardTitle>
            <Badge variant={isWarning ? "destructive" : isNearLimit ? "secondary" : "default"}>
              {isWarning ? "Critical" : isNearLimit ? "Warning" : "Healthy"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Monthly Usage</span>
                <span className="text-sm text-muted-foreground">342 / 500 hours</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className={`rounded-full h-3 transition-all ${
                    isWarning ? "bg-red-500" : isNearLimit ? "bg-yellow-500" : "bg-accent"
                  }`}
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {usagePercentage}% of monthly limit used • 12 days remaining in billing cycle
              </p>
            </div>

            {isNearLimit && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-background border border-border">
                <AlertTriangle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isWarning ? "text-red-500" : "text-yellow-500"}`} />
                <div>
                  <h4 className="font-semibold text-sm mb-1">
                    {isWarning ? "Critical Usage Warning" : "Approaching Usage Limit"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isWarning 
                      ? "You're very close to your monthly limit. Consider upgrading your plan or some features may be degraded."
                      : "You're approaching your monthly usage limit. Monitor your usage to avoid interruptions."
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Current Usage"
          value="342 hrs"
          description="68% of monthly limit"
          icon={Clock}
        />
        <MetricCard
          title="Remaining"
          value="158 hrs"
          description="Available this cycle"
          icon={CheckCircle}
        />
        <MetricCard
          title="Daily Average"
          value="18.5 hrs"
          description="Based on last 7 days"
          icon={TrendingUp}
        />
        <MetricCard
          title="Projected Total"
          value="464 hrs"
          description="End of cycle estimate"
          icon={AlertCircle}
        />
      </div>

      {/* Usage Caps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Usage Caps</CardTitle>
            <CardDescription>Your configured limits and thresholds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm">Monthly Cap</p>
                  <p className="text-xs text-muted-foreground">Hard limit per billing cycle</p>
                </div>
                <span className="text-lg font-bold">500 hrs</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm">Warning Threshold</p>
                  <p className="text-xs text-muted-foreground">Alert when exceeded</p>
                </div>
                <span className="text-lg font-bold">80%</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm">Per-Session Cap</p>
                  <p className="text-xs text-muted-foreground">Maximum session duration</p>
                </div>
                <span className="text-lg font-bold">4 hrs</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm">Rollover</p>
                  <p className="text-xs text-muted-foreground">Unused hours carry over</p>
                </div>
                <Badge>Enabled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Degradation</CardTitle>
            <CardDescription>What happens when limits are approached</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <p className="font-medium text-sm">0-80% Usage</p>
                </div>
                <p className="text-xs text-muted-foreground">All features available</p>
              </div>

              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <p className="font-medium text-sm">80-90% Usage</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Warning emails sent, usage notifications shown
                </p>
              </div>

              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <p className="font-medium text-sm">90-100% Usage</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Critical warnings, new sessions limited to 2 hours
                </p>
              </div>

              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <p className="font-medium text-sm">100% Usage</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  New sessions blocked until next billing cycle or upgrade
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historical Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Usage History</CardTitle>
          <CardDescription>Last 6 months of usage data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { month: "February 2026", usage: 342, limit: 500, percentage: 68 },
              { month: "January 2026", usage: 456, limit: 500, percentage: 91 },
              { month: "December 2025", usage: 389, limit: 500, percentage: 78 },
              { month: "November 2025", usage: 423, limit: 500, percentage: 85 },
              { month: "October 2025", usage: 367, limit: 500, percentage: 73 },
              { month: "September 2025", usage: 412, limit: 500, percentage: 82 },
            ].map((record, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{record.month}</span>
                  <span className="text-muted-foreground">{record.usage} / {record.limit} hrs</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`rounded-full h-2 transition-all ${
                      record.percentage >= 90 ? "bg-red-500" : record.percentage >= 80 ? "bg-yellow-500" : "bg-accent"
                    }`}
                    style={{ width: `${record.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="bg-muted/50">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <Clock className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Usage Tracking</h4>
              <p className="text-sm text-muted-foreground">
                Usage caps and warnings are displayed in real-time. All data shown is read-only for Phase 1.
                Real-time tracking and automatic feature degradation will be implemented in Phase 2.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
