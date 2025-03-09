
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
import { ArrowRight, ArrowUp, ArrowDown, Clock, Medal, ShieldCheck, Users, Zap, Filter, Search, Trophy, Calendar, Timer } from 'lucide-react';
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
  timeRemaining?: string;
  status?: 'active' | 'completed' | 'upcoming';
  featured?: boolean;
}

// Categories
const CATEGORIES = [
  'All Categories', 'Crypto', 'Web3', 'Science', 'History', 'Geography', 
  'Anime', 'Art', 'Personality', 'Weird', 'Travel',
  'Ideas', 'Movie', 'Business', 'Pop Culture', 'AI', 
  'Books', 'Confessions'
];

// Extended mock challenges
const mockChallenges: Challenge[] = [
  {
    id: 'c1',
    title: 'Blockchain Basics',
    description: 'Test your knowledge of fundamental blockchain concepts',
    participants: 342,
    reward: 25,
    difficulty: 'easy',
    category: 'Crypto',
    timeRemaining: '2d 4h',
    status: 'active',
    featured: true
  },
  {
    id: 'c2',
    title: 'Smart Contract Deep Dive',
    description: 'Advanced questions about smart contract development',
    participants: 128,
    reward: 40,
    difficulty: 'hard',
    category: 'Web3',
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
    category: 'Crypto',
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
    category: 'Business',
    status: 'upcoming',
    timeRemaining: '3d 12h'
  },
  {
    id: 'c5',
    title: 'Layer 2 Solutions',
    description: 'Scaling technologies for blockchain networks',
    participants: 312,
    reward: 45,
    difficulty: 'hard',
    category: 'Web3',
    status: 'completed'
  },
  {
    id: 'c6',
    title: 'AI Revolution',
    description: 'The past, present and future of artificial intelligence',
    participants: 423,
    reward: 50,
    difficulty: 'medium',
    category: 'AI',
    timeRemaining: '3d 8h',
    status: 'active',
    featured: true
  },
  {
    id: 'c7',
    title: 'Ancient Civilizations',
    description: 'Explore the mysteries of ancient worlds and their technologies',
    participants: 185,
    reward: 35,
    difficulty: 'medium',
    category: 'History',
    timeRemaining: '4d 2h',
    status: 'active'
  },
  {
    id: 'c8',
    title: 'NFT Art Movement',
    description: 'Test your knowledge of digital art and NFT collections',
    participants: 276,
    reward: 30,
    difficulty: 'easy',
    category: 'Art',
    status: 'upcoming',
    timeRemaining: '5d 18h'
  },
  {
    id: 'c9',
    title: 'Space Exploration',
    description: 'From the moon landing to Mars missions and beyond',
    participants: 367,
    reward: 40,
    difficulty: 'hard',
    category: 'Science',
    timeRemaining: '9h',
    status: 'active',
    featured: true
  },
  {
    id: 'c10',
    title: 'Anime Classics',
    description: 'Test your knowledge of legendary anime series and films',
    participants: 589,
    reward: 30,
    difficulty: 'easy',
    category: 'Anime',
    status: 'completed'
  },
  {
    id: 'c11',
    title: 'Sci-Fi Movies Marathon',
    description: 'How well do you know your science fiction cinema?',
    participants: 412,
    reward: 35,
    difficulty: 'medium',
    category: 'Movie',
    status: 'upcoming',
    timeRemaining: '2d 14h'
  },
  {
    id: 'c12',
    title: 'World Geography',
    description: 'Test your knowledge of countries, capitals and landmarks',
    participants: 321,
    reward: 25,
    difficulty: 'easy',
    category: 'Geography',
    status: 'completed'
  }
];

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
      result = result.filter(challenge => challenge.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        challenge => 
          challenge.title.toLowerCase().includes(query) || 
          challenge.description.toLowerCase().includes(query) ||
          challenge.category.toLowerCase().includes(query)
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
  
  // Get featured challenges
  const featuredChallenges = mockChallenges.filter(c => c.featured);
  
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Challenges</h1>
          <p className="text-muted-foreground">Compete with others on timed quiz challenges</p>
        </div>
        <div className="flex items-center gap-2">
          <PKStarCounter pkStars={pkStars} />
          <Button asChild>
            <Link to="/challenge/create">Create Challenge</Link>
          </Button>
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
                    <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs">
                      {challenge.category}
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
