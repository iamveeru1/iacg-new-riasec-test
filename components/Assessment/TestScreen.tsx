import React, { useState, useMemo } from 'react';
import { AssessmentData, UserAnswers } from '../../types';
import QuestionCard from './QuestionCard';
import InstructionScreen from './InstructionScreen';
import { Loader2 } from 'lucide-react';

interface TestScreenProps {
    data: AssessmentData;
    onComplete: (answers: UserAnswers) => void;
    isSubmitting?: boolean;
}

const TestScreen: React.FC<TestScreenProps> = ({ data, onComplete, isSubmitting = false }) => {
    // -1 indicates "Instructions" view, 0..N-1 indicates current question index
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
    const [answers, setAnswers] = useState<UserAnswers>({});

    const allQuestions = useMemo(() => {
        return data.sections.flatMap(s => s.questions);
    }, [data]);

    const totalQuestions = allQuestions.length;
    const answeredCount = Object.keys(answers).length;
    const progressPercentage = Math.round((answeredCount / totalQuestions) * 100);

    const isInstructions = currentQuestionIndex === -1;
    const currentQuestion = !isInstructions && currentQuestionIndex < totalQuestions ? allQuestions[currentQuestionIndex] : null;
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

    // Check if the current question has been answered
    const isCurrentQuestionAnswered = currentQuestion
        ? (answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== '')
        : false;

    const handleAnswer = (qId: string, val: string) => {
        setAnswers(prev => ({ ...prev, [qId]: val }));
    };

    const handleNext = () => {
        if (currentQuestionIndex === -1) {
            // Moving from Instructions to First Question
            setCurrentQuestionIndex(0);
            window.scrollTo(0, 0);
            return;
        }

        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
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
                            className="h-full bg-striped-gold flex items-center justify-center text-xs font-bold text-brand-navy transition-all duration-700 ease-out shadow-[0_0_20px_rgba(253,184,19,0.5)]"
                            style={{ width: `${Math.max(progressPercentage, 0)}%` }}
                        >
                            {progressPercentage > 0 && `${progressPercentage}%`}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area - Original 55% width */}
            <div className={`flex-1 w-full md:max-w-[55%] mx-auto px-4 ${isInstructions ? 'py-4 flex items-center justify-center' : 'py-8'}`}>
                {isInstructions ? (
                    <InstructionScreen onStart={handleNext} />
                ) : (
                    <>
                        {currentSectionTitle && (
                            <div className="mb-8 border-b-2 border-gray-200 pb-4">
                                <h2 className="text-2xl md:text-3xl font-bold text-brand-navy tracking-tight">{currentSectionTitle}</h2>
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
                        <div className="text-xs text-gray-400 font-medium">
                            {currentQuestionIndex >= 0 && `${answeredCount} of ${totalQuestions} answered`}
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