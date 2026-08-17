import React from 'react';
import { Question } from '../../types';
import { Check, X, CheckCircle2, XCircle, Info } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedOption?: string;
  isAnswered: boolean;
  onAnswer: (questionId: string, value: string) => void;
  globalIndex?: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, selectedOption, isAnswered, onAnswer, globalIndex }) => {
  const questionNumber = globalIndex?.toString() || question.questionNumber || question.id;

  // MCQ-specific logic
  const isMCQ = question.type === 'mcq';
  const isCorrect = isMCQ && selectedOption === question.correctAnswer;
  const isWrong = isMCQ && selectedOption !== undefined && selectedOption !== question.correctAnswer;

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

  // Border colour logic
  const borderClass = isMCQ
    ? isCorrect
      ? 'border-green-500 border-2 ring-1 ring-green-300'
      : isWrong
      ? 'border-red-400 border-2 ring-1 ring-red-200'
      : 'border-transparent hover:border-gray-300'
    : isAnswered
    ? 'border-green-600 border-2 ring-green-600'
    : 'border-transparent hover:border-gray-300';

  // Header badge colour
  const headerBg = isMCQ
    ? isCorrect
      ? 'bg-green-600'
      : isWrong
      ? 'bg-red-500'
      : 'bg-brand-navy'
    : isAnswered
    ? 'bg-green-600'
    : 'bg-brand-navy';

  return (
    <div className={`
        bg-white rounded-lg shadow-md border transition-all duration-300 overflow-hidden group relative
        ${borderClass}
    `}>
      {/* Header Bar with Question Number */}
      <div className={`
          px-4 py-1.5 w-fit min-w-[50px] flex justify-center rounded-br-lg shadow-sm transition-colors duration-300
          ${headerBg}
      `}>
        <span className="text-white font-bold text-sm">{questionNumber}</span>
      </div>

      {/* Content Body */}
      <div className="p-4 md:p-6 md:pt-2">
        <div className="mb-4">
          <p className="text-gray-800 text-base md:text-lg font-medium leading-relaxed">
            {question.text}
          </p>
        </div>

        <div className="space-y-2 pl-1">

          {/* ==================== MCQ INPUTS ==================== */}
          {isMCQ && question.options?.map((option) => {
            const isSelected = selectedOption === option;
            const isThisCorrect = option === question.correctAnswer;
            const answered = selectedOption !== undefined;

            let optionStyle = 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer';
            let labelIcon: React.ReactNode = null;

            if (answered) {
              if (isThisCorrect) {
                // Always highlight correct answer green when answered
                optionStyle = 'bg-green-50 border-green-500 cursor-default';
                labelIcon = <CheckCircle2 size={18} className="text-green-600 shrink-0 ml-auto" />;
              } else if (isSelected && !isThisCorrect) {
                // Selected wrong answer — highlight red
                optionStyle = 'bg-red-50 border-red-400 cursor-default';
                labelIcon = <XCircle size={18} className="text-red-500 shrink-0 ml-auto" />;
              } else {
                // Other unselected options — muted
                optionStyle = 'bg-gray-50 border-gray-100 cursor-default opacity-60';
              }
            } else if (isSelected) {
              optionStyle = 'bg-blue-50 border-brand-navy cursor-pointer';
            }

            return (
              <button
                key={option}
                type="button"
                disabled={answered}
                onClick={() => !answered && onAnswer(question.id, option)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-200
                  ${optionStyle}
                `}
              >
                {/* Option label bubble (A/B/C/D) */}
                <span className={`
                  w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border
                  ${answered && isThisCorrect ? 'bg-green-600 text-white border-green-600' :
                    answered && isSelected && !isThisCorrect ? 'bg-red-500 text-white border-red-500' :
                    'bg-gray-100 text-gray-600 border-gray-200'}
                `}>
                  {['A', 'B', 'C', 'D'][question.options!.indexOf(option)]}
                </span>

                <span className={`text-sm md:text-base flex-1 leading-snug ${
                  answered && isThisCorrect ? 'text-green-800 font-semibold' :
                  answered && isSelected && !isThisCorrect ? 'text-red-700' :
                  'text-gray-700'
                }`}>
                  {option}
                </span>

                {labelIcon}
              </button>
            );
          })}

          {/* MCQ Feedback Panel — shown after answering */}
          {isMCQ && selectedOption !== undefined && (
            <div className={`mt-4 p-4 rounded-xl border-l-4 ${
              isCorrect
                ? 'bg-green-50 border-green-500'
                : 'bg-amber-50 border-amber-500'
            }`}>
              <div className="flex items-start gap-2">
                {isCorrect
                  ? <CheckCircle2 size={18} className="text-green-600 mt-0.5 shrink-0" />
                  : <Info size={18} className="text-amber-600 mt-0.5 shrink-0" />
                }
                <div>
                  {!isCorrect && (
                    <p className="text-xs font-bold text-amber-700 mb-1 uppercase tracking-wide">
                      Correct Answer: <span className="text-green-700">{question.correctAnswer}</span>
                    </p>
                  )}
                  {isCorrect && (
                    <p className="text-xs font-bold text-green-700 mb-1 uppercase tracking-wide">
                      Correct! ✓
                    </p>
                  )}
                  {question.explanation && (
                    <p className="text-xs text-gray-700 leading-relaxed">
                      <span className="font-semibold">Explanation: </span>
                      {question.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== SCALE 0-4 INPUTS ==================== */}
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

          {/* ==================== RADIO INPUTS ==================== */}
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

          {/* ==================== CHECKBOX INPUTS ==================== */}
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

          {/* ==================== TEXT & TEXTAREA INPUTS ==================== */}
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

          {/* ==================== RATING INPUTS (Legacy) ==================== */}
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