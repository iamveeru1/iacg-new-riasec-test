import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Trophy, 
  Home, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  User as UserIcon, 
  Hash, 
  BookOpen, 
  Clock, 
  Check, 
  X,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { User, AssessmentData, UserAnswers } from '../../types';

interface SubmissionSuccessScreenProps {
  user: User | null;
  assessmentData: AssessmentData | null;
  userAnswers: UserAnswers;
  onGoHome: () => void;
}

const SubmissionSuccessScreen: React.FC<SubmissionSuccessScreenProps> = ({ 
  user, 
  assessmentData, 
  userAnswers, 
  onGoHome 
}) => {
  const [showReview, setShowReview] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'wrong'>('all');

  const allQuestions = assessmentData?.sections.flatMap(s => s.questions) || [];
  const totalQuestions = allQuestions.length;

  let correctCount = 0;
  const questionResults = allQuestions.map((q, index) => {
    const userAnswer = userAnswers[q.id] || '';
    const isCorrect = userAnswer === q.correctAnswer;
    if (isCorrect) correctCount++;
    return {
      index: index + 1,
      question: q,
      userAnswer,
      isCorrect,
      isAnswered: Boolean(userAnswer)
    };
  });

  const wrongCount = totalQuestions - correctCount;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const testTitle = assessmentData?.sections[0]?.title || 'Architecture, Construction & Built Environment';

  // Performance rating badge
  const getPerformanceBadge = (pct: number) => {
    if (pct >= 85) return { label: 'Outstanding Performance', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Trophy };
    if (pct >= 70) return { label: 'Great Job! Well Done', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Award };
    if (pct >= 50) return { label: 'Good Effort! Keep Growing', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Sparkles };
    return { label: 'Assessment Completed', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: BarChart3 };
  };

  const performance = getPerformanceBadge(percentage);
  const PerformanceIcon = performance.icon;

  const filteredQuestions = questionResults.filter(item => {
    if (filterType === 'correct') return item.isCorrect;
    if (filterType === 'wrong') return !item.isCorrect;
    return true;
  });

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        
        {/* Main Result Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Header Banner - IACG Navy & Gold Accent */}
          <div className="bg-brand-navy p-6 md:p-8 text-white relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-16 h-16 rounded-2xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center shrink-0 shadow-inner">
                  <CheckCircle2 className="w-9 h-9 text-brand-gold" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-brand-gold border border-white/10 mb-1.5">
                    <PerformanceIcon size={13} />
                    {performance.label}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                    Test Submitted Successfully!
                  </h1>
                  <p className="text-sm text-gray-300 mt-1">
                    {testTitle}
                  </p>
                </div>
              </div>

              {/* Large Score Circle */}
              <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center shrink-0 min-w-[140px]">
                <div className="text-xs uppercase tracking-wider text-gray-300 font-medium">Your Score</div>
                <div className="text-3xl md:text-4xl font-extrabold text-brand-gold mt-0.5">
                  {percentage}%
                </div>
                <div className="text-xs text-gray-300 mt-0.5 font-medium">
                  {correctCount} / {totalQuestions} Marks
                </div>
              </div>
            </div>
          </div>

          {/* Candidate Details Strip */}
          <div className="bg-slate-100/80 px-6 py-3.5 border-b border-gray-200/80 flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <UserIcon size={15} className="text-brand-navy shrink-0" />
              <span className="font-medium text-gray-500">Candidate:</span>
              <span className="font-bold text-brand-navy">{user?.name || user?.email}</span>
            </div>
            {user?.rollNumber && (
              <div className="flex items-center gap-2">
                <Hash size={15} className="text-brand-navy shrink-0" />
                <span className="font-medium text-gray-500">Roll No:</span>
                <span className="font-bold text-brand-navy">{user.rollNumber}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <BookOpen size={15} className="text-brand-navy shrink-0" />
              <span className="font-medium text-gray-500">Institution:</span>
              <span className="font-bold text-brand-navy">{user?.school || 'IACG Multimedia College'}</span>
            </div>
          </div>

          {/* Key Metrics Grid - 4 Metric Cards */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Total Questions */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3.5 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <HelpCircle size={24} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Questions</div>
                  <div className="text-2xl font-bold text-gray-900 mt-0.5">{totalQuestions}</div>
                </div>
              </div>

              {/* Correct Answers */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-center gap-3.5 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Correct Answers</div>
                  <div className="text-2xl font-bold text-emerald-800 mt-0.5">{correctCount}</div>
                </div>
              </div>

              {/* Wrong Answers */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 flex items-center gap-3.5 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <XCircle size={24} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-rose-700">Wrong Answers</div>
                  <div className="text-2xl font-bold text-rose-800 mt-0.5">{wrongCount}</div>
                </div>
              </div>

              {/* Accuracy Percentage */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-center gap-3.5 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Trophy size={24} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">Accuracy Rate</div>
                  <div className="text-2xl font-bold text-amber-800 mt-0.5">{percentage}%</div>
                </div>
              </div>

            </div>

            {/* Visual Progress Ratio Bar */}
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-600">
                <span className="flex items-center gap-1 text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  Correct: {correctCount} ({percentage}%)
                </span>
                <span className="flex items-center gap-1 text-rose-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                  Wrong: {wrongCount} ({100 - percentage}%)
                </span>
              </div>
              <div className="w-full h-3 bg-rose-200 rounded-full overflow-hidden flex">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-1000 ease-out" 
                  style={{ width: `${percentage}%` }}
                />
                <div 
                  className="bg-rose-500 h-full transition-all duration-1000 ease-out" 
                  style={{ width: `${100 - percentage}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => setShowReview(!showReview)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-brand-navy bg-slate-100 hover:bg-slate-200 transition-colors text-sm border border-slate-300/80"
              >
                {showReview ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                {showReview ? 'Hide Question Breakdown' : 'Review Questions & Answers'}
              </button>

              <button
                onClick={onGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-navy text-white rounded-xl font-bold hover:bg-brand-navyLight transition-all text-sm shadow-lg shadow-brand-navy/20 hover:-translate-y-0.5 uppercase tracking-wide"
              >
                <Home size={17} />
                <span>Back to Home</span>
              </button>
            </div>

          </div>
        </div>

        {/* Detailed Question Review Section */}
        {showReview && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 animate-fade-in space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-brand-navy">Questions Breakdown</h3>
                <p className="text-xs text-gray-500 mt-0.5">Review each question with your answer and the correct explanation</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterType === 'all' ? 'bg-white text-brand-navy shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  All ({totalQuestions})
                </button>
                <button
                  onClick={() => setFilterType('correct')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterType === 'correct' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700 hover:text-emerald-900'}`}
                >
                  Correct ({correctCount})
                </button>
                <button
                  onClick={() => setFilterType('wrong')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterType === 'wrong' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-700 hover:text-rose-900'}`}
                >
                  Wrong ({wrongCount})
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredQuestions.map((item) => (
                <div 
                  key={item.question.id}
                  className={`p-4 md:p-5 rounded-xl border transition-all ${item.isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs uppercase px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-700 shadow-sm">
                        Q{item.index}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md ${item.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {item.isCorrect ? <Check size={13} strokeWidth={3} /> : <X size={13} strokeWidth={3} />}
                        {item.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm md:text-base font-semibold text-gray-900 mb-3.5 leading-relaxed">
                    {item.question.text}
                  </p>

                  <div className="space-y-2 text-xs md:text-sm">
                    {/* User's Answer */}
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-gray-500 min-w-[100px] shrink-0">Your Answer:</span>
                      <span className={`font-medium ${item.isCorrect ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}`}>
                        {item.userAnswer || <span className="italic text-gray-400">Not Attempted</span>}
                      </span>
                    </div>

                    {/* Correct Answer (shown when wrong) */}
                    {!item.isCorrect && item.question.correctAnswer && (
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-emerald-700 min-w-[100px] shrink-0">Correct Answer:</span>
                        <span className="font-bold text-emerald-800">
                          {item.question.correctAnswer}
                        </span>
                      </div>
                    )}

                    {/* Explanation */}
                    {item.question.explanation && (
                      <div className="mt-2.5 pt-2.5 border-t border-gray-200/60 text-xs text-gray-600 leading-relaxed bg-white/70 p-2.5 rounded-lg">
                        <span className="font-bold text-gray-700">Explanation: </span>
                        {item.question.explanation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default SubmissionSuccessScreen;
