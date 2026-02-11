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
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm">Up to 5 creators</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm">100 hours/month included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm">Basic analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm">Email support</span>
                  </li>
                </ul>
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
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm">Up to 25 creators</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm">500 hours/month included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm">Advanced analytics & reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm">Custom branding</span>
                  </li>
                </ul>
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
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm">Unlimited creators</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm">Custom hours allocation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm">Dedicated support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm">SLA guarantees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm">Custom integrations</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/founders">Contact Sales</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/50">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
              <CardTitle className="text-3xl">Enterprise-Grade Security</CardTitle>
              <CardDescription className="text-base mt-4">
                Your data and your users&apos; privacy are our top priority
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <h4 className="font-semibold">Infrastructure</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• SOC 2 Type II certified</li>
                    <li>• End-to-end encryption</li>
                    <li>• Regular security audits</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Compliance</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• GDPR compliant</li>
                    <li>• HIPAA available</li>
                    <li>• Data residency options</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Access Control</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• SSO integration</li>
                    <li>• Role-based permissions</li>
                    <li>• Audit logging</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Monitoring</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Real-time threat detection</li>
                    <li>• Anomaly detection</li>
                    <li>• 24/7 security operations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
