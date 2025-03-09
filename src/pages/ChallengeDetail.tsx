import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Trophy, Users, BookOpen, ArrowLeft, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import PKStarCounter from "@/components/PKStarCounter";

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  participants: number;
  startDate: string;
  endDate: string;
  reward: number;
  questions: Question[];
  leaderboard: Participant[];
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
  userAnswer?: number;
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  score: number;
  completedAt?: string;
}

const ChallengeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [userParticipating, setUserParticipating] = useState(false);
  const [userCompleted, setUserCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [timeLeftPercentage, setTimeLeftPercentage] = useState(0);
  
  useEffect(() => {
    // In a real app, fetch the challenge data from an API
    const mockChallenge: Challenge = {
      id: id || "1",
      title: "JavaScript Fundamentals Challenge",
      description: "Test your knowledge of JavaScript fundamentals including variables, functions, objects, and more. Complete all questions to earn PK stars and climb the leaderboard!",
      category: "Programming",
      difficulty: "intermediate",
      participants: 128,
      startDate: "2023-06-01T00:00:00Z",
      endDate: "2023-07-01T00:00:00Z",
      reward: 500,
      questions: [
        {
          id: "q1",
          text: "Which of the following is NOT a JavaScript data type?",
          options: ["String", "Boolean", "Float", "Symbol"],
          correctOption: 2,
          userAnswer: 2
        },
        {
          id: "q2",
          text: "What will console.log(typeof []) output?",
          options: ["array", "object", "undefined", "null"],
          correctOption: 1,
          userAnswer: 1
        },
        {
          id: "q3",
          text: "Which method is used to add elements to the end of an array?",
          options: ["push()", "append()", "add()", "insert()"],
          correctOption: 0,
          userAnswer: 0
        },
        {
          id: "q4",
          text: "What does the '===' operator do?",
          options: [
            "Checks for equality, but not type",
            "Checks for equality, including type",
            "Assigns a value",
            "Checks if a value exists"
          ],
          correctOption: 1
        },
        {
          id: "q5",
          text: "Which function is used to parse a string to an integer?",
          options: ["Integer.parse()", "parseInteger()", "parseInt()", "Number.parseInt()"],
          correctOption: 2
        }
      ],
      leaderboard: [
        {
          id: "u1",
          name: "Alex Johnson",
          avatar: "/avatars/alex.png",
          score: 500,
          completedAt: "2023-06-05T14:23:01Z"
        },
        {
          id: "u2",
          name: "Maria Garcia",
          avatar: "/avatars/maria.png",
          score: 480,
          completedAt: "2023-06-02T09:45:22Z"
        },
        {
          id: "u3",
          name: "Sam Taylor",
          avatar: "/avatars/sam.png",
          score: 450,
          completedAt: "2023-06-03T16:12:45Z"
        },
        {
          id: "u4",
          name: "Jamie Smith",
          avatar: "/avatars/jamie.png",
          score: 430,
          completedAt: "2023-06-04T11:34:19Z"
        },
        {
          id: "u5",
          name: "Taylor Wong",
          avatar: "/avatars/taylor.png",
          score: 410,
          completedAt: "2023-06-01T08:56:33Z"
        }
      ]
    };
    
    setChallenge(mockChallenge);
    setUserParticipating(true);
    setUserCompleted(mockChallenge.questions.every(q => q.userAnswer !== undefined));
    
    // Calculate time left
    const now = new Date();
    const end = new Date(mockChallenge.endDate);
    const total = end.getTime() - now.getTime();
    
    if (total <= 0) {
      setTimeLeft("Challenge ended");
      setTimeLeftPercentage(100);
    } else {
      const days = Math.floor(total / (1000 * 60 * 60 * 24));
      const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      setTimeLeft(`${days}d ${hours}h remaining`);
      
      // Calculate percentage of time elapsed
      const start = new Date(mockChallenge.startDate);
      const totalDuration = end.getTime() - start.getTime();
      const elapsed = now.getTime() - start.getTime();
      const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
      setTimeLeftPercentage(percentage);
    }
  }, [id]);
  
  if (!challenge) {
    return <div className="container py-16">Loading challenge...</div>;
  }
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "intermediate": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "advanced": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };
  
  const getAnswerStatus = (question: Question, index: number) => {
    if (question.userAnswer === undefined) return <HelpCircle className="h-5 w-5 text-gray-400" />;
    if (question.userAnswer === question.correctOption) return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };
  
  return (
    <div className="container py-16">
      <Link to="/challenges" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Challenges
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{challenge.title}</CardTitle>
                  <CardDescription className="mt-2">{challenge.description}</CardDescription>
                </div>
                <PKStarCounter pkStars={challenge.reward} />
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {challenge.category}
                </Badge>
                <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between gap-6 mb-6">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm text-muted-foreground">{challenge.participants} Participants</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm text-muted-foreground">{timeLeft}</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm text-muted-foreground">{challenge.reward} PK Stars Reward</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{timeLeftPercentage.toFixed(0)}%</span>
                </div>
                <Progress 
                  value={timeLeftPercentage} 
                  className="h-3 bg-secondary"
                />
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6 pt-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Challenge Details</h3>
                    <p className="text-muted-foreground">
                      This challenge tests your knowledge of JavaScript fundamentals. You'll need to answer questions about
                      variables, functions, objects, arrays, and more. Complete all questions correctly to earn the maximum
                      reward of {challenge.reward} PK Stars.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Rules</h3>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li>You must complete all questions to be eligible for rewards</li>
                      <li>Higher scores are achieved by answering more questions correctly</li>
                      <li>You can attempt each question only once</li>
                      <li>The challenge ends on {new Date(challenge.endDate).toLocaleDateString()}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Rewards</h3>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      <li>1st Place: {challenge.reward} PK Stars</li>
                      <li>2nd Place: {Math.floor(challenge.reward * 0.8)} PK Stars</li>
                      <li>3rd Place: {Math.floor(challenge.reward * 0.6)} PK Stars</li>
                      <li>Completion: {Math.floor(challenge.reward * 0.3)} PK Stars</li>
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="questions" className="pt-4">
                  <div className="space-y-6">
                    {challenge.questions.map((question, qIndex) => (
                      <Card key={question.id} className="border border-border">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base font-medium">
                              {qIndex + 1}. {question.text}
                            </CardTitle>
                            {getAnswerStatus(question, qIndex)}
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <div className="grid gap-2">
                            {question.options.map((option, oIndex) => (
                              <div 
                                key={oIndex}
                                className={`
                                  p-3 rounded-md border flex items-center
                                  ${question.userAnswer === undefined ? 'border-border' : 
                                    question.correctOption === oIndex ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 
                                    question.userAnswer === oIndex ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : 'border-border'}
                                `}
                              >
                                <div className="mr-3 flex h-5 w-5 items-center justify-center rounded-full border">
                                  {String.fromCharCode(65 + oIndex)}
                                </div>
                                <div>{option}</div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter>
              {!userParticipating ? (
                <Button className="w-full">Join Challenge</Button>
              ) : userCompleted ? (
                <Button disabled className="w-full">Challenge Completed</Button>
              ) : (
                <Button className="w-full">Continue Challenge</Button>
              )}
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
              <CardDescription>Top performers in this challenge</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challenge.leaderboard.map((participant, index) => (
                  <div key={participant.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="mr-4 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                          {index + 1}
                        </div>
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={participant.avatar} alt={participant.name} />
                          <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{participant.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Completed {new Date(participant.completedAt || "").toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="font-medium">{participant.score}</div>
                    </div>
                    {index < challenge.leaderboard.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View Full Leaderboard</Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Similar Challenges</CardTitle>
              <CardDescription>You might also be interested in these</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <BookOpen className="h-10 w-10 p-2 rounded-md bg-primary/10 text-primary" />
                <div>
                  <h3 className="font-medium">CSS Mastery Challenge</h3>
                  <p className="text-sm text-muted-foreground">Test your CSS layout and styling skills</p>
                  <div className="flex items-center mt-1">
                    <PKStarCounter pkStars={400} size="sm" />
                    <span className="text-xs text-muted-foreground ml-2">128 participants</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-3">
                <BookOpen className="h-10 w-10 p-2 rounded-md bg-primary/10 text-primary" />
                <div>
                  <h3 className="font-medium">React Fundamentals</h3>
                  <p className="text-sm text-muted-foreground">Learn the basics of React components and hooks</p>
                  <div className="flex items-center mt-1">
                    <PKStarCounter pkStars={600} size="sm" />
                    <span className="text-xs text-muted-foreground ml-2">256 participants</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link to="/challenges">Browse All Challenges</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;
