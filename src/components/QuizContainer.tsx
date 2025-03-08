
import { useQuiz } from '@/hooks/useQuiz';
import QuizQuestion from './QuizQuestion';
import QuizProgress from './QuizProgress';
import QuizResults from './QuizResults';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const QuizContainer = () => {
  const {
    state,
    loading,
    error,
    currentQuestion,
    selectAnswer,
    submitAnswer,
    nextQuestion,
    revealHint,
    restartQuiz
  } = useQuiz();

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="w-full max-w-3xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (state.completed) {
    return (
      <QuizResults
        score={state.score}
        totalQuestions={state.questions.length}
        pkStars={state.pkStars}
        onRestart={restartQuiz}
      />
    );
  }

  return (
    <div className="w-full space-y-6">
      <QuizProgress
        currentQuestion={state.currentQuestionIndex}
        totalQuestions={state.questions.length}
      />
      
      {currentQuestion && (
        <QuizQuestion
          question={currentQuestion}
          selectedAnswer={state.selectedAnswer}
          isSubmitted={state.isAnswerSubmitted}
          isCorrect={state.isCorrect}
          pkStars={state.pkStars}
          onSelectAnswer={selectAnswer}
          onSubmit={submitAnswer}
          onNext={nextQuestion}
          onRevealHint={revealHint}
        />
      )}
    </div>
  );
};

export default QuizContainer;
