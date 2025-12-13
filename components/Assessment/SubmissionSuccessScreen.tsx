
import React from 'react';
import { CheckCircle, Home } from 'lucide-react';

interface SubmissionSuccessScreenProps {
  onGoHome: () => void;
}

const SubmissionSuccessScreen: React.FC<SubmissionSuccessScreenProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center transform transition-all animate-fade-in border border-gray-100">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center shadow-inner relative">
            <div className="absolute inset-0 rounded-full border-4 border-green-100 animate-pulse"></div>
            <CheckCircle className="w-12 h-12 text-green-600 relative z-10" strokeWidth={3} />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-brand-navy mb-4 tracking-tight">Test Submitted!</h2>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          Your assessment has been successfully submitted. Thank you for your time and participation.
        </p>

        <button
          onClick={onGoHome}
          className="w-full bg-brand-navy text-white py-4 rounded-xl font-bold hover:bg-brand-navyLight transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-navy/20 hover:-translate-y-1 uppercase tracking-wide text-sm"
        >
          <Home size={18} />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SubmissionSuccessScreen;
