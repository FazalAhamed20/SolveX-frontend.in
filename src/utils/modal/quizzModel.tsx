// QuizModal.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaTrophy, 
  FaBolt, FaMedal, FaRegLightbulb, FaFireAlt
} from 'react-icons/fa';
import confetti from 'canvas-confetti';
import { generateQuizQuestions } from '../chatBot/geminiApi';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
  topic:string
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, onComplete,topic }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      loadQuestions();
    }
  }, [isOpen, topic]);

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const questions = await generateQuizQuestions(topic, 5);
      setQuizQuestions(questions);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load questions:', error);
      setIsLoading(false);
    }
  };

useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && timeLeft > 0 && !showResult && !isLoading) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleQuizEnd();
    }
    return () => clearInterval(timer);
  }, [isOpen, timeLeft, showResult, isLoading]);

  const handleAnswerClick = (selectedAnswer: string) => {
    const correct = selectedAnswer === quizQuestions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore((prevScore) => prevScore + 1);
      setStreak((prevStreak) => prevStreak + 1);
      if (streak === 2) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
        setTimeLeft(30);
      } else {
        handleQuizEnd();
      }
    }, 1500);
  };

  const handleQuizEnd = () => {
    setShowResult(true);
    if (score > quizQuestions.length / 2) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setShowResult(false);
    setStreak(0);
    loadQuestions();
  };

  const closeQuiz = () => {
    onClose();
    resetQuiz();
    onComplete(score);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
  };

  const optionVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
         {isLoading ? (
            <div className="text-center">
              <FaRegLightbulb className="text-4xl text-yellow-500 animate-pulse mx-auto mb-4" />
              <p>Generating quiz questions...</p>
            </div>
          ) : !showResult ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Daily Quiz</h2>
                <motion.div 
                  className="flex items-center"
                  animate={{ color: timeLeft <= 10 ? '#EF4444' : '#000000' }}
                >
                  <FaHourglassHalf className="mr-2" />
                  <span className="font-bold">{timeLeft}s</span>
                </motion.div>
              </div>
              <div className="mb-4">
                <p className="font-semibold">{quizQuestions[currentQuestion].question}</p>
              </div>
              <div className="space-y-2">
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    className="w-full p-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors duration-150"
                    onClick={() => handleAnswerClick(option)}
                    variants={optionVariants}
                    whileHover="hover"
                    whileTap="tap"
                    disabled={showFeedback}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <p>Question {currentQuestion + 1} of {quizQuestions.length}</p>
                <div className="flex items-center">
                  <FaBolt className="text-yellow-500 mr-1" />
                  <span className="font-bold">{streak}</span>
                </div>
              </div>
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mt-4 p-2 rounded ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {isCorrect ? (
                      <div className="flex items-center">
                        <FaCheckCircle className="mr-2" />
                        Correct!
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <FaTimesCircle className="mr-2" />
                        Incorrect. The correct answer is: {quizQuestions[currentQuestion].correctAnswer}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
              <div className="text-center">
                <FaTrophy className="text-6xl text-yellow-500 mx-auto mb-4" />
                <p className="text-xl mb-2">Your Score:</p>
                <p className="text-3xl font-bold mb-4">{score} / {quizQuestions.length}</p>
                <div className="flex justify-center space-x-2 mb-4">
                  {[...Array(quizQuestions.length)].map((_, index) => (
                    index < score ? (
                      <FaCheckCircle key={index} className="text-green-500 text-2xl" />
                    ) : (
                      <FaTimesCircle key={index} className="text-red-500 text-2xl" />
                    )
                  ))}
                </div>
                <div className="flex justify-center space-x-4 mb-4">
                  {score === quizQuestions.length && (
                    <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                      <FaMedal className="mr-2" />
                      Perfect Score!
                    </div>
                  )}
                  {streak >= 3 && (
                    <div className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full">
                      <FaFireAlt className="mr-2" />
                      Hot Streak!
                    </div>
                  )}
                </div>
                <motion.button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-150"
                  onClick={closeQuiz}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuizModal;