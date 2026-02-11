import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FoundersPage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Founder Application</h1>
          <p className="text-muted-foreground text-lg">
            Apply to join CamBridge. We review all applications within 48 hours.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tell us about yourself</CardTitle>
            <CardDescription>
              This is a read-only form stub. Submission will be enabled in Phase 2.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" placeholder="Acme Inc." />
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Business Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="useCase">Primary Use Case</Label>
                  <Select>
                    <SelectTrigger id="useCase">
                      <SelectValue placeholder="Select a use case" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coaching">Coaching & Mentoring</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="support">Customer Support</SelectItem>
                      <SelectItem value="sales">Sales Demos</SelectItem>
                      <SelectItem value="education">Education & Training</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedCreators">Expected Number of Creators</Label>
                  <Select>
                    <SelectTrigger id="expectedCreators">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1-5 creators</SelectItem>
                      <SelectItem value="6-25">6-25 creators</SelectItem>
                      <SelectItem value="26-100">26-100 creators</SelectItem>
                      <SelectItem value="100+">100+ creators</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedHours">Expected Monthly Hours</Label>
                  <Select>
                    <SelectTrigger id="expectedHours">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-100">0-100 hours</SelectItem>
                      <SelectItem value="100-500">100-500 hours</SelectItem>
                      <SelectItem value="500-1000">500-1,000 hours</SelectItem>
                      <SelectItem value="1000+">1,000+ hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Tell us more about your use case</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe how you plan to use CamBridge..."
                    rows={5}
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input id="website" type="url" placeholder="https://example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referral">How did you hear about us? (Optional)</Label>
                  <Select>
                    <SelectTrigger id="referral">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="search">Search Engine</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="blog">Blog/Article</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" className="flex-1" disabled>
                  Submit Application
                </Button>
                <Button type="button" variant="outline" className="flex-1" disabled>
                  Save Draft
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Form submission will be enabled in Phase 2 with API integration.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
