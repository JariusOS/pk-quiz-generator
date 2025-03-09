
import { PKData, QuizQuestion } from '@/types/pkData';

/**
 * Generates an MCQ question from PK data
 */
export const generateQuestion = (pkData: PKData): QuizQuestion => {
  // Extract key information from the submission text
  const submissionText = pkData.submission_text;
  
  // Generate a question from the submission
  const question = generateQuestionFromText(submissionText);
  
  // Generate options (1 correct, 3 incorrect)
  const correctAnswer = pkData.correct_answer || extractCorrectAnswer(submissionText);
  let options = [correctAnswer];
  
  // Add alternative answers if available, otherwise generate distractors
  if (pkData.alternative_answers && pkData.alternative_answers.length > 0) {
    options = [...options, ...pkData.alternative_answers.slice(0, 3)];
  } else {
    const distractors = generateDistractors(submissionText, correctAnswer, pkData.category);
    options = [...options, ...distractors];
  }
  
  // Limit to 4 options and shuffle them
  options = options.slice(0, 4);
  if (options.length < 4) {
    // Fill with generic options if we don't have enough
    const fillerOptions = [
      "None of the above",
      "All of the above",
      "It depends on the context",
      "There is no definitive answer"
    ];
    
    for (let i = 0; i < fillerOptions.length && options.length < 4; i++) {
      if (!options.includes(fillerOptions[i])) {
        options.push(fillerOptions[i]);
      }
    }
  }
  
  // Shuffle the options
  options = shuffleArray(options);
  
  return {
    id: `q-${pkData.pk_id}`,
    question,
    options,
    correctAnswer,
    pkId: pkData.pk_id,
    category: pkData.category,
    hintRevealed: false
  };
};

/**
 * Simple algorithm to generate a question from text
 */
const generateQuestionFromText = (text: string): string => {
  // This is a simplified implementation - in a production app, 
  // we'd use more sophisticated NLP techniques
  
  // Extract key concepts
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length === 0) return "What does this content refer to?";
  
  // Take the first sentence and try to form a question
  const mainSentence = sentences[0].trim();
  
  // Look for common patterns
  if (mainSentence.includes(" is ")) {
    const parts = mainSentence.split(" is ");
    return `What is ${parts[0]}?`;
  }
  
  if (mainSentence.includes(" are ")) {
    const parts = mainSentence.split(" are ");
    return `What are ${parts[0]}?`;
  }
  
  if (mainSentence.toLowerCase().startsWith("the ")) {
    return `What does this statement describe: "${mainSentence}"?`;
  }
  
  // Default question
  return `Which of the following statements about ${mainSentence.substring(0, 30)}... is correct?`;
};

/**
 * Extract potential correct answer from text
 */
const extractCorrectAnswer = (text: string): string => {
  // In a real implementation, this would use NLP to extract key concepts
  // For now, we'll return the first sentence as the correct answer
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  return sentences[0]?.trim() || "The statement is correct as presented";
};

/**
 * Generate plausible but incorrect answers
 */
const generateDistractors = (text: string, correctAnswer: string, category: string): string[] => {
  // In a real app, we would generate contextually relevant wrong answers
  // For this demo, we'll use some generic distractors
  const genericDistractors = [
    "The opposite is true",
    "This only applies in specific circumstances",
    "This is a common misconception",
    "This was true in the past but is no longer accurate",
    "Only part of this statement is correct",
    "This is subject to ongoing debate",
    "This applies only to a subset of cases"
  ];
  
  // Return three random distractors
  return shuffleArray(genericDistractors).slice(0, 3);
};

/**
 * Shuffle an array using Fisher-Yates algorithm
 * Fixed the error by ensuring we handle null/undefined arrays properly
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return [];
  }
  
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Generate a set of quiz questions from PK data
 */
export const generateQuiz = (pkData: PKData[], questionCount: number = 5): QuizQuestion[] => {
  // Check if pkData is valid
  if (!pkData || !Array.isArray(pkData) || pkData.length === 0) {
    return [];
  }
  
  // Shuffle PK data
  const shuffledData = shuffleArray(pkData);
  
  // Take a subset for the quiz
  const quizData = shuffledData.slice(0, questionCount);
  
  // Generate questions
  return quizData.map(item => generateQuestion(item));
};
