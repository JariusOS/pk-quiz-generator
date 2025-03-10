
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Award, BarChart, BookOpen, Crown, ExternalLink, Menu, Moon, Sun, Users, X } from "lucide-react";
import LearnPoolLogo from "@/components/brand/LearnPoolLogo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-border sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <LearnPoolLogo className="h-8 w-8" />
            <span className="font-heading font-bold">LearnPool PK Hub</span>
          </Link>
          <nav className="hidden md:flex md:gap-6">
            <Link to="/quiz" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <BookOpen className="mr-1 h-4 w-4" />
              Generate
            </Link>
            <Link to="/quizzes" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <Award className="mr-1 h-4 w-4" />
              Quiz
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
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <Button asChild className="gap-2 hidden md:flex">
            <Link to="/login">
              <Crown className="h-4 w-4" />
              Login with LearnPool
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2 hidden md:flex">
            <a href="https://pk.learnpool.fun" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Enter LearnPool
            </a>
          </Button>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="mb-6">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4">
                <Link 
                  to="/quiz" 
                  className="flex items-center text-sm font-medium py-2"
                  onClick={() => setOpen(false)}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Generate
                </Link>
                <Link 
                  to="/quizzes" 
                  className="flex items-center text-sm font-medium py-2"
                  onClick={() => setOpen(false)}
                >
                  <Award className="mr-2 h-5 w-5" />
                  Quiz
                </Link>
                <Link 
                  to="/challenges" 
                  className="flex items-center text-sm font-medium py-2"
                  onClick={() => setOpen(false)}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Challenges
                </Link>
                <Link 
                  to="/leaderboard" 
                  className="flex items-center text-sm font-medium py-2"
                  onClick={() => setOpen(false)}
                >
                  <BarChart className="mr-2 h-5 w-5" />
                  Leaderboard
                </Link>
                <Link 
                  to="/rewards" 
                  className="flex items-center text-sm font-medium py-2"
                  onClick={() => setOpen(false)}
                >
                  <Award className="mr-2 h-5 w-5" />
                  Rewards
                </Link>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
                <a 
                  href="https://pk.learnpool.fun" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-sm font-medium py-2"
                  onClick={() => setOpen(false)}
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Enter LearnPool
                </a>
                <Button asChild className="gap-2 mt-2" onClick={() => setOpen(false)}>
                  <Link to="/login">
                    <Crown className="h-4 w-4" />
                    Login with LearnPool
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
