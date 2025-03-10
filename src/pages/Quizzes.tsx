
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Star, ChevronRight, Lightbulb, Trophy, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PKStarCounter from '@/components/PKStarCounter';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';

// Available categories
const CATEGORIES = [
  'Crypto', 'Web3', 'Science', 'History', 'Geography', 
  'Anime', 'Art', 'Personality', 'Weird', 'Travel',
  'Ideas', 'Movie', 'Business', 'Pop Culture', 'AI', 
  'Books', 'Confessions', 'Random'
];

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  category: string;
  explanation?: string;
}

// Mock quiz questions database
const QUIZ_QUESTIONS: Record<string, Question[]> = {
  'Crypto': [
    {
      id: 'crypto1',
      text: 'What is the maximum supply of Bitcoin?',
      options: ['21 million', '100 million', 'Unlimited', '18 million'],
      correctAnswer: '21 million',
      category: 'Crypto',
      explanation: 'Bitcoin has a hard cap of 21 million coins, which contributes to its scarcity value.'
    },
    {
      id: 'crypto2',
      text: 'Who is widely credited as the creator of Bitcoin?',
      options: ['Vitalik Buterin', 'Satoshi Nakamoto', 'Charlie Lee', 'Nick Szabo'],
      correctAnswer: 'Satoshi Nakamoto',
      explanation: 'Satoshi Nakamoto is the pseudonymous person or group who published the Bitcoin whitepaper in 2008.'
    }
  ],
  'Web3': [
    {
      id: 'web3-1',
      text: 'What is the main difference between Web2 and Web3?',
      options: ['Speed', 'Decentralization', 'Availability', 'Cost'],
      correctAnswer: 'Decentralization',
      category: 'Web3',
      explanation: 'Web3 focuses on decentralization, shifting control from large tech companies to individual users through blockchain technologies.'
    }
  ],
  'Science': [
    {
      id: 'sci1',
      text: 'What particle is exchanged between quarks to form protons and neutrons?',
      options: ['Photon', 'Gluon', 'Electron', 'Neutrino'],
      correctAnswer: 'Gluon',
      category: 'Science',
      explanation: 'Gluons are the force carriers that "glue" quarks together to form hadrons like protons and neutrons.'
    }
  ],
  'History': [
    {
      id: 'hist1',
      text: 'In what year did the Berlin Wall fall?',
      options: ['1987', '1989', '1991', '1993'],
      correctAnswer: '1989',
      category: 'History',
      explanation: 'The Berlin Wall fell on November 9, 1989, symbolizing the end of the Cold War division between East and West Germany.'
    }
  ]
};

// Add more categories with placeholder questions
for (const category of CATEGORIES) {
  if (!QUIZ_QUESTIONS[category]) {
    QUIZ_QUESTIONS[category] = [
      {
        id: `${category.toLowerCase()}-default`,
        text: `This is a sample question about ${category}. What is the most important concept in this field?`,
        options: ['Concept A', 'Concept B', 'Concept C', 'All of the above'],
        correctAnswer: 'All of the above',
        category: category,
        explanation: `All concepts are important in understanding ${category}.`
      }
    ];
  }
}

const Quizzes = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Random');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [pkStars, setPkStars] = useLocalStorage<number>('pkStars', 10);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);

  const HINT_COST = 3;
  const CORRECT_ANSWER_REWARD = 5;

  // Get a new question when category changes
  useEffect(() => {
    getNewQuestion();
  }, [selectedCategory]);

  // Get a new question from the selected category
  const getNewQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setShowHint(false);

    let availableQuestions: Question[] = [];
    
    if (selectedCategory === 'Random') {
      // Collect all questions from all categories
      Object.values(QUIZ_QUESTIONS).forEach(questions => {
        availableQuestions = [...availableQuestions, ...questions];
      });
    } else {
      availableQuestions = QUIZ_QUESTIONS[selectedCategory] || [];
    }
    
    // Filter out recently answered questions
    const unansweredQuestions = availableQuestions.filter(q => !answeredQuestions.includes(q.id));
    
    // If we've answered all questions in the category, reset the list
    if (unansweredQuestions.length === 0) {
      setAnsweredQuestions([]);
      availableQuestions = [...availableQuestions];
    } else {
      availableQuestions = unansweredQuestions;
    }

    // Select a random question
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    setCurrentQuestion(availableQuestions[randomIndex]);
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    const correct = currentQuestion?.correctAnswer === answer;
    setIsCorrect(correct);
    
    if (correct) {
      // Reward for correct answer
      setPkStars(pkStars + CORRECT_ANSWER_REWARD);
      setStreak(streak + 1);
      
      toast({
        title: "Correct! +5 PK Stars",
        description: `You now have ${pkStars + CORRECT_ANSWER_REWARD} PK stars. Streak: ${streak + 1}`,
        variant: "default",
      });
    } else {
      // Reset streak for wrong answer
      setStreak(0);
      
      toast({
        title: "Incorrect!",
        description: `The correct answer was: ${currentQuestion?.correctAnswer}`,
        variant: "destructive",
      });
    }
    
    // Add this question to answered questions
    if (currentQuestion) {
      setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);
    }
  };

  // Handle showing hint
  const handleShowHint = () => {
    if (showHint || !currentQuestion || isAnswered || pkStars < HINT_COST) return;
    
    setPkStars(pkStars - HINT_COST);
    setShowHint(true);
    
    toast({
      title: "Hint Revealed",
      description: `You spent ${HINT_COST} PK stars on a hint.`,
    });
  };

  // Get a hint for the current question
  const getHint = (): string => {
    if (!currentQuestion) return '';
    
    const correctAnswer = currentQuestion.correctAnswer;
    const otherOptions = currentQuestion.options.filter(option => option !== correctAnswer);
    
    // Randomly remove 1-2 wrong options as a hint
    const numToRemove = Math.min(otherOptions.length - 1, Math.floor(Math.random() * 2) + 1);
    const removedOptions = otherOptions.sort(() => 0.5 - Math.random()).slice(0, numToRemove);
    
    return `It's not: ${removedOptions.join(', ')}`;
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">LearnPool Quiz</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Test your knowledge with unlimited quiz questions from LearnPool's knowledge base.
            Each correct answer earns you 5 PK stars!
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <PKStarCounter pkStars={pkStars} size="lg" />
            <Badge variant="outline" className="py-2 px-4 text-base">
              <Trophy className="w-4 h-4 mr-2 text-primary" />
              Streak: {streak}
            </Badge>
          </div>
        </header>
        
        <main className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Select Category</CardTitle>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
          </Card>
          
          {currentQuestion && (
            <Card className="mb-8">
              <CardHeader className="bg-primary/5">
                <div className="flex justify-between items-center">
                  <Badge variant="outline">
                    {currentQuestion.category}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleShowHint} 
                    disabled={showHint || isAnswered || pkStars < HINT_COST}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Lightbulb className="h-4 w-4" />
                    Hint ({HINT_COST} stars)
                  </Button>
                </div>
                <CardTitle className="mt-4 text-xl">{currentQuestion.text}</CardTitle>
                {showHint && (
                  <CardDescription className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-md">
                    <span className="flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                      Hint: {getHint()}
                    </span>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid gap-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={isAnswered}
                      className={`p-4 rounded-lg border text-left transition ${
                        isAnswered && option === currentQuestion.correctAnswer
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800'
                          : isAnswered && option === selectedAnswer && option !== currentQuestion.correctAnswer
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800'
                          : selectedAnswer === option
                          ? 'bg-primary/10 border-primary'
                          : 'bg-card border-border hover:bg-primary/5'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="flex-1">{option}</span>
                        {isAnswered && option === currentQuestion.correctAnswer && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {isAnswered && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                {isAnswered && currentQuestion.explanation && (
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
                    <p className="text-sm font-medium mb-1">Explanation:</p>
                    <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6">
                {isAnswered && (
                  <div className="w-full flex justify-center">
                    <Button onClick={getNewQuestion} className="gap-2">
                      Next Question
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          )}
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setStreak(0)} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset Streak
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">
                Back to Home
              </Link>
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Quizzes;
