import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, DollarSign, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-8 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Cam Sharing
            <span className="block mt-2">With Cost Controls</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            1-to-1 video sessions with granular usage caps and billing controls.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/apply">Apply</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/creator">Creator</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <DollarSign className="h-8 w-8 mb-2" />
              <CardTitle>Cost Control</CardTitle>
              <CardDescription>
                Set global and per-creator caps with automatic warnings.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 mb-2" />
              <CardTitle>Security</CardTitle>
              <CardDescription>
                End-to-end encryption with audit logs.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 mb-2" />
              <CardTitle>1-to-1 Sessions</CardTitle>
              <CardDescription>
                Private video rooms for coaching and consulting.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Pricing</h2>
          <p className="text-muted-foreground text-center mb-12 text-lg">
            Contact for pricing details
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription className="text-3xl font-bold text-foreground mt-2">
                  —
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Contact for details</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription className="text-3xl font-bold text-foreground mt-2">
                  —
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Contact for details</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription className="text-3xl font-bold text-foreground mt-2">
                  —
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Contact for details</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
