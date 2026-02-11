import { DashboardNav } from "@/components/layout/dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Creator Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your rooms, monitor usage, and track metrics
        </p>
      </div>
      <DashboardNav />
      {children}
    </div>
  );
}
