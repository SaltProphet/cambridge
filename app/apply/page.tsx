import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ApplyPage() {
  return (
    <div className="container mx-auto px-8 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Apply</h1>
          <p className="text-muted-foreground text-lg">
            Application form. Submission will be enabled in Phase 2.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Application</CardTitle>
            <CardDescription>
              Form submission will be enabled in Phase 2.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" disabled />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" disabled />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" disabled />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Use Case</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="useCase">Primary Use Case</Label>
                  <Select disabled>
                    <SelectTrigger id="useCase">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">—</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    rows={4}
                    disabled
                  />
                </div>
              </div>

              <Button type="button" className="w-full" disabled>
                Submit Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
