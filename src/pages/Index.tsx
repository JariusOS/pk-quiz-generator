import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Award, Clock, Crown, Flame, Gift, Lightbulb, Star, Trophy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import PKStarCounter from '@/components/PKStarCounter';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>("Proof of Stake");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleDailyChallengeSubmit = () => {
    if (selectedAnswer === "Proof of Stake") {
      toast({
        title: "Correct!",
        description: "You've earned 5 PK stars for today's challenge.",
      });
    } else {
      toast({
        title: "Incorrect",
        description: "The correct answer was Proof of Stake.",
        variant: "destructive",
      });
    }
    setHasSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      <section className="px-4 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 -z-10"></div>
        <div className="container mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center rounded-full border border-border bg-background/50 px-3 py-1 text-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                <span className="text-foreground/80">LearnPool MCQ Generator</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                Test Your Knowledge with LearnPool Quizzes
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                Challenge yourself with dynamically generated questions from LearnPool's Public Knowledge database.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="text-lg px-8 h-12 gap-2">
                  <Link to="/quiz">
                    Start Quiz <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 h-12 gap-2">
                  <Link to="/login">
                    <Crown className="h-5 w-5" />
                    Login with LearnPool
                  </Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>10K+ Active Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span>500+ Challenges</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Earn PK Stars</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-border bg-card p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Daily Challenge</h3>
                  <p className="text-muted-foreground">Complete for bonus PK stars!</p>
                </div>
                <PKStarCounter pkStars={25} />
              </div>
              <div className="mb-4">
                <h4 className="font-medium text-lg mb-2">What consensus mechanism does Ethereum currently use?</h4>
              </div>
              <div className="space-y-4">
                <div 
                  className={`quiz-option ${selectedAnswer === "Proof of Stake" ? "selected" : ""}`}
                  onClick={() => !hasSubmitted && setSelectedAnswer("Proof of Stake")}
                >
                  <div className="flex items-center justify-between">
                    <span>Proof of Stake</span>
                    {selectedAnswer === "Proof of Stake" && <span className="text-primary">Selected</span>}
                  </div>
                </div>
                <div 
                  className={`quiz-option ${selectedAnswer === "Proof of Work" ? "selected" : ""}`}
                  onClick={() => !hasSubmitted && setSelectedAnswer("Proof of Work")}
                >
                  <div className="flex items-center">
                    <span>Proof of Work</span>
                  </div>
                </div>
                <div 
                  className={`quiz-option ${selectedAnswer === "Delegated Proof of Stake" ? "selected" : ""}`}
                  onClick={() => !hasSubmitted && setSelectedAnswer("Delegated Proof of Stake")}
                >
                  <div className="flex items-center">
                    <span>Delegated Proof of Stake</span>
                  </div>
                </div>
                <div 
                  className={`quiz-option ${selectedAnswer === "Proof of Authority" ? "selected" : ""}`}
                  onClick={() => !hasSubmitted && setSelectedAnswer("Proof of Authority")}
                >
                  <div className="flex items-center">
                    <span>Proof of Authority</span>
                  </div>
                </div>
              </div>
              <Button 
                className="w-full mt-6" 
                onClick={handleDailyChallengeSubmit}
                disabled={hasSubmitted}
              >
                {hasSubmitted ? "Submitted" : "Submit Answer"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-24">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Enhanced Quiz Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our unique approach to learning combines knowledge testing with gamification and community engagement.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Flame className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Daily Streak Rewards</CardTitle>
              <CardDescription>
                Answer questions daily to maintain your streak and earn bonus PK stars.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`h-2 w-8 rounded-full ${i < 3 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                  ))}
                </div>
                <div className="ml-2">
                  <span className="text-xl font-bold">3</span>
                  <span className="text-sm text-muted-foreground ml-1">days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-4 h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <CardTitle>Timed Questions</CardTitle>
              <CardDescription>
                Race against the clock! Faster answers earn you more PK stars.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-secondary rounded-full h-2.5 mb-2">
                <div className="bg-orange-500 h-2.5 rounded-full w-2/3"></div>
              </div>
              <div className="text-right font-mono text-sm">00:15</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-4 h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <CardTitle>Challenge Mode</CardTitle>
              <CardDescription>
                Challenge friends or random players to a live quiz duel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">J</div>
                  <span className="ml-2">You</span>
                </div>
                <div className="font-bold">VS</div>
                <div className="flex items-center">
                  <span className="mr-2">Alex</span>
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">A</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-4 h-12 w-12 rounded-lg bg-pink-500/10 flex items-center justify-center">
                <Award className="h-6 w-6 text-pink-500" />
              </div>
              <CardTitle>Milestone Badges</CardTitle>
              <CardDescription>
                Earn achievements for completing quizzes and mastering categories.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-gold-gradient mx-auto mb-2 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-yellow-900" />
                  </div>
                  <span className="text-xs">Master</span>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-2 flex items-center justify-center opacity-50">
                    <Flame className="h-6 w-6 text-gray-500" />
                  </div>
                  <span className="text-xs">Streak</span>
                </div>
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto mb-2 flex items-center justify-center opacity-50">
                    <Lightbulb className="h-6 w-6 text-gray-500" />
                  </div>
                  <span className="text-xs">Genius</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-4 h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-blue-500" />
              </div>
              <CardTitle>Live Leaderboard</CardTitle>
              <CardDescription>
                Compete with others and see who has the most knowledge.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="font-bold mr-2">1.</span>
                    <span>Sarah P.</span>
                  </div>
                  <PKStarCounter pkStars={547} />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="font-bold mr-2">2.</span>
                    <span>Ethan K.</span>
                  </div>
                  <PKStarCounter pkStars={482} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-4 h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Gift className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle>Affiliate Program</CardTitle>
              <CardDescription>
                Earn PK stars by referring friends who sign up and play.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm">Your referrals: <span className="font-bold">12</span></div>
                <div className="text-sm">Stars earned: <span className="font-bold text-yellow-500">120 ★</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-muted/50 py-24">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Challenge Yourself?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start answering questions, earn PK stars, and climb the leaderboard today.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild className="text-lg px-8 h-12">
              <Link to="/quiz">
                Start Quiz
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 h-12">
              <Link to="/login">
                Login with LearnPool
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
