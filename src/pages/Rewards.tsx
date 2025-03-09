
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PKStarCounter from '@/components/PKStarCounter';
import { Award, Books, BookOpen, CheckCircle, Clock, Coffee, Gift, GraduationCap, Headphones, LucideIcon, Map, Podcast, ShoppingBag, Ticket, User, Video, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  image: string;
  category: 'digital' | 'physical' | 'experience';
  featured?: boolean;
  eligible?: boolean;
}

const rewards: Reward[] = [
  // Digital rewards (lower to mid tier)
  {
    id: 'r1',
    title: 'Premium Account (1 Month)',
    description: 'Get access to all premium features for one month',
    cost: 1000,
    image: 'crown',
    category: 'digital',
    featured: true
  },
  {
    id: 'r2',
    title: 'Custom Discord Role',
    description: 'Get a special role in the LearnPool Discord server',
    cost: 750,
    image: 'discord',
    category: 'digital'
  },
  {
    id: 'r3',
    title: 'Exclusive E-book Collection',
    description: 'A curated collection of educational e-books',
    cost: 1500,
    image: 'book',
    category: 'digital'
  },
  {
    id: 'r4',
    title: 'Custom Profile Theme',
    description: 'Personalize your LearnPool profile with exclusive themes',
    cost: 500,
    image: 'theme',
    category: 'digital'
  },
  {
    id: 'r5',
    title: 'Advanced Question Generator',
    description: 'Generate more complex and customizable questions',
    cost: 2000,
    image: 'generator',
    category: 'digital'
  },
  
  // Physical rewards (mid tier)
  {
    id: 'r6',
    title: 'LearnPool T-Shirt',
    description: 'High-quality t-shirt with the LearnPool logo',
    cost: 2500,
    image: 'tshirt',
    category: 'physical'
  },
  {
    id: 'r7',
    title: 'Coffee Mug',
    description: 'LearnPool branded coffee mug',
    cost: 1500,
    image: 'mug',
    category: 'physical'
  },
  {
    id: 'r8',
    title: 'Learning Journal',
    description: 'Premium notebook with learning templates and guides',
    cost: 2000,
    image: 'journal',
    category: 'physical'
  },
  {
    id: 'r9',
    title: 'Amazon Gift Card ($25)',
    description: 'Gift card to purchase educational materials',
    cost: 3000,
    image: 'gift-card',
    category: 'physical'
  },
  {
    id: 'r10',
    title: 'Learning Kit Bundle',
    description: 'Complete set of LearnPool branded notebooks, pens, and planners',
    cost: 4000,
    image: 'kit',
    category: 'physical',
    featured: true
  },
  
  // Experience rewards (high tier)
  {
    id: 'r11',
    title: 'Mentorship Session',
    description: '30-minute mentorship session with a LearnPool expert',
    cost: 5000,
    image: 'mentorship',
    category: 'experience',
    featured: true
  },
  {
    id: 'r12',
    title: 'Exclusive Webinar Access',
    description: 'Access to premium educational webinars for 3 months',
    cost: 7500,
    image: 'webinar',
    category: 'experience'
  },
  {
    id: 'r13',
    title: 'Educational Conference Ticket',
    description: 'Ticket to a major educational tech conference (travel not included)',
    cost: 15000,
    image: 'conference',
    category: 'experience'
  },
  {
    id: 'r14',
    title: 'Personalized Learning Plan',
    description: 'Customized learning roadmap created by educational experts',
    cost: 6000,
    image: 'plan',
    category: 'experience'
  },
  {
    id: 'r15',
    title: 'Study Retreat Weekend',
    description: 'Weekend retreat focused on intensive learning in your field',
    cost: 12000,
    image: 'retreat',
    category: 'experience',
    featured: true
  }
];

const getRewardIcon = (image: string) => {
  switch (image) {
    case 'crown': return <User className="h-10 w-10 text-primary" />;
    case 'tshirt': return <ShoppingBag className="h-10 w-10 text-blue-500" />;
    case 'discord': return <Headphones className="h-10 w-10 text-indigo-500" />;
    case 'mentorship': return <GraduationCap className="h-10 w-10 text-green-500" />;
    case 'mug': return <Coffee className="h-10 w-10 text-amber-500" />;
    case 'book': return <BookOpen className="h-10 w-10 text-purple-500" />;
    case 'theme': return <Zap className="h-10 w-10 text-yellow-500" />;
    case 'generator': return <Gift className="h-10 w-10 text-pink-500" />;
    case 'journal': return <Books className="h-10 w-10 text-cyan-500" />;
    case 'gift-card': return <Gift className="h-10 w-10 text-red-500" />;
    case 'kit': return <ShoppingBag className="h-10 w-10 text-indigo-500" />;
    case 'webinar': return <Video className="h-10 w-10 text-blue-500" />;
    case 'conference': return <Ticket className="h-10 w-10 text-green-500" />;
    case 'plan': return <Map className="h-10 w-10 text-teal-500" />;
    case 'retreat': return <Map className="h-10 w-10 text-orange-500" />;
    default: return <Gift className="h-10 w-10 text-primary" />;
  }
};

const Rewards = () => {
  const [userPkStars, setUserPkStars] = useState(185);
  const [eligibleRewards, setEligibleRewards] = useState<Reward[]>([]);
  
  // Check which rewards the user can afford
  useEffect(() => {
    const eligible = rewards
      .filter(reward => userPkStars >= reward.cost)
      .map(reward => ({ ...reward, eligible: true }))
      .slice(0, 3); // Show top 3 eligible rewards
    
    setEligibleRewards(eligible);
  }, [userPkStars]);
  
  const handleRedeemReward = (reward: Reward) => {
    if (userPkStars >= reward.cost) {
      toast({
        title: "Reward Redeemed!",
        description: `You've successfully redeemed: ${reward.title}`,
      });
    } else {
      toast({
        title: "Not enough PK Stars",
        description: `You need ${reward.cost - userPkStars} more PK stars to redeem this reward`,
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Rewards Program</h1>
          <p className="text-muted-foreground">Redeem your PK stars for exclusive rewards</p>
        </div>
        <PKStarCounter pkStars={userPkStars} />
      </div>

      {eligibleRewards.length > 0 && (
        <Card className="mb-12 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Rewards You Can Redeem Now</CardTitle>
            <CardDescription>Based on your current PK Star balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {eligibleRewards.map(reward => (
                <Card key={reward.id} className="border-primary/20">
                  <CardHeader className="pb-0">
                    <div className="mb-4 w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      {getRewardIcon(reward.image)}
                    </div>
                    <CardTitle>{reward.title}</CardTitle>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="text-muted-foreground text-sm">Cost:</div>
                      <PKStarCounter pkStars={reward.cost} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => handleRedeemReward(reward)} 
                      className="w-full"
                    >
                      Redeem Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/0 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Earning PK Stars</CardTitle>
            <CardDescription>Several ways to increase your PK star balance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-full p-2">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Answer Questions Correctly</h3>
                <p className="text-sm text-muted-foreground">Earn 1 PK star for each correct answer in quizzes</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-full p-2">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Daily Streak Bonus</h3>
                <p className="text-sm text-muted-foreground">Earn bonus stars for consecutively active days</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-full p-2">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Refer Friends</h3>
                <p className="text-sm text-muted-foreground">Get 10 PK stars for each friend who joins</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-primary/10 rounded-full p-2">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Participate in Challenges</h3>
                <p className="text-sm text-muted-foreground">Win challenges to earn significant PK star rewards</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Your Progress</CardTitle>
            <CardDescription>Track your reward redemption progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Premium Account</span>
                <span className="text-sm text-muted-foreground">{userPkStars}/1000</span>
              </div>
              <Progress value={(userPkStars / 1000) * 100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">LearnPool T-Shirt</span>
                <span className="text-sm text-muted-foreground">{userPkStars}/2500</span>
              </div>
              <Progress value={(userPkStars / 2500) * 100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Mentorship Session</span>
                <span className="text-sm text-muted-foreground">{userPkStars}/5000</span>
              </div>
              <Progress value={(userPkStars / 5000) * 100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Educational Conference</span>
                <span className="text-sm text-muted-foreground">{userPkStars}/15000</span>
              </div>
              <Progress value={(userPkStars / 15000) * 100} className="h-2" />
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/quiz">
                Take More Quizzes
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all">All Rewards</TabsTrigger>
          <TabsTrigger value="digital">Digital</TabsTrigger>
          <TabsTrigger value="physical">Physical</TabsTrigger>
          <TabsTrigger value="experience">Experiences</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map(reward => (
              <Card key={reward.id} className={reward.featured ? 'border-primary/50' : ''}>
                {reward.featured && (
                  <div className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 absolute top-2 right-2 rounded-full">
                    Featured
                  </div>
                )}
                <CardHeader className="pb-0">
                  <div className="mb-4 w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    {getRewardIcon(reward.image)}
                  </div>
                  <CardTitle>{reward.title}</CardTitle>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-sm">Cost:</div>
                    <PKStarCounter pkStars={reward.cost} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleRedeemReward(reward)} 
                    disabled={userPkStars < reward.cost}
                    className="w-full"
                    variant={userPkStars >= reward.cost ? "default" : "outline"}
                  >
                    {userPkStars >= reward.cost ? "Redeem Reward" : `Need ${reward.cost - userPkStars} more stars`}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="digital">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.filter(r => r.category === 'digital').map(reward => (
              <Card key={reward.id} className={reward.featured ? 'border-primary/50' : ''}>
                {reward.featured && (
                  <div className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 absolute top-2 right-2 rounded-full">
                    Featured
                  </div>
                )}
                <CardHeader className="pb-0">
                  <div className="mb-4 w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    {getRewardIcon(reward.image)}
                  </div>
                  <CardTitle>{reward.title}</CardTitle>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-sm">Cost:</div>
                    <PKStarCounter pkStars={reward.cost} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleRedeemReward(reward)} 
                    disabled={userPkStars < reward.cost}
                    className="w-full"
                    variant={userPkStars >= reward.cost ? "default" : "outline"}
                  >
                    {userPkStars >= reward.cost ? "Redeem Reward" : `Need ${reward.cost - userPkStars} more stars`}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="physical">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.filter(r => r.category === 'physical').map(reward => (
              <Card key={reward.id} className={reward.featured ? 'border-primary/50' : ''}>
                {reward.featured && (
                  <div className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 absolute top-2 right-2 rounded-full">
                    Featured
                  </div>
                )}
                <CardHeader className="pb-0">
                  <div className="mb-4 w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    {getRewardIcon(reward.image)}
                  </div>
                  <CardTitle>{reward.title}</CardTitle>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-sm">Cost:</div>
                    <PKStarCounter pkStars={reward.cost} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleRedeemReward(reward)} 
                    disabled={userPkStars < reward.cost}
                    className="w-full"
                    variant={userPkStars >= reward.cost ? "default" : "outline"}
                  >
                    {userPkStars >= reward.cost ? "Redeem Reward" : `Need ${reward.cost - userPkStars} more stars`}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="experience">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.filter(r => r.category === 'experience').map(reward => (
              <Card key={reward.id} className={reward.featured ? 'border-primary/50' : ''}>
                {reward.featured && (
                  <div className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 absolute top-2 right-2 rounded-full">
                    Featured
                  </div>
                )}
                <CardHeader className="pb-0">
                  <div className="mb-4 w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    {getRewardIcon(reward.image)}
                  </div>
                  <CardTitle>{reward.title}</CardTitle>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground text-sm">Cost:</div>
                    <PKStarCounter pkStars={reward.cost} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleRedeemReward(reward)} 
                    disabled={userPkStars < reward.cost}
                    className="w-full"
                    variant={userPkStars >= reward.cost ? "default" : "outline"}
                  >
                    {userPkStars >= reward.cost ? "Redeem Reward" : `Need ${reward.cost - userPkStars} more stars`}
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

export default Rewards;
