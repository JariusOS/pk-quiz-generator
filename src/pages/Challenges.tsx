
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PKStarCounter from '@/components/PKStarCounter';
import { ArrowRight, Clock, Medal, ShieldCheck, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeRemaining?: string;
  status?: 'active' | 'completed' | 'upcoming';
}

const challenges: Challenge[] = [
  {
    id: 'c1',
    title: 'Blockchain Basics',
    description: 'Test your knowledge of fundamental blockchain concepts',
    participants: 342,
    reward: 25,
    difficulty: 'easy',
    category: 'Blockchain',
    timeRemaining: '2d 4h',
    status: 'active'
  },
  {
    id: 'c2',
    title: 'Smart Contract Deep Dive',
    description: 'Advanced questions about smart contract development',
    participants: 128,
    reward: 40,
    difficulty: 'hard',
    category: 'Smart Contracts',
    timeRemaining: '1d 6h',
    status: 'active'
  },
  {
    id: 'c3',
    title: 'DeFi Protocols',
    description: 'All about decentralized finance mechanisms',
    participants: 256,
    reward: 35,
    difficulty: 'medium',
    category: 'DeFi',
    timeRemaining: '12h',
    status: 'active'
  },
  {
    id: 'c4',
    title: 'Crypto Economics',
    description: 'Understand the economic models of cryptocurrencies',
    participants: 198,
    reward: 30,
    difficulty: 'medium',
    category: 'Economics',
    status: 'upcoming'
  },
  {
    id: 'c5',
    title: 'Layer 2 Solutions',
    description: 'Scaling technologies for blockchain networks',
    participants: 312,
    reward: 45,
    difficulty: 'hard',
    category: 'Scaling',
    status: 'completed'
  },
];

const Challenges = () => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50';
      case 'medium': return 'text-orange-500 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/50';
      case 'hard': return 'text-red-500 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Challenges</h1>
          <p className="text-muted-foreground">Compete with others on timed quiz challenges</p>
        </div>
        <Button asChild>
          <Link to="/challenge/create">Create Challenge</Link>
        </Button>
      </div>

      <div className="featured-challenge mb-12">
        <Card className="border-2 border-primary">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">Featured Challenge</div>
              <PKStarCounter pkStars={50} />
            </div>
            <CardTitle className="text-2xl mt-4">Web3 Knowledge Championship</CardTitle>
            <CardDescription>The ultimate test of your Web3 knowledge. Top 3 winners get extra rewards!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>724 Participants</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Ends in 3 days</span>
              </div>
              <div className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-primary" />
                <span>Top Prize: 100 PK Stars</span>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="text-center p-3 border rounded-lg flex-1">
                <div className="text-xl font-bold">1st</div>
                <div className="text-yellow-500">100 ★</div>
              </div>
              <div className="text-center p-3 border rounded-lg flex-1">
                <div className="text-xl font-bold">2nd</div>
                <div className="text-yellow-500">75 ★</div>
              </div>
              <div className="text-center p-3 border rounded-lg flex-1">
                <div className="text-xl font-bold">3rd</div>
                <div className="text-yellow-500">50 ★</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Enter Challenge</Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="active" className="mb-8">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.filter(c => c.status === 'active').map(challenge => (
              <Card key={challenge.id}>
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                    </div>
                    <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs">
                      {challenge.category}
                    </div>
                  </div>
                  <CardTitle>{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{challenge.participants}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{challenge.timeRemaining} left</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reward:</span>
                    <PKStarCounter pkStars={challenge.reward} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={`/challenge/${challenge.id}`}>
                      Join Challenge
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.filter(c => c.status === 'upcoming').map(challenge => (
              <Card key={challenge.id}>
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                    </div>
                    <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs">
                      {challenge.category}
                    </div>
                  </div>
                  <CardTitle>{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{challenge.participants}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Starting soon</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reward:</span>
                    <PKStarCounter pkStars={challenge.reward} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link to={`/challenge/${challenge.id}`}>
                      Get Notified
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.filter(c => c.status === 'completed').map(challenge => (
              <Card key={challenge.id} className="opacity-80">
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                    </div>
                    <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs">
                      {challenge.category}
                    </div>
                  </div>
                  <CardTitle>{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{challenge.participants}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Completed</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reward:</span>
                    <PKStarCounter pkStars={challenge.reward} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link to={`/challenge/${challenge.id}/results`}>
                      View Results <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Challenges;
