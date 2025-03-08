
import QuizContainer from '@/components/QuizContainer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const Quiz = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">LearnPool MCQ Quiz</h1>
          <Link to="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
        </header>
        
        <main>
          <QuizContainer />
        </main>
      </div>
    </div>
  );
};

export default Quiz;
