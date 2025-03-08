
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuizQuestion as QuizQuestionType } from '@/types/pkData';
import QuizOption from './QuizOption';
import PKStarCounter from './PKStarCounter';
import { Lightbulb } from 'lucide-react';

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswer: string | null;
  isSubmitted: boolean;
  isCorrect: boolean | null;
  pkStars: number;
  onSelectAnswer: (answer: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  onRevealHint: () => void;
}

const QuizQuestion = ({
  question,
  selectedAnswer,
  isSubmitted,
  isCorrect,
  pkStars,
  onSelectAnswer,
  onSubmit,
  onNext,
  onRevealHint
}: QuizQuestionProps) => {
  const hintCost = 2; // Cost in PK stars to reveal a hint
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Badge variant="outline">{question.category}</Badge>
          <PKStarCounter pkStars={pkStars} />
        </div>
        <CardTitle className="text-xl sm:text-2xl mt-4">{question.question}</CardTitle>
        {question.hintRevealed && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center">
            <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-sm">Hint: This question is related to PK #{question.pkId}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {question.options.map((option, index) => (
            <QuizOption
              key={index}
              option={option}
              selected={selectedAnswer === option}
              correct={isSubmitted ? option === question.correctAnswer : null}
              isSubmitted={isSubmitted}
              isCorrectAnswer={option === question.correctAnswer}
              onSelect={() => onSelectAnswer(option)}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isSubmitted ? (
          <div className="flex w-full justify-between">
            <Button 
              variant="outline" 
              onClick={onRevealHint}
              disabled={question.hintRevealed || pkStars < hintCost}
              className="flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              Hint ({hintCost} <span className="pk-star">★</span>)
            </Button>
            <Button 
              onClick={onSubmit} 
              disabled={!selectedAnswer}
            >
              Submit Answer
            </Button>
          </div>
        ) : (
          <Button onClick={onNext} className="ml-auto">
            Next Question
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuizQuestion;
