import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Clock, Home, Star, ChevronRight, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import PKStarCounter from '@/components/PKStarCounter';
import { QuizQuestion, QuizState } from '@/types/pkData';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Difficulty settings
const DIFFICULTY_SETTINGS = {
  easy: { questions: 10, options: 3, timePerQuestion: 5 },
  medium: { questions: 15, options: 4, timePerQuestion: 4 },
  hard: { questions: 25, options: 5, timePerQuestion: 3 }
};

// Mock questions generator
const generateMockQuestions = (category: string, difficulty: 'easy' | 'medium' | 'hard'): QuizQuestion[] => {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const questions: QuizQuestion[] = [];
  
  const questionBanks: Record<string, { question: string, options: string[], answer: string }[]> = {
    'Crypto': [
      {
        question: 'Which consensus mechanism does Bitcoin use?',
        options: ['Proof of Stake', 'Proof of Work', 'Proof of Authority', 'Delegated Proof of Stake', 'Proof of Space'],
        answer: 'Proof of Work'
      },
      {
        question: 'What was the first cryptocurrency?',
        options: ['Ethereum', 'Bitcoin', 'Litecoin', 'Dogecoin', 'Ripple'],
        answer: 'Bitcoin'
      },
      {
        question: 'Who created Bitcoin?',
        options: ['Vitalik Buterin', 'Satoshi Nakamoto', 'Charles Hoskinson', 'Elon Musk', 'Nick Szabo'],
        answer: 'Satoshi Nakamoto'
      },
      {
        question: 'What is the maximum supply of Bitcoin?',
        options: ['1 million', '21 million', '100 million', 'Unlimited', '42 million'],
        answer: '21 million'
      },
      {
        question: 'What year was Bitcoin launched?',
        options: ['2007', '2009', '2011', '2013', '2015'],
        answer: '2009'
      }
    ],
    'Web3': [
      {
        question: 'What is a DAO in Web3?',
        options: ['Decentralized Autonomous Organization', 'Digital Asset Offering', 'Data Access Object', 'Distributed Application Ontology'],
        answer: 'Decentralized Autonomous Organization'
      },
      {
        question: 'What technology underlies most Web3 applications?',
        options: ['Artificial Intelligence', 'Blockchain', 'Cloud Computing', 'Quantum Computing'],
        answer: 'Blockchain'
      },
      {
        question: 'What is a smart contract?',
        options: ['A legal agreement with a tech company', 'Self-executing code on a blockchain', 'A digital signature', 'An intelligent AI assistant'],
        answer: 'Self-executing code on a blockchain'
      }
    ],
    'AI': [
      {
        question: 'What is the name of the architecture used in most modern large language models?',
        options: ['CNN', 'RNN', 'Transformer', 'GAN', 'LSTM'],
        answer: 'Transformer'
      },
      {
        question: 'Which company created ChatGPT?',
        options: ['Google', 'Meta', 'OpenAI', 'Microsoft', 'Amazon'],
        answer: 'OpenAI'
      },
      {
        question: 'What does AI stand for?',
        options: ['Automated Intelligence', 'Artificial Intelligence', 'Advanced Integration', 'Algorithmic Inference'],
        answer: 'Artificial Intelligence'
      }
    ],
    'History': [
      {
        question: 'Which empire was ruled by Genghis Khan?',
        options: ['Roman Empire', 'Ottoman Empire', 'Mongol Empire', 'Byzantine Empire', 'Persian Empire'],
        answer: 'Mongol Empire'
      },
      {
        question: 'In what year did World War II end?',
        options: ['1943', '1944', '1945', '1946', '1947'],
        answer: '1945'
      },
      {
        question: 'Who was the first President of the United States?',
        options: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Abraham Lincoln', 'Benjamin Franklin'],
        answer: 'George Washington'
      }
    ]
  };
  
  // Fallback for categories without specific questions
  const defaultQuestions = [
    {
      question: `What is a key concept in ${category}?`,
      options: ['Concept A', 'Concept B', 'Concept C', 'Concept D', 'Concept E'],
      answer: 'Concept B'
    },
    {
      question: `Who is an important figure in ${category}?`,
      options: ['Person A', 'Person B', 'Person C', 'Person D', 'Person E'],
      answer: 'Person C'
    },
    {
      question: `Which of these is related to ${category}?`,
      options: ['Thing A', 'Thing B', 'Thing C', 'Thing D', 'Thing E'],
      answer: 'Thing A'
    }
  ];
  
  const availableQuestions = questionBanks[category] || defaultQuestions;
  
  // Generate required number of questions
  for (let i = 0; i < settings.questions; i++) {
    // Use available questions and cycle through them if needed
    const baseQuestion = availableQuestions[i % availableQuestions.length];
    
    // Take only the number of options needed for the difficulty
    const allOptions = [...baseQuestion.options];
    // Make sure the correct answer is included
    const correctAnswerIndex = allOptions.indexOf(baseQuestion.answer);
    const options: string[] = [];
    
    // Create a set of options based on difficulty
    if (settings.options <= allOptions.length) {
      // If we have enough options, randomly select them but ensure correct answer is included
      const availableIndices = Array.from({ length: allOptions.length }, (_, i) => i)
        .filter(idx => idx !== correctAnswerIndex); // Remove correct answer from pool
      
      // Shuffle available indices
      for (let j = availableIndices.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [availableIndices[j], availableIndices[k]] = [availableIndices[k], availableIndices[j]];
      }
      
      // Take needed number of options - 1 (to leave room for correct answer)
      const selectedIndices = availableIndices.slice(0, settings.options - 1);
      
      // Add correct answer and selected options
      options.push(baseQuestion.answer);
      selectedIndices.forEach(idx => options.push(allOptions[idx]));
      
      // Shuffle options
      for (let j = options.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [options[j], options[k]] = [options[k], options[j]];
      }
    } else {
      // If we don't have enough options, use what we have
      options.push(...allOptions);
      
      // Add additional options if needed
      while (options.length < settings.options) {
        options.push(`Option ${options.length + 1}`);
      }
    }
    
    questions.push({
      id: `q-${i + 1}`,
      question: baseQuestion.question,
      options,
      correctAnswer: baseQuestion.answer,
      pkId: i + 1,
      category,
      hintRevealed: false
    });
  }
  
  return questions;
};

const ChallengeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pkStars, setPkStars] = useLocalStorage<number>('pkStars', 10);
  
  // Challenge state
  const [challenge, setChallenge] = useState<{
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    reward: number;
  } | null>(null);
  
  // Quiz state
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswer: null,
    isAnswerSubmitted: false,
    isCorrect: null,
    score: 0,
    pkStars: 0,
    completed: false,
  });
  
  // Timer state
  const [timer, setTimer] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  
  // Load challenge data
  useEffect(() => {
    // Mock challenge data - in a real app, this would come from an API
    const mockChallenge = {
      id: id || 'c1',
      title: 'Blockchain Basics',
      description: 'Test your knowledge of fundamental blockchain concepts',
      category: 'Crypto',
      difficulty: 'medium' as const,
      reward: 25
    };
    
    setChallenge(mockChallenge);
    
    // Generate questions based on challenge category and difficulty
    const questions = generateMockQuestions(mockChallenge.category, mockChallenge.difficulty);
    
    setQuizState(prev => ({
      ...prev,
      questions,
    }));
  }, [id]);
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            // Time's up, move to next question
            handleTimeUp();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timer]);
  
  // Start the challenge
  const startChallenge = () => {
    if (!challenge) return;
    
    const settings = DIFFICULTY_SETTINGS[challenge.difficulty];
    setTimer(settings.timePerQuestion);
    setIsActive(true);
  };
  
  // Handle time up
  const handleTimeUp = () => {
    if (quizState.isAnswerSubmitted) return;
    
    // Auto-submit with no selection
    handleAnswerSubmit(null);
  };
  
  // Handle answer selection
  const selectAnswer = (answer: string) => {
    if (quizState.isAnswerSubmitted) return;
    
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answer
    }));
  };
  
  // Submit an answer and move to the next question
  const handleAnswerSubmit = (selectedAnswer: string | null) => {
    if (!challenge) return;
    
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    // Update score if correct
    const newScore = isCorrect ? quizState.score + 1 : quizState.score;
    
    // Check if this is the last question
    const isLastQuestion = quizState.currentQuestionIndex === quizState.questions.length - 1;
    
    if (isLastQuestion) {
      // Challenge complete
      const earnedStars = Math.ceil((newScore / quizState.questions.length) * challenge.reward);
      
      setQuizState(prev => ({
        ...prev,
        selectedAnswer,
        isAnswerSubmitted: true,
        isCorrect,
        score: newScore,
        pkStars: earnedStars,
        completed: true
      }));
      
      // Add stars to user total
      const newStarTotal = pkStars + earnedStars;
      setPkStars(newStarTotal);
      
      setIsActive(false);
      
      toast({
        title: "Challenge Complete!",
        description: `You scored ${newScore} out of ${quizState.questions.length} and earned ${earnedStars} PK stars!`,
      });
    } else {
      // Move to next question
      setQuizState(prev => ({
        ...prev,
        selectedAnswer,
        isAnswerSubmitted: true,
        isCorrect,
        score: newScore
      }));
      
      // Show result briefly, then move to next question
      setTimeout(() => {
        const settings = DIFFICULTY_SETTINGS[challenge.difficulty];
        
        setQuizState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          selectedAnswer: null,
          isAnswerSubmitted: false,
          isCorrect: null
        }));
        
        setTimer(settings.timePerQuestion);
      }, 1500);
    }
  };
  
  // Reveal hint for current question
  const revealHint = () => {
    const HINT_COST = 3;
    
    if (pkStars < HINT_COST) {
      toast({
        title: "Not enough stars",
        description: `You need ${HINT_COST} PK stars to reveal a hint.`,
        variant: "destructive"
      });
      return;
    }
    
    // Deduct stars
    const newStarTotal = pkStars - HINT_COST;
    setPkStars(newStarTotal);
    
    // Update the current question to show it has a hint
    setQuizState(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[prev.currentQuestionIndex].hintRevealed = true;
      
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
    
    toast({
      title: "Hint Revealed!",
      description: `You spent ${HINT_COST} PK stars on a hint.`
    });
  };
  
  // Finish the challenge and return to challenges page
  const finishChallenge = () => {
    navigate('/challenges');
  };
  
  if (!challenge) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <p>Loading challenge...</p>
      </div>
    );
  }
  
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const progressPercentage = (quizState.currentQuestionIndex / quizState.questions.length) * 100;
  
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {!isActive && !quizState.completed ? (
          // Challenge intro
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  challenge.difficulty === 'easy' ? 'text-green-500 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50' :
                  challenge.difficulty === 'medium' ? 'text-orange-500 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/50' :
                  'text-red-500 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50'
                }`}>
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
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <span>Number of questions:</span>
                  <span className="font-medium">{DIFFICULTY_SETTINGS[challenge.difficulty].questions}</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span>Time per question:</span>
                  <span className="font-medium">{DIFFICULTY_SETTINGS[challenge.difficulty].timePerQuestion} seconds</span>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <span>Maximum reward:</span>
                  <PKStarCounter pkStars={challenge.reward} />
                </div>
                <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                  <p className="text-center text-sm">
                    Answer quickly and correctly to earn maximum points! You have limited time for each question.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={startChallenge} className="w-full">Start Challenge</Button>
            </CardFooter>
          </Card>
        ) : quizState.completed ? (
          // Challenge results
          <Card>
            <CardHeader>
              <CardTitle>Challenge Complete!</CardTitle>
              <CardDescription>
                You've completed the {challenge.title} challenge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold mb-2">
                  {quizState.score} / {quizState.questions.length}
                </div>
                <p className="text-muted-foreground">correct answers</p>
              </div>
              
              <div className="p-4 bg-primary/5 rounded-lg mb-6">
                <div className="text-center mb-2">You earned</div>
                <div className="flex justify-center">
                  <PKStarCounter pkStars={quizState.pkStars} />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Score percentage:</span>
                  <span className="font-medium">{Math.round((quizState.score / quizState.questions.length) * 100)}%</span>
                </div>
                <Progress value={(quizState.score / quizState.questions.length) * 100} className="h-2" />
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button variant="outline" asChild className="flex-1">
                <Link to={`/challenges`}>
                  <Home className="mr-2 h-4 w-4" />
                  All Challenges
                </Link>
              </Button>
              <Button className="flex-1" onClick={finishChallenge}>
                Finish
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ) : currentQuestion ? (
          // Question view
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <PKStarCounter pkStars={pkStars} />
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className={`font-bold ${timer <= 2 ? 'text-red-500' : ''}`}>{timer}s</span>
              </div>
            </div>
            
            <div className="mb-4">
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>Question {quizState.currentQuestionIndex + 1} of {quizState.questions.length}</span>
                <span>{Math.round(progressPercentage)}% complete</span>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs">
                    {currentQuestion.category}
                  </div>
                  {!quizState.isAnswerSubmitted && !currentQuestion.hintRevealed && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={revealHint}
                      disabled={pkStars < 3}
                    >
                      <Lightbulb className="h-4 w-4" />
                      Hint (3 <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />)
                    </Button>
                  )}
                </div>
                <CardTitle className="text-xl mt-2">{currentQuestion.question}</CardTitle>
                {currentQuestion.hintRevealed && (
                  <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/30 rounded-md">
                    <p className="flex items-center text-sm text-yellow-700 dark:text-yellow-400">
                      <Lightbulb className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                      Hint: (see pk#{Math.floor(Math.random() * 2000) + 1})
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        quizState.isAnswerSubmitted
                          ? option === currentQuestion.correctAnswer
                            ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/30'
                            : option === quizState.selectedAnswer
                              ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/30'
                              : 'bg-muted/20 border-border'
                          : quizState.selectedAnswer === option
                            ? 'bg-primary/5 border-primary/30'
                            : 'hover:bg-muted/50 border-border'
                      }`}
                      onClick={() => selectAnswer(option)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {quizState.isAnswerSubmitted && (
                          option === currentQuestion.correctAnswer ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : option === quizState.selectedAnswer ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : null
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleAnswerSubmit(quizState.selectedAnswer)}
                  disabled={!quizState.selectedAnswer || quizState.isAnswerSubmitted}
                >
                  {quizState.isAnswerSubmitted
                    ? quizState.currentQuestionIndex === quizState.questions.length - 1
                      ? 'Finishing...'
                      : 'Next Question...'
                    : 'Submit Answer'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="text-center">
            <p>Loading questions...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeDetail;
