
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Award, BarChart, BookOpen, Crown, Users } from "lucide-react";
import LearnPoolLogo from "@/components/brand/LearnPoolLogo";

export default function Header() {
  return (
    <header className="border-b border-border sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <LearnPoolLogo className="h-8 w-8" />
            <span className="font-heading font-bold">LearnPool</span>
          </Link>
          <nav className="hidden md:flex md:gap-6">
            <Link to="/quiz" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <BookOpen className="mr-1 h-4 w-4" />
              Quizzes
            </Link>
            <Link to="/challenges" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <Users className="mr-1 h-4 w-4" />
              Challenges
            </Link>
            <Link to="/leaderboard" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <BarChart className="mr-1 h-4 w-4" />
              Leaderboard
            </Link>
            <Link to="/rewards" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <Award className="mr-1 h-4 w-4" />
              Rewards
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild className="gap-2">
            <Link to="/login">
              <Crown className="h-4 w-4" />
              Login with LearnPool
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
