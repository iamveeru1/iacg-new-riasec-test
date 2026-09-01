import React from 'react';
import { ArrowRight, ClipboardList, CheckCircle2, XCircle, Info, BookOpen } from 'lucide-react';

interface InstructionScreenProps {
    onStart: () => void;
    milestoneTitle?: string;
}

const InstructionScreen: React.FC<InstructionScreenProps> = ({ onStart, milestoneTitle = 'Multi-Disciplinary Assessment' }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mt-1 animate-fade-in max-w-4xl mx-auto">
            {/* Compact Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                <div className="w-7 h-7 rounded-full bg-brand-navy flex items-center justify-center">
                    <ClipboardList size={15} className="text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-brand-navy tracking-tight">
                        Test Instructions
                    </h2>
                    <p className="text-xs text-gray-500">{milestoneTitle} · MCQ Assessment</p>
                </div>
            </div>

            <div className="p-6 space-y-5">
                <p className="text-gray-600 text-sm leading-relaxed">
                    This is a <strong>Multiple Choice Question (MCQ)</strong> assessment on <em>{milestoneTitle}</em>.
                    Read each question carefully and select the best answer from the four options provided.
                </p>

                {/* Highlighted Banner */}
                <div className="bg-brand-navy p-4 rounded-lg shadow-md shadow-brand-navy/10 text-center">
                    <p className="font-bold text-white text-sm md:text-base leading-relaxed tracking-wide">
                        20 QUESTIONS · <span className="text-brand-gold">60 SECONDS PER QUESTION</span> · 1 ATTEMPT PER STUDENT
                    </p>
                </div>

                {/* How it works */}
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg space-y-3">
                    <h4 className="text-xs font-bold text-brand-navy uppercase mb-2 flex items-center gap-1.5">
                        <BookOpen size={13} /> How it works
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-medium text-gray-600">
                        <div className="flex items-start gap-2 p-2 bg-white rounded-lg border border-gray-100">
                            <span className="w-5 h-5 rounded-full bg-brand-navy text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                            <span>Click on the option you think is correct</span>
                        </div>
                        <div className="flex items-start gap-2 p-2 bg-white rounded-lg border border-gray-100">
                            <span className="w-5 h-5 rounded-full bg-brand-navy text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                            <span>Click Next to proceed or wait for 60s auto-advance</span>
                        </div>
                        <div className="flex items-start gap-2 p-2 bg-white rounded-lg border border-gray-100">
                            <span className="w-5 h-5 rounded-full bg-brand-navy text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                            <span>Submit when all 20 questions are completed</span>
                        </div>
                    </div>
                </div>

                {/* Feedback explanation */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wide flex items-center gap-1.5">
                        <Info size={13} /> After selecting an answer:
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-2 text-xs">
                        <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-lg flex-1">
                            <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                            <span className="text-green-800 font-medium">Correct — shown with a green highlight and explanation</span>
                        </div>
                        <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg flex-1">
                            <XCircle size={15} className="text-red-500 shrink-0" />
                            <span className="text-red-800 font-medium">Wrong — shown with red; correct answer revealed with explanation</span>
                        </div>
                    </div>
                </div>

                {/* Important Note */}
                <div className="space-y-1 pt-1">
                    <p className="text-brand-navy font-bold text-xs md:text-sm uppercase tracking-wide">IMPORTANT</p>
                    <p className="text-gray-600 text-xs md:text-sm">
                        You have <strong>60 seconds</strong> for each question. Once an option is chosen, the <strong>Next</strong> button is activated to let you continue immediately. If no option is selected, the test will automatically advance when the 60s timer expires.
                    </p>
                </div>

                {/* Compact Button Area */}
                <div className="pt-2 flex justify-center">
                    <button
                        onClick={onStart}
                        className="bg-brand-navy hover:bg-brand-navyLight text-white px-10 py-3.5 rounded-lg font-bold uppercase tracking-widest text-xs md:text-sm shadow-lg shadow-brand-navy/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                        Begin MCQ Test
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstructionScreen;