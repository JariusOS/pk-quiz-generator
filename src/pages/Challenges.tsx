
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import PKStarCounter from '@/components/PKStarCounter';
import { ArrowRight, ArrowUp, ArrowDown, Clock, Flag, Medal, ShieldCheck, Users, Zap, Filter, Search, Trophy, Calendar, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';

interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[]; // Multiple tags (1-3)
  timeRemaining?: string;
  status?: 'active' | 'completed' | 'upcoming';
  featured?: boolean;
  isMarathon?: boolean;
  marathonAnchor?: string;
  nextMarathonTime?: string;
}

// Categories
const CATEGORIES = [
  'All Categories', 'Crypto', 'Web3', 'Science', 'History', 'Geography', 
  'Anime', 'Art', 'Personality', 'Weird', 'Travel',
  'Ideas', 'Movie', 'Business', 'Pop Culture', 'AI', 
  'Books', 'Confessions'
];

// Extended mock challenges with creative names based on tags
const mockChallenges: Challenge[] = [
  {
    id: 'c1',
    title: 'Crypto Time Machine',
    description: 'Test your knowledge of fundamental blockchain concepts through time',
    participants: 342,
    reward: 25,
    difficulty: 'easy',
    category: 'Crypto',
    tags: ['Crypto', 'History'],
    timeRemaining: '2d 4h',
    status: 'active',
    featured: true
  },
  {
    id: 'c2',
    title: 'Decentralized Dreamer',
    description: 'Advanced questions about smart contract development and blockchain visions',
    participants: 128,
    reward: 40,
    difficulty: 'hard',
    category: 'Web3',
    tags: ['Web3', 'Crypto', 'Ideas'],
    timeRemaining: '1d 6h',
    status: 'active'
  },
  {
    id: 'c3',
    title: 'HODL Historian',
    description: 'All about decentralized finance mechanisms through economic history',
    participants: 256,
    reward: 35,
    difficulty: 'medium',
    category: 'Crypto',
    tags: ['Crypto', 'History', 'Business'],
    timeRemaining: '12h',
    status: 'active'
  },
  {
    id: 'c4',
    title: 'Cinematic Trader',
    description: 'Understand the economic models of cryptocurrencies as portrayed in films',
    participants: 198,
    reward: 30,
    difficulty: 'medium',
    category: 'Business',
    tags: ['Business', 'Crypto', 'Movie'],
    status: 'upcoming',
    timeRemaining: '3d 12h'
  },
  {
    id: 'c5',
    title: 'Metaverse Voyager',
    description: 'Scaling technologies for blockchain networks and virtual worlds',
    participants: 312,
    reward: 45,
    difficulty: 'hard',
    category: 'Web3',
    tags: ['Web3', 'Travel', 'AI'],
    status: 'completed'
  },
  {
    id: 'c6',
    title: 'Silicon Sage',
    description: 'The past, present and future of artificial intelligence and scientific breakthroughs',
    participants: 423,
    reward: 50,
    difficulty: 'medium',
    category: 'AI',
    tags: ['AI', 'Science', 'Books'],
    timeRemaining: '3d 8h',
    status: 'active',
    featured: true
  },
  {
    id: 'c7',
    title: 'Time-Traveling Otaku',
    description: 'Explore the historical connections between anime and ancient worlds',
    participants: 185,
    reward: 35,
    difficulty: 'medium',
    category: 'History',
    tags: ['History', 'Anime'],
    timeRemaining: '4d 2h',
    status: 'active'
  },
  {
    id: 'c8',
    title: 'Abstract Soul',
    description: 'Test your knowledge of digital art and personality types of famous artists',
    participants: 276,
    reward: 30,
    difficulty: 'easy',
    category: 'Art',
    tags: ['Art', 'Personality'],
    status: 'upcoming',
    timeRemaining: '5d 18h'
  },
  {
    id: 'c9',
    title: 'Space Nomad',
    description: 'From the moon landing to Mars missions and space travel discoveries',
    participants: 367,
    reward: 40,
    difficulty: 'hard',
    category: 'Science',
    tags: ['Science', 'Geography', 'Travel'],
    timeRemaining: '9h',
    status: 'active',
    featured: true
  },
  {
    id: 'c10',
    title: 'Netflixer',
    description: 'Test your knowledge of legendary anime series and popular streaming movies',
    participants: 589,
    reward: 30,
    difficulty: 'easy',
    category: 'Anime',
    tags: ['Anime', 'Movie'],
    status: 'completed'
  },
  {
    id: 'c11',
    title: 'Dystopian Visionary',
    description: 'How well do you know your science fiction cinema and futuristic concepts?',
    participants: 412,
    reward: 35,
    difficulty: 'medium',
    category: 'Movie',
    tags: ['Movie', 'AI', 'Ideas'],
    status: 'upcoming',
    timeRemaining: '2d 14h'
  },
  {
    id: 'c12',
    title: 'Earth Maestro',
    description: 'Test your knowledge of countries, capitals and travel landmarks',
    participants: 321,
    reward: 25,
    difficulty: 'easy',
    category: 'Geography',
    tags: ['Geography', 'Travel'],
    status: 'completed'
  }
];

// New: Marathon Challenge
const marathonChallenge: Challenge = {
  id: 'marathon-1',
  title: 'General Knowledge Marathon',
  description: 'A 15-minute marathon of unlimited questions across all categories. How many can you answer correctly?',
  participants: 756,
  reward: 100,
  difficulty: 'medium',
  category: 'All Categories',
  tags: ['Marathon', 'Mixed', 'General Knowledge'],
  timeRemaining: 'Always Available',
  status: 'active',
  isMarathon: true,
  marathonAnchor: 'Dr. Alex Kingston',
  nextMarathonTime: '2h 45m'
};

const Challenges = () => {
  // State for filters and sorting
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [pkStars, setPkStars] = useLocalStorage<number>('pkStars', 10);
  
  // Filtered and sorted challenges
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>(mockChallenges);
  
  // Filter and sort challenges whenever filter criteria change
  useEffect(() => {
    let result = [...mockChallenges];
    
    // Apply category filter
    if (selectedCategory !== 'All Categories') {
      result = result.filter(challenge => 
        challenge.category === selectedCategory || 
        challenge.tags.includes(selectedCategory)
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        challenge => 
          challenge.title.toLowerCase().includes(query) || 
          challenge.description.toLowerCase().includes(query) ||
          challenge.category.toLowerCase().includes(query) ||
          challenge.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        // No need to sort as we assume the default order is newest first
        break;
      case 'reward-high':
        result.sort((a, b) => b.reward - a.reward);
        break;
      case 'reward-low':
        result.sort((a, b) => a.reward - b.reward);
        break;
      case 'participants-high':
        result.sort((a, b) => b.participants - a.participants);
        break;
      case 'difficulty-high':
        result.sort((a, b) => {
          const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
          return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
        });
        break;
      case 'difficulty-low':
        result.sort((a, b) => {
          const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        });
        break;
    }
    
    setFilteredChallenges(result);
  }, [selectedCategory, searchQuery, sortBy]);
  
  // Function to get the appropriate style for difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50';
      case 'medium': return 'text-orange-500 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/50';
      case 'hard': return 'text-red-500 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50';
      default: return '';
    }
  };
  
  // Handler for notification sign up
  const handleNotification = (id: string) => {
    toast({
      title: "Notification Set",
      description: "You'll be notified when this challenge starts.",
    });
  };

  // Handler for creating challenge
  const handleCreateChallenge = () => {
    if (pkStars < 10) {
      toast({
        title: "Insufficient PK Stars",
        description: "You need at least 10 PK stars to create a challenge.",
        variant: "destructive"
      });
      return;
    }

    // Deduct 10 stars
    setPkStars(pkStars - 10);
    
    // Navigate to create challenge page
    window.location.href = "/challenge/create";
  };

  // Handler for creating marathon
  const handleCreateMarathon = () => {
    if (pkStars < 100) {
      toast({
        title: "Insufficient PK Stars",
        description: "You need at least 100 PK stars to create a marathon challenge.",
        variant: "destructive"
      });
      return;
    }

    // Deduct 100 stars
    setPkStars(pkStars - 100);
    
    // Navigate to create challenge page with marathon param
    window.location.href = "/challenge/create?type=marathon";
  };
  
  // Get featured challenges
  const featuredChallenges = mockChallenges.filter(c => c.featured);
  
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">PK Challenges</h1>
        <p className="text-muted-foreground mb-6">Compete with others on timed quiz challenges from the learnpool platform</p>
        
        <div className="bg-muted/30 p-6 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <p className="text-sm md:text-base">
                The Learnpool PK Hub is an exciting extension of the LearnPool ISO platform, designed to make learning of public knowledge interactive and competitive. Create and join timed quizzes across various topics, answer fast-paced questions, and earn PK stars for your achievements. Schedule upcoming challenges, track your progress, and stay ahead in the ultimate pk showdown! Start your journey by submitting to the platform at pk.learnpool.fun.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center justify-between">
                <PKStarCounter pkStars={pkStars} />
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={handleCreateChallenge}>
                  Create Challenge (10 ★)
                </Button>
                <Button variant="outline" onClick={handleCreateMarathon} className="whitespace-nowrap">
                  <Flag className="mr-2 h-4 w-4" />
                  Create Marathon (100 ★)
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {featuredChallenges.length > 0 && (
        <div className="featured-challenges mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Challenges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredChallenges.map(challenge => (
              <Card key={challenge.id} className="border-2 border-primary">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">Featured</div>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {challenge.tags.map((tag, index) => (
                        <div key={tag} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs">
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                  <CardTitle className="text-xl mt-4">{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span>{challenge.participants} Participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span>Ends in {challenge.timeRemaining}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      <span>{challenge.reward} PK Stars</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Timer className="h-5 w-5 text-primary" />
                      <span>{challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={`/challenge/${challenge.id}`}>
                      Enter Challenge
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* New: Marathon Challenge */}
      <div className="marathon-challenge mb-12">
        <h2 className="text-2xl font-bold mb-6">General Marathon Challenge</h2>
        <Card className="border-2 border-primary/70 bg-gradient-to-br from-primary/5 to-primary/0">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">Marathon</div>
              <div className="flex flex-wrap gap-1 justify-end">
                {marathonChallenge.tags.map((tag) => (
                  <div key={tag} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
            <CardTitle className="text-xl mt-4">{marathonChallenge.title}</CardTitle>
            <CardDescription>{marathonChallenge.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-background/80 p-4 rounded-lg border border-border">
                <div className="text-center mb-2">
                  <span className="text-sm text-muted-foreground">Next Marathon with</span>
                  <h3 className="text-lg font-bold">{marathonChallenge.marathonAnchor}</h3>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg text-center">
                  <span className="text-sm text-muted-foreground block mb-1">Starts in</span>
                  <span className="text-2xl font-mono font-bold text-primary">{marathonChallenge.nextMarathonTime}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>{marathonChallenge.participants} Participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>15 min countdown</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span>Up to {marathonChallenge.reward} PK Stars</span>
                </div>
                <div className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-primary" />
                  <span>Unlimited Questions</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to={`/challenge/${marathonChallenge.id}`}>
                Start Marathon Challenge
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="filters mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search challenges"
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="reward-high">Highest Reward</SelectItem>
              <SelectItem value="reward-low">Lowest Reward</SelectItem>
              <SelectItem value="participants-high">Most Popular</SelectItem>
              <SelectItem value="difficulty-high">Hardest First</SelectItem>
              <SelectItem value="difficulty-low">Easiest First</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2" onClick={() => { setSearchQuery(''); setSelectedCategory('All Categories'); setSortBy('newest'); }}>
            <Filter className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="mb-8">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {filteredChallenges.filter(c => c.status === 'active').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.filter(c => c.status === 'active').map(challenge => (
                <Card key={challenge.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                      </div>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {challenge.tags.map((tag) => (
                          <div key={tag} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs">
                            {tag}
                          </div>
                        ))}
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
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No active challenges match your filters</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming">
          {filteredChallenges.filter(c => c.status === 'upcoming').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.filter(c => c.status === 'upcoming').map(challenge => (
                <Card key={challenge.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                      </div>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {challenge.tags.map((tag) => (
                          <div key={tag} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs">
                            {tag}
                          </div>
                        ))}
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
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Starting in {challenge.timeRemaining}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Reward:</span>
                      <PKStarCounter pkStars={challenge.reward} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => handleNotification(challenge.id)}>
                      Get Notified
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No upcoming challenges match your filters</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {filteredChallenges.filter(c => c.status === 'completed').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.filter(c => c.status === 'completed').map(challenge => (
                <Card key={challenge.id} className="opacity-80">
                  <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                      </div>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {challenge.tags.map((tag) => (
                          <div key={tag} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs">
                            {tag}
                          </div>
                        ))}
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
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No completed challenges match your filters</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Challenges;
