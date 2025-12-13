import React from 'react';
import { ArrowRight } from 'lucide-react';

interface InstructionScreenProps {
    onStart: () => void;
    milestoneTitle?: string;
}

const InstructionScreen: React.FC<InstructionScreenProps> = ({ onStart }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mt-1 animate-fade-in max-w-4xl mx-auto">
            {/* Compact Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                <div className="w-6 h-6 rounded-full border-2 border-brand-gold flex items-center justify-center text-brand-gold font-serif font-bold italic text-sm">
                    i
                </div>
                <h2 className="text-xl font-bold text-brand-navy tracking-tight">
                    Instructions!
                </h2>
            </div>

            <div className="p-6 space-y-5">

                <p className="text-gray-600 text-sm">
                    This assessment helps you explore your career interests. Read the instructions carefully.
                </p>



                {/* Compact Navy Banner */}
                <div className="bg-brand-navy p-4 rounded-lg shadow-md shadow-brand-navy/10 text-center">
                    <p className="font-bold text-white text-sm md:text-base leading-relaxed tracking-wide">
                        SIMPLY THINK ABOUT WHETHER YOU WOULD <span className="text-brand-gold">“LIKE”</span> OR <span className="text-brand-gold">“DISLIKE”</span> PERFORMING THE WORK ACTIVITY.
                    </p>
                </div>

                {/* Scale Explanation */}
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg">
                    <h4 className="text-xs font-bold text-brand-navy uppercase mb-2">How to Mark Your Answers (Scale of 0 to 4):</h4>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 md:flex-nowrap md:justify-between text-xs font-medium text-gray-600">
                        <div className="text-center w-24 md:w-auto"><span className="block text-lg font-bold text-brand-navy">0</span>Strongly Dislike</div>
                        <div className="text-center w-24 md:w-auto"><span className="block text-lg font-bold text-brand-navy">1</span>Dislike</div>
                        <div className="text-center w-24 md:w-auto"><span className="block text-lg font-bold text-brand-navy">2</span>Neutral</div>
                        <div className="text-center w-24 md:w-auto"><span className="block text-lg font-bold text-brand-navy">3</span>Like</div>
                        <div className="text-center w-24 md:w-auto"><span className="block text-lg font-bold text-brand-navy">4</span>Strongly Like</div>
                    </div>
                </div>

                {/* Section 2: Compact General Rules */}
                <div className="space-y-3 pt-1">
                    <div>
                        <p className="text-brand-navy font-bold text-xs md:text-sm uppercase tracking-wide mb-0.5">THIS IS NOT A TEST!</p>
                        <p className="text-gray-600 text-xs md:text-sm">There are no right or wrong answers. The goal is for you to learn more about your personal work-related interests.</p>
                    </div>
                </div>

                {/* Compact Button Area */}
                <div className="pt-2 flex justify-center">
                    <button
                        onClick={onStart}
                        className="bg-brand-navy hover:bg-brand-navyLight text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest text-xs md:text-sm shadow-lg shadow-brand-navy/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                        Start Test
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstructionScreen;