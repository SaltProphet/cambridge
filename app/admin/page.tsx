import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Settings, Shield } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin</h1>
        <p className="text-muted-foreground">
          Global settings and creator management
        </p>
      </div>

      <div className="space-y-8">
        <Card className="border-2">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Admin Access</h3>
                <p className="text-sm text-muted-foreground">
                  Administrative privileges. All controls are read-only for Phase 1.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Cap</CardTitle>
              <CardDescription>Organization-wide limit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="globalCap">Total Monthly Hours</Label>
                <Input 
                  id="globalCap" 
                  type="number" 
                  value="0" 
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  No data yet
                </p>
              </div>

              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-foreground rounded-full h-3"
                  style={{ width: "0%" }}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="autoScale">Auto-scale</Label>
                <Switch id="autoScale" disabled />
              </div>

              <Button className="w-full" disabled>
                <Settings className="h-4 w-4 mr-2" />
                Update
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Stop</CardTitle>
              <CardDescription>Global control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emergencyStop">Emergency Stop</Label>
                <Switch id="emergencyStop" disabled />
              </div>
              <p className="text-xs text-muted-foreground">
                Stops all new sessions immediately
              </p>
              <Button className="w-full" disabled>
                <Settings className="h-4 w-4 mr-2" />
                Update
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Creators</CardTitle>
            <CardDescription>Manage creator accounts</CardDescription>
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
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No data yet
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
