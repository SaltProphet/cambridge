import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Settings, Shield, AlertTriangle } from "lucide-react";

const creators = [
  {
    id: 1,
    name: "Alice Chen",
    email: "alice@example.com",
    tier: "Pro",
    usage: 87,
    limit: 100,
    status: "active",
    frozen: false,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    tier: "Pro",
    usage: 145,
    limit: 100,
    status: "warning",
    frozen: false,
  },
  {
    id: 3,
    name: "Carol Johnson",
    email: "carol@example.com",
    tier: "Starter",
    usage: 42,
    limit: 50,
    status: "active",
    frozen: false,
  },
  {
    id: 4,
    name: "David Park",
    email: "david@example.com",
    tier: "Pro",
    usage: 98,
    limit: 100,
    status: "active",
    frozen: false,
  },
  {
    id: 5,
    name: "Eve Martinez",
    email: "eve@example.com",
    tier: "Enterprise",
    usage: 234,
    limit: 500,
    status: "active",
    frozen: false,
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-8">
      {/* Admin Warning */}
      <Card className="border-yellow-500/50 bg-yellow-500/5">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <Shield className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">Admin Access</h3>
              <p className="text-sm text-muted-foreground">
                You have administrative privileges. Changes here affect all creators in your organization.
                All controls are read-only stubs for Phase 1.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Global Usage Cap</CardTitle>
            <CardDescription>Organization-wide monthly limit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="globalCap">Total Monthly Hours</Label>
              <Input 
                id="globalCap" 
                type="number" 
                defaultValue="1000" 
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Currently using 606 of 1000 hours (60.6%)
              </p>
            </div>

            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-accent rounded-full h-3 transition-all"
                style={{ width: "60.6%" }}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="autoScale">Auto-scale on limit</Label>
              <Switch id="autoScale" disabled />
            </div>

            <Button className="w-full" disabled>
              <Settings className="h-4 w-4 mr-2" />
              Update Global Cap
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Warning Thresholds</CardTitle>
            <CardDescription>Configure alert levels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="warningThreshold">Warning Level (%)</Label>
              <Input 
                id="warningThreshold" 
                type="number" 
                defaultValue="80" 
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Send notifications when usage exceeds this percentage
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="criticalThreshold">Critical Level (%)</Label>
              <Input 
                id="criticalThreshold" 
                type="number" 
                defaultValue="90" 
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Begin feature degradation at this percentage
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="emailNotifications">Email notifications</Label>
              <Switch id="emailNotifications" defaultChecked disabled />
            </div>

            <Button className="w-full" disabled>
              <Settings className="h-4 w-4 mr-2" />
              Update Thresholds
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Creator Management */}
      <Card>
        <CardHeader>
          <CardTitle>Creator Usage Overview</CardTitle>
          <CardDescription>Monitor and manage individual creator accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creator</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creators.map((creator) => {
                const usagePercent = (creator.usage / creator.limit) * 100;
                const isOverLimit = creator.usage > creator.limit;
                
                return (
                  <TableRow key={creator.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{creator.name}</p>
                        <p className="text-xs text-muted-foreground">{creator.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{creator.tier}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {creator.usage} / {creator.limit} hrs
                          </span>
                        </div>
                        <div className="w-32 bg-muted rounded-full h-1.5">
                          <div 
                            className={`rounded-full h-1.5 ${
                              isOverLimit ? "bg-red-500" : usagePercent >= 80 ? "bg-yellow-500" : "bg-accent"
                            }`}
                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isOverLimit ? (
                        <Badge variant="destructive">Over Limit</Badge>
                      ) : creator.status === "warning" ? (
                        <Badge className="bg-yellow-500">Warning</Badge>
                      ) : (
                        <Badge>Active</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>
                          Override
                        </Button>
                        <Button 
                          variant={creator.frozen ? "default" : "destructive"} 
                          size="sm" 
                          disabled
                        >
                          {creator.frozen ? "Unfreeze" : "Freeze"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Freeze Info */}
      <Card className="bg-muted/50">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Freeze & Override Controls</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Freeze:</strong> Temporarily suspend a creator&apos;s ability to start new sessions. Existing sessions continue normally.
                <br />
                <strong>Override:</strong> Manually adjust a creator&apos;s usage limits or reset their current usage counter.
                <br />
                Both features will be functional in Phase 2 with proper audit logging.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
