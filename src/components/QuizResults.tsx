
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PKStarCounter from './PKStarCounter';
import { Trophy, RotateCcw } from 'lucide-react';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  pkStars: number;
  onRestart: () => void;
}

const QuizResults = ({ score, totalQuestions, pkStars, onRestart }: QuizResultsProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  let message = '';
  if (percentage >= 90) {
    message = 'Excellent! You really know your stuff!';
  } else if (percentage >= 70) {
    message = 'Great job! You have solid knowledge.';
  } else if (percentage >= 50) {
    message = 'Good effort! Keep learning.';
  } else {
    message = 'Keep studying! You\'ll improve with practice.';
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <Trophy className="h-16 w-16 text-yellow-400" />
        </div>
        <CardTitle className="text-center text-2xl">Quiz Completed!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">{percentage}%</div>
          <p className="text-lg text-muted-foreground">{message}</p>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span>Score:</span>
            <span className="font-medium">{score} / {totalQuestions}</span>
          </div>
          <div className="flex justify-between">
            <span>PK Stars Earned:</span>
            <div className="flex items-center">
              <PKStarCounter pkStars={pkStars} />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onRestart} className="w-full flex items-center justify-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Take Another Quiz
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuizResults;
