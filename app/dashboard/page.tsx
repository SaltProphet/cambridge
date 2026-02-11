import { MetricCard } from "@/components/metric-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Video, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Current Tier"
          value="Pro"
          description="25 creators, 500 hrs/month"
          icon={TrendingUp}
        />
        <MetricCard
          title="Active Rooms"
          value="12"
          description="3 in session now"
          icon={Video}
        />
        <MetricCard
          title="Hours Used"
          value="342"
          description="158 hours remaining"
          icon={Clock}
          trend={{ value: 12, label: "vs last month" }}
        />
        <MetricCard
          title="Total Sessions"
          value="1,247"
          description="This billing cycle"
          icon={Users}
          trend={{ value: 8, label: "vs last month" }}
        />
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest room sessions and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { room: "Strategy Session", user: "Alice Chen", duration: "45 min", status: "Completed" },
                { room: "Product Demo", user: "Bob Smith", duration: "32 min", status: "Completed" },
                { room: "Onboarding Call", user: "Carol Johnson", duration: "In progress", status: "Active" },
                { room: "Tech Review", user: "David Park", duration: "28 min", status: "Completed" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-sm">{activity.room}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{activity.duration}</p>
                    <p className={`text-xs ${activity.status === 'Active' ? 'text-accent' : 'text-muted-foreground'}`}>
                      {activity.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Breakdown</CardTitle>
            <CardDescription>Hours by room type this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: "Coaching Sessions", hours: 145, percentage: 42 },
                { category: "Product Demos", hours: 98, percentage: 29 },
                { category: "Support Calls", hours: 67, percentage: 20 },
                { category: "Team Meetings", hours: 32, percentage: 9 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-muted-foreground">{item.hours} hrs</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-accent rounded-full h-2 transition-all" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Banner */}
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-2 h-2 bg-accent rounded-full mt-2" />
            <div>
              <h3 className="font-semibold mb-1">System Status: All Systems Operational</h3>
              <p className="text-sm text-muted-foreground">
                All features are running smoothly. Your usage is at 68% of monthly limit with 12 days remaining in billing cycle.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
