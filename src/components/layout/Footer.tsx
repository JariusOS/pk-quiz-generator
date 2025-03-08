
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github, Twitter } from "lucide-react";
import LearnPoolLogo from "@/components/brand/LearnPoolLogo";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <LearnPoolLogo className="h-8 w-8" />
              <span className="font-heading font-bold">LearnPool</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Test your knowledge with dynamically generated questions from LearnPool's Public Knowledge database.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://twitter.com/learnpool" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://github.com/learnpool" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-medium">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground transition-colors hover:text-foreground">About</Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground transition-colors hover:text-foreground">FAQ</Link>
              </li>
              <li>
                <a href="https://pk.learnpool.com" className="text-muted-foreground transition-colors hover:text-foreground">Public Knowledge</a>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground transition-colors hover:text-foreground">Blog</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-medium">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/leaderboard" className="text-muted-foreground transition-colors hover:text-foreground">Leaderboard</Link>
              </li>
              <li>
                <Link to="/challenges" className="text-muted-foreground transition-colors hover:text-foreground">Challenges</Link>
              </li>
              <li>
                <Link to="/rewards" className="text-muted-foreground transition-colors hover:text-foreground">Rewards Program</Link>
              </li>
              <li>
                <Link to="/affiliates" className="text-muted-foreground transition-colors hover:text-foreground">Affiliates</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-medium">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground transition-colors hover:text-foreground">Terms of Service</Link>
              </li>
              <li>
                <Link to="/cookies" className="text-muted-foreground transition-colors hover:text-foreground">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} LearnPool. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
