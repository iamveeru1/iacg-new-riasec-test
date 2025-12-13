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
    // -1 indicates "Instructions" view
    const [currentSectionIndex, setCurrentSectionIndex] = useState(-1);
    const [answers, setAnswers] = useState<UserAnswers>({});

    const allQuestions = useMemo(() => {
        return data.sections.flatMap(s => s.questions);
    }, [data]);

    const totalQuestions = allQuestions.length;
    const answeredCount = Object.keys(answers).length;
    const progressPercentage = Math.round((answeredCount / totalQuestions) * 100);

    // Derive current section content
    const currentSection = currentSectionIndex >= 0 ? data.sections[currentSectionIndex] : null;

    const isCurrentSectionComplete = currentSection
        ? currentSection.questions.every(q => {
            if (q.type === 'text' || q.type === 'textarea' || q.type === 'rating') {
                return answers[q.id] && answers[q.id].toString().trim().length > 0;
            }
            return answers[q.id];
        })
        : false;

    const handleAnswer = (qId: string, val: string) => {
        setAnswers(prev => ({ ...prev, [qId]: val }));
    };

    const handleNext = () => {
        if (currentSectionIndex === -1) {
            // Moving from Instructions to First Section
            setCurrentSectionIndex(0);
            window.scrollTo(0, 0);
            return;
        }

        if (currentSectionIndex < data.sections.length - 1) {
            setCurrentSectionIndex(prev => prev + 1);
            window.scrollTo(0, 0);
        } else {
            onComplete(answers);
        }
    };

    // Check if a specific question is answered
    const isQuestionAnswered = (qId: string) => {
        const val = answers[qId];
        return val !== undefined && val.toString().trim().length > 0;
    };

    const isInstructions = currentSectionIndex === -1;

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

            {/* Main Content Area - Reduced to 55% width for focused look */}
            <div className={`flex-1 w-full md:max-w-[55%] mx-auto px-4 ${isInstructions ? 'py-4 flex items-center justify-center' : 'py-8'}`}>
                {isInstructions ? (
                    <InstructionScreen onStart={handleNext} />
                ) : (
                    <>
                        {currentSection && (
                            <div className="mb-8 border-b-2 border-gray-200 pb-4">
                                <h2 className="text-2xl md:text-3xl font-bold text-brand-navy tracking-tight">{currentSection.title}</h2>
                            </div>
                        )}
                        <div className="space-y-8">
                            {/* Section Questions */}
                            {currentSection && currentSection.questions.map((q, qIdx) => {
                                // Group Logic: Show subheading if it's the first item, or if it differs from previous item's subheading
                                const prevQ = qIdx > 0 ? currentSection.questions[qIdx - 1] : null;
                                const showSubheading = q.subheading && (!prevQ || prevQ.subheading !== q.subheading);

                                return (
                                    <React.Fragment key={q.id}>
                                        {showSubheading && (
                                            <div className="mt-10 mb-6">
                                                <h3 className="text-xl font-bold text-brand-navy border-b-[3px] border-brand-gold inline-block pb-1 pr-8 tracking-wide">
                                                    {q.subheading}
                                                </h3>
                                            </div>
                                        )}
                                        <QuestionCard
                                            question={q}
                                            selectedOption={answers[q.id]}
                                            isAnswered={isQuestionAnswered(q.id)}
                                            onAnswer={handleAnswer}
                                            globalIndex={allQuestions.findIndex(aq => aq.id === q.id) + 1}
                                        />
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Footer Navigation - Only show if not instructions */}
            {!isInstructions && (
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
                    <div className="w-full md:max-w-[55%] mx-auto flex justify-between items-center">
                        <div className="text-xs text-gray-400 font-medium">
                            {currentSectionIndex >= 0 && `${answeredCount} of ${totalQuestions} answered`}
                        </div>
                        {currentSectionIndex !== -1 && (
                            <button
                                onClick={handleNext}
                                disabled={!isCurrentSectionComplete || isSubmitting}
                                className={`
                            px-10 py-3 rounded-lg font-bold uppercase tracking-widest text-sm shadow-lg transition-all transform flex items-center gap-2
                            ${isCurrentSectionComplete && !isSubmitting
                                        ? 'bg-brand-navy text-white hover:bg-brand-navyLight hover:-translate-y-0.5'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                        `}
                            >
                                {currentSectionIndex === data.sections.length - 1 ? (
                                    isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            Submitting...
                                        </>
                                    ) : 'Submit Assessment'
                                ) : 'Next Section'}
                            </button>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default TestScreen;