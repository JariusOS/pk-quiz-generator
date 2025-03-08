
import { cn } from '@/lib/utils';

interface QuizOptionProps {
  option: string;
  selected: boolean;
  correct: boolean | null;
  isSubmitted: boolean;
  isCorrectAnswer: boolean;
  onSelect: () => void;
}

const QuizOption = ({
  option,
  selected,
  correct,
  isSubmitted,
  isCorrectAnswer,
  onSelect
}: QuizOptionProps) => {
  return (
    <div
      className={cn(
        'quiz-option',
        selected && 'selected',
        isSubmitted && selected && correct && 'correct',
        isSubmitted && selected && correct === false && 'incorrect',
        isSubmitted && isCorrectAnswer && !selected && 'correct'
      )}
      onClick={isSubmitted ? undefined : onSelect}
    >
      <div className="flex items-center">
        <div className="flex-1">{option}</div>
        {isSubmitted && selected && correct && (
          <div className="text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        )}
        {isSubmitted && selected && correct === false && (
          <div className="text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        )}
        {isSubmitted && isCorrectAnswer && !selected && (
          <div className="text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizOption;
