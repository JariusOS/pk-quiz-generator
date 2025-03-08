
import { useState, useEffect } from 'react';
import { QuizQuestion, QuizState } from '@/types/pkData';
import { fetchPKData } from '@/services/learnpoolApi';
import { generateQuiz } from '@/utils/quizGenerator';
import { toast } from '@/hooks/use-toast';

// Default number of questions per quiz
const DEFAULT_QUESTION_COUNT = 5;

// Cost in PK stars to reveal a hint
const HINT_COST = 2;

// PK stars earned for a correct answer
const CORRECT_ANSWER_REWARD = 1;

export const useQuiz = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    selectedAnswer: null,
    isAnswerSubmitted: false,
    isCorrect: null,
    score: 0,
    pkStars: 10, // Starting with 10 PK stars
    completed: false
  });

  // Fetch PK data and generate questions
  const initializeQuiz = async (questionCount = DEFAULT_QUESTION_COUNT) => {
    setLoading(true);
    setError(null);
    
    try {
      const pkData = await fetchPKData();
      const questions = generateQuiz(pkData, questionCount);
      
      setState({
        questions,
        currentQuestionIndex: 0,
        selectedAnswer: null,
        isAnswerSubmitted: false,
        isCorrect: null,
        score: 0,
        pkStars: 10,
        completed: false
      });
    } catch (err) {
      setError('Failed to load quiz data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Select an answer
  const selectAnswer = (answer: string) => {
    if (state.isAnswerSubmitted) return;
    
    setState(prev => ({
      ...prev,
      selectedAnswer: answer
    }));
  };

  // Submit the current answer
  const submitAnswer = () => {
    if (!state.selectedAnswer || state.isAnswerSubmitted) return;
    
    const currentQuestion = state.questions[state.currentQuestionIndex];
    const isCorrect = state.selectedAnswer === currentQuestion.correctAnswer;
    
    // Update score and PK stars
    const newScore = isCorrect ? state.score + 1 : state.score;
    const newPkStars = isCorrect ? state.pkStars + CORRECT_ANSWER_REWARD : state.pkStars;
    
    // Show feedback
    if (isCorrect) {
      toast({
        title: "Correct!",
        description: `You earned 1 PK star.`,
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was: "${currentQuestion.correctAnswer}"`,
        variant: "destructive",
      });
    }
    
    setState(prev => ({
      ...prev,
      isAnswerSubmitted: true,
      isCorrect,
      score: newScore,
      pkStars: newPkStars
    }));
  };

  // Move to the next question
  const nextQuestion = () => {
    const nextIndex = state.currentQuestionIndex + 1;
    const isCompleted = nextIndex >= state.questions.length;
    
    setState(prev => ({
      ...prev,
      currentQuestionIndex: nextIndex,
      selectedAnswer: null,
      isAnswerSubmitted: false,
      isCorrect: null,
      completed: isCompleted
    }));
  };

  // Reveal the PK ID hint
  const revealHint = () => {
    if (state.pkStars < HINT_COST) {
      toast({
        title: "Not enough PK stars",
        description: `You need ${HINT_COST} PK stars to reveal a hint.`,
        variant: "destructive",
      });
      return;
    }
    
    const updatedQuestions = [...state.questions];
    updatedQuestions[state.currentQuestionIndex] = {
      ...updatedQuestions[state.currentQuestionIndex],
      hintRevealed: true
    };
    
    setState(prev => ({
      ...prev,
      questions: updatedQuestions,
      pkStars: prev.pkStars - HINT_COST
    }));
    
    toast({
      title: "Hint Revealed",
      description: `You spent ${HINT_COST} PK stars to reveal the PK number.`,
    });
  };

  // Restart the quiz
  const restartQuiz = () => {
    initializeQuiz();
  };

  // Initialize the quiz on mount
  useEffect(() => {
    initializeQuiz();
  }, []);

  // Get the current question
  const currentQuestion = state.questions[state.currentQuestionIndex];

  return {
    state,
    loading,
    error,
    currentQuestion,
    selectAnswer,
    submitAnswer,
    nextQuestion,
    revealHint,
    restartQuiz,
    initializeQuiz
  };
};
