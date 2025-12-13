import React from 'react';
import { Milestone, User } from '../../types';
import { 
  School, Map, Compass, GraduationCap, BookOpen, 
  Factory, Briefcase, User as UserIcon, Building, 
  Landmark, Lightbulb, HelpCircle, LogOut, ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface MilestoneSelectorProps {
  user: User;
  milestones: Milestone[];
  onSelect: (milestone: Milestone) => void;
  onLogout: () => void;
}

const IconMap: Record<string, React.FC<{ className?: string; size?: number | string; strokeWidth?: number }>> = {
  School, Map, Compass, GraduationCap, BookOpen,
  Factory, Briefcase, User: UserIcon, Building,
  Landmark, Lightbulb
};

const MilestoneSelector: React.FC<MilestoneSelectorProps> = ({ user, milestones, onSelect, onLogout }) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const handleNext = () => {
    if (selectedId) {
        const m = milestones.find(m => m.id === selectedId);
        if (m) onSelect(m);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4 md:p-8 animate-fade-in">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col">
        
        {/* Header Section */}
        <div className="bg-white p-8 md:p-10 pb-2 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-brand-navy tracking-tight mb-2">Select Assessment Level</h2>
                    <p className="text-gray-500 text-sm">Choose the category that best describes your current education level.</p>
                </div>
                <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                    <div className="w-8 h-8 bg-brand-navy rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Student</p>
                        <p className="text-sm font-bold text-brand-navy leading-none">{user.name}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-10 flex-1 bg-gray-50/30">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-brand-gold rounded-full"></div>
                <h3 className="font-bold text-brand-navy uppercase tracking-widest text-sm">I need Guidance for</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {milestones.map((m) => {
                    const IconComponent = IconMap[m.iconName] || HelpCircle;
                    const isSelected = selectedId === m.id;
                    return (
                        <button
                            key={m.id}
                            onClick={() => setSelectedId(m.id)}
                            className={`
                                relative flex items-center p-5 rounded-xl transition-all duration-300 text-left border-2 group outline-none
                                ${isSelected 
                                    ? 'bg-brand-navy border-brand-navy shadow-lg shadow-brand-navy/20 transform -translate-y-1' 
                                    : 'bg-white border-transparent hover:border-brand-gold/50 hover:shadow-md shadow-sm'}
                            `}
                        >
                            {/* Checkmark Badge for Selected State */}
                            {isSelected && (
                                <div className="absolute top-3 right-3 text-brand-gold">
                                    <CheckCircle2 size={20} fill="currentColor" className="text-white" />
                                </div>
                            )}

                            <div className={`
                                w-14 h-14 rounded-xl flex items-center justify-center mr-5 shrink-0 transition-colors duration-300
                                ${isSelected 
                                    ? 'bg-white/10 text-brand-gold' 
                                    : 'bg-blue-50 text-brand-navy group-hover:bg-brand-navy group-hover:text-white'}
                            `}>
                                <IconComponent size={28} strokeWidth={1.5} />
                            </div>
                            
                            <div>
                                <span className={`
                                    block text-lg font-bold leading-tight transition-colors mb-1
                                    ${isSelected ? 'text-white' : 'text-gray-800'}
                                `}>
                                    {m.title}
                                </span>
                                <span className={`
                                    text-xs font-medium transition-colors
                                    ${isSelected ? 'text-blue-200' : 'text-gray-400'}
                                `}>
                                    Click to select
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Footer Section */}
        <div className="bg-white p-6 border-t border-gray-100 flex justify-end items-center">
            <button 
                onClick={handleNext}
                disabled={!selectedId}
                className={`
                    flex items-center gap-2 px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-wider shadow-lg transition-all transform
                    ${selectedId 
                        ? 'bg-brand-navy hover:bg-brand-navyLight text-white hover:-translate-y-0.5 shadow-brand-navy/30' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                `}
            >
                Start Assessment
                <ArrowRight size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default MilestoneSelector;
