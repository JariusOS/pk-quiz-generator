
export interface PKData {
  pk_id: number;
  submission_text: string;
  category: string;
  correct_answer?: string;
  alternative_answers?: string[];
  difficulty_level?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  pkId: number;
  category: string;
  hintRevealed: boolean;
}

export interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  isAnswerSubmitted: boolean;
  isCorrect: boolean | null;
  score: number;
  pkStars: number;
  completed: boolean;
}
