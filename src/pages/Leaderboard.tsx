
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PKStarCounter from '@/components/PKStarCounter';
import { Award, Crown, Trophy, Filter, Flame, Star } from 'lucide-react';

interface LeaderboardUser {
  id: number;
  name: string;
  avatar: string;
  pkStars: number;
  streak: number;
  badges: number;
  rank?: number;
}

const mockUsers: LeaderboardUser[] = [
  { id: 1, name: 'Sarah Patel', avatar: 'SP', pkStars: 547, streak: 12, badges: 8 },
  { id: 2, name: 'Ethan Kim', avatar: 'EK', pkStars: 482, streak: 8, badges: 6 },
  { id: 3, name: 'Maya Johnson', avatar: 'MJ', pkStars: 433, streak: 9, badges: 5 },
  { id: 4, name: 'Alex Nguyen', avatar: 'AN', pkStars: 389, streak: 5, badges: 7 },
  { id: 5, name: 'Jordan Lee', avatar: 'JL', pkStars: 356, streak: 7, badges: 4 },
  { id: 6, name: 'Taylor Rodriguez', avatar: 'TR', pkStars: 322, streak: 3, badges: 3 },
  { id: 7, name: 'Casey Williams', avatar: 'CW', pkStars: 310, streak: 4, badges: 5 },
  { id: 8, name: 'Morgan Chen', avatar: 'MC', pkStars: 295, streak: 6, badges: 4 },
  { id: 9, name: 'Riley Garcia', avatar: 'RG', pkStars: 272, streak: 2, badges: 3 },
  { id: 10, name: 'Jamie Smith', avatar: 'JS', pkStars: 248, streak: 1, badges: 2 }
].map((user, index) => ({ ...user, rank: index + 1 }));

const Leaderboard = () => {
  const [filter, setFilter] = useState('all-time');
  const [category, setCategory] = useState('all');

  return (
    <div className="container max-w-4xl mx-auto py-16 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">See who's leading in PK stars, streaks, and achievements</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pk-stars" className="mb-8">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="pk-stars" className="flex items-center gap-1">
            <Star className="h-4 w-4" /> PK Stars
          </TabsTrigger>
          <TabsTrigger value="streaks" className="flex items-center gap-1">
            <Flame className="h-4 w-4" /> Streaks
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center gap-1">
            <Award className="h-4 w-4" /> Badges
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pk-stars">
          <Card>
            <CardHeader>
              <CardTitle>Top PK Star Earners</CardTitle>
              <CardDescription>Users with the most knowledge points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockUsers.map((user, index) => (
                  <div 
                    key={user.id} 
                    className={`flex items-center justify-between ${index < 3 ? 'bg-primary/5 dark:bg-primary/10 p-3 rounded-lg border border-primary/20' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 text-center">
                        {index === 0 ? (
                          <Trophy className="h-6 w-6 text-yellow-500" />
                        ) : index === 1 ? (
                          <Trophy className="h-6 w-6 text-gray-400" />
                        ) : index === 2 ? (
                          <Trophy className="h-6 w-6 text-amber-700" />
                        ) : (
                          <span className="font-medium">{user.rank}</span>
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-medium">
                        {user.avatar}
                      </div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                    <PKStarCounter pkStars={user.pkStars} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streaks">
          <Card>
            <CardHeader>
              <CardTitle>Longest Streaks</CardTitle>
              <CardDescription>Users with the most consecutive days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[...mockUsers].sort((a, b) => b.streak - a.streak).map((user, index) => (
                  <div 
                    key={user.id} 
                    className={`flex items-center justify-between ${index < 3 ? 'bg-primary/5 dark:bg-primary/10 p-3 rounded-lg border border-primary/20' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 text-center">
                        {index === 0 ? (
                          <Crown className="h-6 w-6 text-yellow-500" />
                        ) : index === 1 ? (
                          <Crown className="h-6 w-6 text-gray-400" />
                        ) : index === 2 ? (
                          <Crown className="h-6 w-6 text-amber-700" />
                        ) : (
                          <span className="font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-medium">
                        {user.avatar}
                      </div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                    <div className="flex items-center space-x-1 bg-orange-50 dark:bg-orange-950/40 p-2 rounded-full px-4 border border-orange-200 dark:border-orange-900/50">
                      <Flame className="h-5 w-5 text-orange-500" />
                      <span className="font-medium text-orange-700 dark:text-orange-400">{user.streak} days</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges">
          <Card>
            <CardHeader>
              <CardTitle>Most Badges</CardTitle>
              <CardDescription>Users with the most achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[...mockUsers].sort((a, b) => b.badges - a.badges).map((user, index) => (
                  <div 
                    key={user.id} 
                    className={`flex items-center justify-between ${index < 3 ? 'bg-primary/5 dark:bg-primary/10 p-3 rounded-lg border border-primary/20' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 text-center">
                        {index === 0 ? (
                          <Award className="h-6 w-6 text-yellow-500" />
                        ) : index === 1 ? (
                          <Award className="h-6 w-6 text-gray-400" />
                        ) : index === 2 ? (
                          <Award className="h-6 w-6 text-amber-700" />
                        ) : (
                          <span className="font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-medium">
                        {user.avatar}
                      </div>
                      <div className="font-medium">{user.name}</div>
                    </div>
                    <div className="flex items-center space-x-1 bg-pink-50 dark:bg-pink-950/40 p-2 rounded-full px-4 border border-pink-200 dark:border-pink-900/50">
                      <Award className="h-5 w-5 text-pink-500" />
                      <span className="font-medium text-pink-700 dark:text-pink-400">{user.badges}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;
