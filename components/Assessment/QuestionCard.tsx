import React from 'react';
import { Question } from '../../types';
import { Check } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedOption?: string;
  isAnswered: boolean;
  onAnswer: (questionId: string, value: string) => void;
  globalIndex?: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, selectedOption, isAnswered, onAnswer, globalIndex }) => {
  // Priority to globalIndex for sequential numbering (1, 2, 3...) overriding "C1", "C2" from data
  const questionNumber = globalIndex?.toString() || question.questionNumber || question.id;

  // Helper for checkbox handling
  const handleCheckboxChange = (option: string) => {
    const currentSelections = selectedOption ? selectedOption.split(',') : [];
    let newSelections;
    
    if (currentSelections.includes(option)) {
        newSelections = currentSelections.filter(item => item !== option);
    } else {
        newSelections = [...currentSelections, option];
    }
    
    onAnswer(question.id, newSelections.join(','));
  };

  return (
    <div className={`
        bg-white rounded-lg shadow-md border transition-all duration-300 overflow-hidden group relative
        ${isAnswered ? 'border-green-600 border-2 ring-green-600' : 'border-transparent hover:border-gray-300'}
    `}>
        {/* Header Bar with Question Number - Reduced padding */}
        <div className={`
            px-4 py-1.5 w-fit min-w-[50px] flex justify-center rounded-br-lg shadow-sm transition-colors duration-300
            ${isAnswered ? 'bg-green-600' : 'bg-brand-navy'}
        `}>
            <span className="text-white font-bold text-sm">{questionNumber}</span>
        </div>

        {/* Content Body - Reduced padding */}
        <div className="p-4 md:p-6 md:pt-2">
            <div className="mb-4">
                <p className="text-gray-800 text-base md:text-lg font-medium leading-relaxed">
                    {question.text}
                </p>
            </div>

            <div className="space-y-2 pl-1">
                {/* 0-4 SCALE INPUTS (Replaces 1-5) */}
                {question.type === 'scale_0_4' && (
                    <div>
                        <div className="flex justify-between md:justify-start gap-2 md:gap-3 mb-1">
                             {[0, 1, 2, 3, 4].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => onAnswer(question.id, num.toString())}
                                    className={`
                                        flex-1 md:flex-none w-10 h-10 md:w-14 md:h-14 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-200 group/btn
                                        ${selectedOption === num.toString()
                                            ? 'bg-brand-navy border-brand-navy text-white shadow-md transform -translate-y-0.5'
                                            : 'bg-white border-gray-200 text-gray-500 hover:border-brand-gold hover:text-brand-gold'}
                                    `}
                                >
                                    <span className="text-base md:text-lg font-bold">{num}</span>
                                </button>
                             ))}
                        </div>
                    </div>
                )}

                {/* RADIO INPUTS */}
                {question.type === 'radio' && question.options?.map((option) => (
                    <label 
                        key={option}
                        className={`
                            flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 group/option
                            ${selectedOption === option 
                                ? 'bg-blue-50/30 border-blue-200 shadow-sm' 
                                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                        `}
                    >
                        <div className="relative flex items-center justify-center w-4 h-4 mr-3 shrink-0">
                            <input 
                                type="radio"
                                name={`q-${question.id}`}
                                value={option}
                                checked={selectedOption === option}
                                onChange={() => onAnswer(question.id, option)}
                                className={`
                                    peer appearance-none w-4 h-4 rounded-full border-2 transition-colors
                                    ${selectedOption === option ? 'border-brand-navy' : 'border-gray-300'}
                                `}
                            />
                            <div className="absolute w-2 h-2 rounded-full bg-brand-navy scale-0 peer-checked:scale-100 transition-transform duration-200"></div>
                        </div>
                        <span className={`text-sm md:text-base ${selectedOption === option ? 'text-brand-navy font-semibold' : 'text-gray-600 group-hover/option:text-gray-900'}`}>
                            {option}
                        </span>
                    </label>
                ))}

                {/* CHECKBOX INPUTS */}
                {question.type === 'checkbox' && question.options?.map((option) => {
                    const isChecked = selectedOption ? selectedOption.split(',').includes(option) : false;
                    return (
                        <label 
                            key={option}
                            className={`
                                flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 group/option
                                ${isChecked
                                    ? 'bg-blue-50/30 border-blue-200 shadow-sm' 
                                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                            `}
                        >
                            <div className={`
                                relative flex items-center justify-center w-4 h-4 mr-3 shrink-0 rounded border-2 transition-colors
                                ${isChecked ? 'bg-brand-navy border-brand-navy' : 'bg-white border-gray-300'}
                            `}>
                                <input 
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleCheckboxChange(option)}
                                    className="appearance-none absolute inset-0 w-full h-full cursor-pointer"
                                />
                                {isChecked && <Check size={12} className="text-white" strokeWidth={3} />}
                            </div>
                            <span className={`text-sm md:text-base ${isChecked ? 'text-brand-navy font-semibold' : 'text-gray-600 group-hover/option:text-gray-900'}`}>
                                {option}
                            </span>
                        </label>
                    );
                })}

                {/* TEXT & TEXTAREA INPUTS */}
                {(question.type === 'text' || question.type === 'textarea') && (
                    <div className="relative">
                        {question.type === 'textarea' ? (
                             <textarea 
                                className="w-full border-2 border-gray-200 p-3 rounded-lg text-sm md:text-base focus:border-brand-navy focus:ring-0 outline-none transition-colors bg-gray-50 focus:bg-white h-24 resize-none"
                                value={selectedOption || ''}
                                onChange={(e) => onAnswer(question.id, e.target.value)}
                                placeholder="Type your answer here..."
                             />
                        ) : (
                            <input 
                                type="text" 
                                className="w-full border-2 border-gray-200 p-3 rounded-lg text-sm md:text-base focus:border-brand-navy focus:ring-0 outline-none transition-colors bg-gray-50 focus:bg-white"
                                value={selectedOption || ''}
                                onChange={(e) => onAnswer(question.id, e.target.value)}
                                placeholder="Type your answer here..."
                            />
                        )}
                    </div>
                )}
                
                {/* RATING INPUTS (Legacy) */}
                {question.type === 'rating' && (
                    <div className="flex gap-2 items-center flex-wrap">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <button
                                key={num}
                                onClick={() => onAnswer(question.id, num.toString())}
                                className={`
                                    w-8 h-8 rounded-lg font-bold text-sm transition-all
                                    ${selectedOption === num.toString()
                                        ? 'bg-brand-navy text-white shadow-md scale-110'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                                `}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default QuestionCard;