
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import PKStarCounter from '@/components/PKStarCounter';
import { CheckCircle, Clock, HelpCircle, Award, AlertCircle, ArrowLeft, User, Trophy, Timer, Zap } from 'lucide-react';

// Mock challenge details - in a real app, fetch this from an API
const MOCK_CHALLENGE = {
  id: 'c1',
  title: 'Blockchain Basics Challenge',
  description: 'Test your knowledge of fundamental blockchain concepts in this timed challenge.',
  tags: ['Crypto', 'Web3', 'Technology'],
  difficulty: 'medium',
  questionCount: 10,
  timePerQuestion: 10, // Updated: 5-12 seconds per question
  participants: 342,
  reward: 25,
  status: 'active'
};

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
  isCorrect?: boolean;
  hintUsed?: boolean;
}

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  timeRemaining: number;
  score: number;
  isActive: boolean;
  isComplete: boolean;
}

// Generate mock questions based on challenge
const generateMockQuestions = (count: number, tags: string[]): Question[] => {
  const questions: Question[] = [];
  
  // Pool of crypto/blockchain questions
  const cryptoQuestions = [
    {
      text: 'What is the maximum supply of Bitcoin?',
      options: ['10 million', '21 million', '100 million', 'Unlimited'],
      correctAnswer: 1
    },
    {
      text: 'Which consensus mechanism does Bitcoin use?',
      options: ['Proof of Stake', 'Proof of Work', 'Proof of Authority', 'Delegated Proof of Stake'],
      correctAnswer: 1
    },
    {
      text: 'What is a smart contract?',
      options: [
        'A legal agreement between two parties',
        'Self-executing code on a blockchain',
        'A type of cryptocurrency',
        'A regulatory framework for crypto'
      ],
      correctAnswer: 1
    },
    {
      text: 'Which of these is NOT a layer 1 blockchain?',
      options: ['Ethereum', 'Solana', 'Polygon', 'Cardano'],
      correctAnswer: 2
    },
    {
      text: 'What was the first cryptocurrency?',
      options: ['Ethereum', 'Bitcoin', 'Litecoin', 'Dogecoin'],
      correctAnswer: 1
    },
    {
      text: 'What does NFT stand for?',
      options: ['New Financial Token', 'Non-Fungible Token', 'National Fund Transfer', 'Network Function Technology'],
      correctAnswer: 1
    },
    {
      text: 'Which year was Bitcoin created?',
      options: ['2007', '2008', '2009', '2010'],
      correctAnswer: 2
    },
    {
      text: 'What is a blockchain fork?',
      options: [
        'A change to the blockchain protocol',
        'A tool for mining crypto',
        'A way to store private keys',
        'A type of crypto wallet'
      ],
      correctAnswer: 0
    },
    {
      text: 'Which of these is a privacy-focused cryptocurrency?',
      options: ['Bitcoin', 'Ethereum', 'Monero', 'Cardano'],
      correctAnswer: 2
    },
    {
      text: 'What is a DAO?',
      options: [
        'Digital Asset Offering',
        'Decentralized Autonomous Organization',
        'Distributed Application Overlay',
        'Direct Access Operation'
      ],
      correctAnswer: 1
    },
    {
      text: 'What does DeFi stand for?',
      options: ['Defined Finance', 'Decentralized Finance', 'Digital Finance', 'Derivative Finance'],
      correctAnswer: 1
    },
    {
      text: 'Which platform was first to introduce smart contracts?',
      options: ['Bitcoin', 'Ethereum', 'Solana', 'Cardano'],
      correctAnswer: 1
    }
  ];
  
  // Pool of web3 questions
  const web3Questions = [
    {
      text: 'What does Web3 primarily aim to achieve?',
      options: [
        'Faster internet speeds',
        'More visually appealing websites',
        'Decentralization and user ownership',
        'Better search engine optimization'
      ],
      correctAnswer: 2
    },
    {
      text: 'Which technology is NOT typically associated with Web3?',
      options: ['Blockchain', 'Cryptocurrencies', 'SQL databases', 'NFTs'],
      correctAnswer: 2
    },
    {
      text: 'What is a dApp?',
      options: [
        'Digital application',
        'Decentralized application',
        'Development application',
        'Database application'
      ],
      correctAnswer: 1
    },
    {
      text: 'Who coined the term "Web3"?',
      options: ['Vitalik Buterin', 'Gavin Wood', 'Satoshi Nakamoto', 'Tim Berners-Lee'],
      correctAnswer: 1
    }
  ];
  
  // Pool of technology questions
  const technologyQuestions = [
    {
      text: 'What does API stand for?',
      options: [
        'Application Programming Interface',
        'Automated Programming Instance',
        'Application Protocol Integration',
        'Automated Process Interaction'
      ],
      correctAnswer: 0
    },
    {
      text: 'Which of these is a distributed version control system?',
      options: ['SVN', 'Git', 'CVS', 'Mercurial'],
      correctAnswer: 1
    },
    {
      text: 'What is the primary function of a compiler?',
      options: [
        'To execute code',
        'To translate code from one language to another',
        'To identify bugs in code',
        'To compress code for efficient storage'
      ],
      correctAnswer: 1
    }
  ];
  
  // Get questions based on tags
  const questionPool: any[] = [];
  if (tags.includes('Crypto')) questionPool.push(...cryptoQuestions);
  if (tags.includes('Web3')) questionPool.push(...web3Questions);
  if (tags.includes('Technology')) questionPool.push(...technologyQuestions);
  
  // If no specific questions for tags, use a mix
  if (questionPool.length === 0) {
    questionPool.push(...cryptoQuestions, ...web3Questions, ...technologyQuestions);
  }
  
  // Shuffle and pick questions
  const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  
  // Format questions
  return selected.map((q, index) => ({
    id: `q-${index}`,
    text: q.text,
    options: q.options,
    correctAnswer: q.correctAnswer
  }));
};

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkStars, setPkStars] = useLocalStorage<number>('pkStars', 10);
  
  // Challenge data state
  const [challenge] = useState(MOCK_CHALLENGE);
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    timeRemaining: 0,
    score: 0,
    isActive: false,
    isComplete: false
  });
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate a timePerQuestion between 5-12 seconds
  const getRandomTimePerQuestion = () => {
    return Math.floor(Math.random() * 8) + 5; // 5-12 seconds
  };
  
  // Initialize quiz
  useEffect(() => {
    if (challenge) {
      // Generate questions based on challenge
      const questions = generateMockQuestions(challenge.questionCount, challenge.tags);
      
      setQuizState({
        questions,
        currentQuestionIndex: 0,
        timeRemaining: getRandomTimePerQuestion(),
        score: 0,
        isActive: false,
        isComplete: false
      });
      
      setIsLoading(false);
    }
  }, [challenge]);
  
  // Timer for active quiz
  useEffect(() => {
    let timer: number | undefined;
    
    if (isActive && quizState.timeRemaining > 0) {
      timer = window.setInterval(() => {
        setQuizState(prev => ({
          ...prev,
          timeRemaining: Math.max(0, prev.timeRemaining - 0.1)
        }));
      }, 100);
    } else if (isActive && quizState.timeRemaining <= 0) {
      // Time's up for current question
      handleTimeUp();
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, quizState.timeRemaining]);
  
  // Start the challenge
  const startChallenge = () => {
    setIsActive(true);
    setQuizState(prev => ({
      ...prev,
      isActive: true,
      timeRemaining: getRandomTimePerQuestion()
    }));
  };
  
  // Handle time up for a question
  const handleTimeUp = () => {
    // Mark current question as incorrect
    const updatedQuestions = [...quizState.questions];
    updatedQuestions[quizState.currentQuestionIndex] = {
      ...updatedQuestions[quizState.currentQuestionIndex],
      isCorrect: false
    };
    
    // Check if this was the last question
    if (quizState.currentQuestionIndex >= quizState.questions.length - 1) {
      finishChallenge();
    } else {
      // Move to next question
      setQuizState(prev => ({
        ...prev,
        questions: updatedQuestions,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        timeRemaining: getRandomTimePerQuestion()
      }));
    }
  };
  
  // Handle answer selection
  const handleAnswerSelect = (optionIndex: number) => {
    if (!isActive) return;
    
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    
    // Update current question
    const updatedQuestions = [...quizState.questions];
    updatedQuestions[quizState.currentQuestionIndex] = {
      ...currentQuestion,
      userAnswer: optionIndex,
      isCorrect
    };
    
    // Update score if correct
    const newScore = isCorrect ? quizState.score + 1 : quizState.score;
    
    // Check if this was the last question
    if (quizState.currentQuestionIndex >= quizState.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        questions: updatedQuestions,
        score: newScore,
        timeRemaining: 0
      }));
      
      finishChallenge(newScore);
    } else {
      // Move to next question
      setQuizState(prev => ({
        ...prev,
        questions: updatedQuestions,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        timeRemaining: getRandomTimePerQuestion(),
        score: newScore
      }));
    }
  };
  
  // Get hint for the current question
  const HINT_COST = 3; // Cost in PK stars
  
  const getHint = () => {
    if (pkStars < HINT_COST) {
      toast({
        title: "Not enough PK Stars",
        description: `You need ${HINT_COST} stars to get a hint.`,
        variant: "destructive",
      });
      return;
    }
    
    // Deduct stars
    const newStarTotal = pkStars - HINT_COST;
    setPkStars(newStarTotal);
    
    // Update the current question to show it has a hint
    setQuizState(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[prev.currentQuestionIndex] = {
        ...updatedQuestions[prev.currentQuestionIndex],
        hintUsed: true
      };
      
      return {
        ...prev,
        questions: updatedQuestions,
        // Add some time as a bonus for using a hint
        timeRemaining: prev.timeRemaining + 3
      };
    });
    
    // Show hint
    toast({
      title: "Hint",
      description: "One option has been eliminated!",
    });
  };
  
  // Finish the challenge
  const finishChallenge = (finalScore = quizState.score) => {
    // Calculate earned stars based on score and difficulty
    const difficultyMultiplier = 
      challenge.difficulty === 'easy' ? 1 :
      challenge.difficulty === 'medium' ? 1.5 : 2;
    
    const earnedStars = Math.round(
      (finalScore / quizState.questions.length) * challenge.reward * difficultyMultiplier
    );
    
    setQuizState(prev => ({
      ...prev,
      isActive: false,
      isComplete: true,
      score: finalScore
    }));
    
    // Add stars to user total
    const newStarTotal = pkStars + earnedStars;
    setPkStars(newStarTotal);
    
    setIsActive(false);
    
    toast({
      title: "Challenge Complete!",
      description: `You earned ${earnedStars} PK stars!`,
    });
  };
  
  // Get the difficulty class for styling
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400';
      case 'medium': return 'bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400';
      case 'hard': return 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400';
      default: return 'bg-gray-50 text-gray-600 dark:bg-gray-950/30 dark:text-gray-400';
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="text-center">Loading challenge...</div>
      </div>
    );
  }
  
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  
  return (
    <div className="container mx-auto py-8 md:py-16 px-4">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate('/challenges')}
        disabled={isActive}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Challenges
      </Button>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{challenge.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {challenge.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>
        <PKStarCounter pkStars={pkStars} />
      </div>
      
      {!quizState.isActive && !quizState.isComplete && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Challenge Details</CardTitle>
            <CardDescription>{challenge.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary/60" />
                <span>{challenge.participants} participants</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary/60" />
                <span>Up to {challenge.reward} PK stars reward</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-primary/60" />
                <span>5-12 seconds per question</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary/60" />
                <span>
                  <Badge className={`${getDifficultyClass(challenge.difficulty)}`}>
                    {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                  </Badge>
                </span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">How to Play:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 text-primary/60" />
                  <span>Each question has a timer of 5-12 seconds. Answer before time runs out!</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-primary/60" />
                  <span>Select the correct answer to earn points.</span>
                </li>
                <li className="flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 mt-0.5 text-primary/60" />
                  <span>You can use hints for difficult questions (costs 3 PK stars).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Award className="h-4 w-4 mt-0.5 text-primary/60" />
                  <span>Earn PK stars based on your performance and the challenge difficulty.</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={startChallenge} className="w-full">Start Challenge</Button>
          </CardFooter>
        </Card>
      )}
      
      {quizState.isActive && currentQuestion && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}</CardTitle>
              <div className="flex items-center">
                <span className="mr-2">Score: {quizState.score}</span>
                <span className="text-sm font-medium px-2 py-1 rounded-full bg-primary/10">{Math.floor(quizState.score / quizState.questions.length * 100)}%</span>
              </div>
            </div>
            {/* Updated: Made timer more prominent */}
            <div className="flex flex-col items-center justify-center mt-2">
              <div className="text-center font-bold text-xl mb-1">
                {Math.ceil(quizState.timeRemaining)}s
              </div>
              <Progress 
                value={(quizState.timeRemaining / getRandomTimePerQuestion()) * 100} 
                className="h-2 w-full"
                indicatorClassName={quizState.timeRemaining < 3 ? "bg-red-500" : ""}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg font-medium">{currentQuestion.text}</div>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                // If hint is used, hide one wrong answer
                const isHiddenByHint = 
                  currentQuestion.hintUsed && 
                  index !== currentQuestion.correctAnswer && 
                  // Use a deterministic way to choose which wrong answer to hide
                  (index === (currentQuestion.correctAnswer + 1) % currentQuestion.options.length);
                
                if (isHiddenByHint) {
                  return null;
                }
                
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start h-auto py-4 px-4 font-normal"
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <span className="flex-1 text-left">{option}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={getHint}
              disabled={currentQuestion.hintUsed || pkStars < HINT_COST}
              className="gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Use Hint (3 PK stars)
            </Button>
            <Button
              variant="outline"
              onClick={handleTimeUp}
              className="gap-2"
            >
              Skip Question
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {quizState.isComplete && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Challenge Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-6">
              <div className="text-4xl font-bold mb-2">{quizState.score} / {quizState.questions.length}</div>
              <p className="text-lg text-muted-foreground">
                {quizState.score / quizState.questions.length >= 0.7 
                  ? "Great job! You did excellent!" 
                  : quizState.score / quizState.questions.length >= 0.4
                  ? "Good effort! Keep practicing."
                  : "Practice makes perfect. Try again!"}
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-4 mt-6">
              <h3 className="font-medium">Question Review:</h3>
              
              {quizState.questions.map((question, index) => (
                <div key={question.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Q{index + 1}.</span>
                      <span>{question.text}</span>
                    </div>
                    {question.isCorrect !== undefined && (
                      question.isCorrect 
                        ? <CheckCircle className="h-5 w-5 text-green-500" /> 
                        : <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  
                  <div className="mt-2 ml-6 space-y-1 text-sm">
                    {question.options.map((option, optIndex) => (
                      <div 
                        key={optIndex}
                        className={`py-1 px-2 rounded ${
                          optIndex === question.correctAnswer 
                            ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400' 
                            : optIndex === question.userAnswer && optIndex !== question.correctAnswer
                            ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                            : ''
                        }`}
                      >
                        {option}
                        {optIndex === question.correctAnswer && ' ✓'}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => navigate('/challenges')} variant="outline" className="w-full sm:w-auto">
              Back to Challenges
            </Button>
            <Button onClick={() => window.location.reload()} className="w-full sm:w-auto">
              Try Again
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ChallengeDetail;
