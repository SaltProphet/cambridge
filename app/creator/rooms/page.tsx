import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function RoomsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rooms</h2>
          <p className="text-muted-foreground">Manage video rooms</p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Create Room
        </Button>
      </div>

      {/* Empty State */}
      <Card>
        <CardHeader>
          <CardTitle>No Rooms Yet</CardTitle>
          <CardDescription>Room creation will be enabled in Phase 2</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No data yet
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
