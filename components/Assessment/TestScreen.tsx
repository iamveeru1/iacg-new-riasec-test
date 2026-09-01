import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AssessmentData, UserAnswers } from '../../types';
import QuestionCard from './QuestionCard';
import InstructionScreen from './InstructionScreen';
import { Loader2, Clock } from 'lucide-react';

interface TestScreenProps {
    data: AssessmentData;
    onComplete: (answers: UserAnswers) => void;
    isSubmitting?: boolean;
}

const QUESTION_TIMER_SECONDS = 60;

const TestScreen: React.FC<TestScreenProps> = ({ data, onComplete, isSubmitting = false }) => {
    // -1 indicates "Instructions" view, 0..N-1 indicates current question index
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [answers, setAnswers] = useState<UserAnswers>({});
    const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIMER_SECONDS);

    const allQuestions = useMemo(() => {
        return data.sections.flatMap(s => s.questions);
    }, [data]);

    const totalQuestions = allQuestions.length;
    const answeredCount = Object.keys(answers).length;
    
    // Dynamic progress calculation: increases smoothly along with time elapsed,
    // and reaches the full question percentage upon clicking Next or completing questions
    const timeElapsedInCurrentQuestion = QUESTION_TIMER_SECONDS - timeLeft;
    const timeFraction = Math.min(Math.max(timeElapsedInCurrentQuestion / QUESTION_TIMER_SECONDS, 0), 1);

    const currentProgressValue = isSubmitting 
        ? totalQuestions 
        : currentQuestionIndex >= 0 
            ? currentQuestionIndex + timeFraction 
            : 0;

    const progressWidthExact = totalQuestions > 0 
        ? Math.min((currentProgressValue / totalQuestions) * 100, 100) 
        : 0;

    const progressPercentage = Math.round(progressWidthExact);

    const isInstructions = currentQuestionIndex === -1;
    const currentQuestion = !isInstructions && currentQuestionIndex < totalQuestions ? allQuestions[currentQuestionIndex] : null;
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

    // Check if the current question has been answered
    const isCurrentQuestionAnswered = currentQuestion
        ? (answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== '')
        : false;

    // Keep ref to latest answers and indexes for timer callback
    const answersRef = useRef(answers);
    answersRef.current = answers;

    const currentIndexRef = useRef(currentQuestionIndex);
    currentIndexRef.current = currentQuestionIndex;

    const totalQuestionsRef = useRef(totalQuestions);
    totalQuestionsRef.current = totalQuestions;

    // 60-second countdown timer per question
    useEffect(() => {
        if (isInstructions || isSubmitting) return;

        setTimeLeft(QUESTION_TIMER_SECONDS);

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    // Timer expired: auto-advance to next question or submit
                    if (currentIndexRef.current < totalQuestionsRef.current - 1) {
                        setCurrentQuestionIndex(c => c + 1);
                        window.scrollTo(0, 0);
                    } else {
                        onComplete(answersRef.current);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [currentQuestionIndex, isInstructions, isSubmitting, onComplete]);

    const handleAnswer = (qId: string, val: string) => {
        setAnswers(prev => ({ ...prev, [qId]: val }));
    };

    const handleNext = () => {
        if (currentQuestionIndex === -1) {
            // Moving from Instructions to First Question
            setCurrentQuestionIndex(0);
            setTimeLeft(QUESTION_TIMER_SECONDS);
            window.scrollTo(0, 0);
            return;
        }

        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setTimeLeft(QUESTION_TIMER_SECONDS);
            window.scrollTo(0, 0);
        } else {
            onComplete(answers);
        }
    };

    // Current section title for heading
    const currentSectionTitle = data.sections[0]?.title || 'Assessment';

    return (
        <div className={`flex-1 flex flex-col font-sans bg-gray-50 ${isInstructions ? '' : 'pb-20'}`}>

            {/* Navy Header Bar with Progress - Only show if not instructions */}
            {!isInstructions && (
                <div className="sticky top-16 bg-brand-navy pt-4 pb-6 px-4 shadow-md z-40 select-none transition-all">

                    {/* Progress Bar Area - 96% WIDTH */}
                    <div className="w-full md:max-w-[96%] mx-auto bg-white/10 h-7 relative rounded-full overflow-hidden border border-white/10">
                        <div
                            className="h-full bg-striped-gold flex items-center justify-center text-xs font-bold text-brand-navy transition-all duration-1000 ease-linear shadow-[0_0_20px_rgba(253,184,19,0.5)]"
                            style={{ width: `${Math.max(progressWidthExact, 0)}%` }}
                        >
                            {progressPercentage > 0 && `${progressPercentage}%`}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area - Original 55% width */}
            <div className={`flex-1 w-full md:max-w-[55%] mx-auto px-4 ${isInstructions ? 'py-4 flex items-center justify-center' : 'py-8'}`}>
                {isInstructions ? (
                    <InstructionScreen onStart={handleNext} milestoneTitle={currentSectionTitle} />
                ) : (
                    <>
                        {currentSectionTitle && (
                            <div className="mb-8 border-b-2 border-gray-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <h2 className="text-2xl md:text-3xl font-bold text-brand-navy tracking-tight">{currentSectionTitle}</h2>
                                <div className={`self-start sm:self-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm font-mono font-bold shadow-sm transition-all duration-300 ${timeLeft <= 10 ? 'bg-red-50 text-red-600 border-red-300 animate-pulse' : 'bg-blue-50 text-brand-navy border-blue-200'}`}>
                                    <Clock size={16} className={timeLeft <= 10 ? 'text-red-500' : 'text-brand-gold'} />
                                    <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
                                </div>
                            </div>
                        )}
                        <div className="space-y-8">
                            {currentQuestion && (
                                <QuestionCard
                                    question={currentQuestion}
                                    selectedOption={answers[currentQuestion.id]}
                                    isAnswered={isCurrentQuestionAnswered}
                                    onAnswer={handleAnswer}
                                    globalIndex={currentQuestionIndex + 1}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Footer Navigation - Original fixed bottom bar */}
            {!isInstructions && (
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
                    <div className="w-full md:max-w-[55%] mx-auto flex justify-between items-center">
                        <div className="text-xs text-gray-500 font-medium">
                            {currentQuestionIndex >= 0 && `Question ${currentQuestionIndex + 1} of ${totalQuestions} (${answeredCount} answered)`}
                        </div>
                        <button
                            onClick={handleNext}
                            disabled={!isCurrentQuestionAnswered || isSubmitting}
                            className={`
                                px-10 py-3 rounded-lg font-bold uppercase tracking-widest text-sm shadow-lg transition-all transform flex items-center gap-2
                                ${isCurrentQuestionAnswered && !isSubmitting
                                    ? 'bg-brand-navy text-white hover:bg-brand-navyLight hover:-translate-y-0.5'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                            `}
                        >
                            {isLastQuestion ? (
                                isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Submitting...
                                    </>
                                ) : 'Submit Test'
                            ) : 'Next'}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default TestScreen;