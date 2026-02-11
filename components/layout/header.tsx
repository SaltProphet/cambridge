import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            CamBridge
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/apply" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Apply
            </Link>
            <Link href="/creator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Creator
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/creator">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/apply">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
