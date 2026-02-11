import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Video, Users, Clock, Settings } from "lucide-react";

const rooms = [
  {
    id: 1,
    name: "Strategy Sessions",
    description: "1-on-1 business strategy consulting",
    status: "active",
    creator: "You",
    sessions: 45,
    totalHours: 67.5,
    avgDuration: 90,
  },
  {
    id: 2,
    name: "Product Demos",
    description: "Live product demonstrations",
    status: "active",
    creator: "You",
    sessions: 32,
    totalHours: 42.7,
    avgDuration: 80,
  },
  {
    id: 3,
    name: "Onboarding Calls",
    description: "New customer onboarding",
    status: "inactive",
    creator: "You",
    sessions: 18,
    totalHours: 15.0,
    avgDuration: 50,
  },
  {
    id: 4,
    name: "Tech Support",
    description: "Technical support and troubleshooting",
    status: "active",
    creator: "You",
    sessions: 28,
    totalHours: 23.3,
    avgDuration: 50,
  },
];

export default function RoomsPage() {
  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Rooms</h2>
          <p className="text-muted-foreground">Manage your video rooms and sessions</p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Create Room
        </Button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-xl">{room.name}</CardTitle>
                    <Badge variant={room.status === "active" ? "default" : "secondary"}>
                      {room.status}
                    </Badge>
                  </div>
                  <CardDescription>{room.description}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" disabled>
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span className="text-xs">Sessions</span>
                    </div>
                    <p className="text-xl font-bold">{room.sessions}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">Total Hours</span>
                    </div>
                    <p className="text-xl font-bold">{room.totalHours}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Video className="h-3 w-3" />
                      <span className="text-xs">Avg Time</span>
                    </div>
                    <p className="text-xl font-bold">{room.avgDuration}m</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" disabled>
                    View Sessions
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" disabled>
                    Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Banner */}
      <Card className="bg-muted/50">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <Video className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Room Management</h4>
              <p className="text-sm text-muted-foreground">
                Room creation and configuration will be enabled in Phase 2. Currently showing read-only data.
                Each room represents a dedicated space for 1-to-1 sessions with configurable settings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
