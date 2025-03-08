
import QuizContainer from '@/components/QuizContainer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const Quiz = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">LearnPool MCQ Quiz</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Test your knowledge with questions generated from LearnPool's Public Knowledge database.
            Answer correctly to earn PK stars!
          </p>
        </header>
        
        <main>
          <QuizContainer />
        </main>
      </div>
    </div>
  );
};

export default Quiz;
