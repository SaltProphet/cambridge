import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Shield, DollarSign, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Enterprise Cam Sharing
            <span className="text-accent block mt-2">With Cost Controls</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            1-to-1 video sessions with granular usage caps, billing controls, and enterprise security. 
            Built for teams that need predictable costs.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/founders">Apply Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <DollarSign className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Cost Control</CardTitle>
              <CardDescription>
                Set global and per-creator caps. Automatic warnings and graceful degradation when limits approach.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Enterprise Security</CardTitle>
              <CardDescription>
                SOC 2 compliant infrastructure. End-to-end encryption. Audit logs for every session.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-accent mb-2" />
              <CardTitle>1-to-1 Sessions</CardTitle>
              <CardDescription>
                Private video rooms. No group calls. Perfect for coaching, consulting, and support.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Simple, Predictable Pricing</h2>
          <p className="text-muted-foreground text-center mb-12 text-lg">
            Choose the tier that fits your needs. Scale as you grow.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Tier */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription className="text-3xl font-bold text-foreground mt-2">
                  $99<span className="text-base text-muted-foreground font-normal">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5">
                    <Check className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-sm font-medium">5 creators</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5">
                    <Check className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-sm font-medium">100 hours/month</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5">
                    <Check className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-sm font-medium">Basic analytics</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5">
                    <Check className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-sm font-medium">Email support</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/founders">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="border-2 border-accent relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                Popular
              </div>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription className="text-3xl font-bold text-foreground mt-2">
                  $299<span className="text-base text-muted-foreground font-normal">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10">
                    <Check className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-sm font-medium">25 creators</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10">
                    <Check className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-sm font-medium">500 hours/month</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10">
                    <Check className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-sm font-medium">Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10">
                    <Check className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-sm font-medium">Priority support</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10">
                    <Check className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-sm font-medium">Custom branding</span>
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/founders">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Tier */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription className="text-3xl font-bold text-foreground mt-2">
                  Custom
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5">
                    <Check className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-sm font-medium">Unlimited creators</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5">
                    <Check className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-sm font-medium">Custom hours</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5">
                    <Check className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-sm font-medium">Dedicated support</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5">
                    <Check className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-sm font-medium">SLA guarantees</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5">
                    <Check className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-sm font-medium">Custom integrations</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/founders">Contact Sales</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Section - Redesigned */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-accent mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Enterprise-Grade Security</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Bank-level security infrastructure protecting your data and privacy at every layer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-card to-card/50 border-accent/20">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Infrastructure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  SOC 2 Type II certified infrastructure with end-to-end encryption and regular third-party security audits
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/50 border-accent/20">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  GDPR and HIPAA compliant with flexible data residency options to meet your regulatory requirements
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/50 border-accent/20">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Monitoring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  24/7 security operations with real-time threat detection, anomaly monitoring, and instant alerts
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 p-8 rounded-xl bg-accent/5 border border-accent/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Need custom security requirements?</h3>
                <p className="text-muted-foreground">
                  We work with enterprises to meet specialized compliance and security needs
                </p>
              </div>
              <Button size="lg" asChild>
                <Link href="/founders">Contact Security Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
