import { DashboardNav } from "@/components/layout/dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Creator</h1>
        <p className="text-muted-foreground">
          Manage rooms and monitor usage
        </p>
      </div>
      <DashboardNav />
      {children}
    </div>
  );
}
