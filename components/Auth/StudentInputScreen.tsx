import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { UserCircle, Mail, ArrowRight, Loader2, Compass, CheckCircle2, Sparkles, Palette, Activity, Briefcase } from 'lucide-react';

interface StudentInputScreenProps {
  onSubmit: (user: User) => void;
  isLoading?: boolean;
  serverErrors?: { [key: string]: string };
}

const DOMAIN_PILLARS = [
  {
    icon: Sparkles,
    title: "Computer Science, AI & Engineering",
    desc: "AI, AR/VR, Space Tech, Computing, IT & Core Engineering"
  },
  {
    icon: Palette,
    title: "Digital Media, Animation & Design",
    desc: "Animation, Visual Communication, Gaming & Creator Media"
  },
  {
    icon: Activity,
    title: "Healthcare, Sciences & Environment",
    desc: "Medical Sciences, Pharma, Health & Applied Sciences"
  },
  {
    icon: Briefcase,
    title: "Business, Law & Social Studies",
    desc: "Commerce, Social Sciences, Management & Public Administration"
  }
];

const StudentInputScreen: React.FC<StudentInputScreenProps> = ({ onSubmit, isLoading = false, serverErrors = {} }) => {
  // Candidate Details (Name & Email)
  const [name, setName] = useState('Demo Student');
  const [email, setEmail] = useState('student@example.com');

  // Hidden/URL Params
  const [schoolName, setSchoolName] = useState('');
  const [uniqueCode, setUniqueCode] = useState('');
  const [counsellorEmail, setCounsellorEmail] = useState('');
  const [board, setBoard] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showMobileForm, setShowMobileForm] = useState(false);

  useEffect(() => {
    // Parse query params
    const searchParams = new URLSearchParams(window.location.search);
    const sName = searchParams.get('schoolName');
    const uCode = searchParams.get('uniqueCode');
    const cEmail = searchParams.get('email');
    const sBoard = searchParams.get('board');

    if (sName) setSchoolName(sName);
    if (uCode) setUniqueCode(uCode);
    if (cEmail) setCounsellorEmail(cEmail);
    if (sBoard) setBoard(sBoard);

    console.log("Params captured:", { sName, uCode, cEmail, sBoard });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    // Build user object with candidate details
    const user: User = {
      name: name.trim() || 'Demo Student',
      email: email.trim() || 'student@example.com',
      studentClass: 'Grade 10',
      school: schoolName || 'IACG International',
      schoolCode: uniqueCode || 'N/A',
      counsellorEmail: counsellorEmail,
      board: board || 'CBSE',
      parentName: 'Parent',
      mobileNumber: '9876543210',
      location: 'Hyderabad',
    };
    console.log("Submitting candidate for MCQ test:", user);
    onSubmit(user);
  };

  const getError = (field: string) => errors[field] || serverErrors[field];

  return (
    <div className="min-h-screen flex w-full bg-white relative">
      {/* Left Side (Desktop) / Test Overview (Mobile) */}
      <div className={`
          ${showMobileForm ? 'hidden md:flex' : 'flex'} 
          w-full md:w-1/2 relative overflow-hidden bg-brand-navy min-h-screen md:min-h-auto transition-all duration-500
      `}>
        {/* Dynamic Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop')" }}
        />

        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full w-full p-6 md:p-10 lg:p-12 text-white justify-between">
          {/* Top Section: Logo + MCQ Overview Content */}
          <div className="flex-1 flex flex-col items-center md:items-start pt-2 md:pt-0">
            {/* Logo */}
            <div className="mb-4 md:mb-6">
              <img
                src="/logo.png"
                alt="IACG Multimedia College"
                className="h-14 w-auto object-contain bg-white p-2 rounded-md shadow-md"
              />
            </div>

            {/* MCQ Assessment Heading & Description */}
            <div className="w-full text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-semibold uppercase tracking-wider mb-3">
                <Compass size={14} />
                Online MCQ Examination
              </div>

              <h2 className="text-2xl lg:text-4xl font-bold mb-3 leading-tight text-white tracking-tight">
                Multi-Disciplinary MCQ Assessment
              </h2>
              <p className="text-xs lg:text-sm text-gray-200 mb-6 max-w-xl leading-relaxed">
                Test your knowledge, conceptual clarity, and objective reasoning across 22 comprehensive multidisciplinary subject modules:
              </p>

              {/* 4 Representative Subject Clusters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-6">
                {DOMAIN_PILLARS.map((pillar, idx) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] backdrop-blur-md border border-white/10 transition-all duration-300 group shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 mb-1">
                        <div className="w-7 h-7 rounded-lg bg-brand-gold/20 text-brand-gold flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Icon size={16} />
                        </div>
                        <h4 className="font-bold text-xs text-white leading-tight">{pillar.title}</h4>
                      </div>
                      <p className="text-[11px] text-gray-300 pl-9 leading-relaxed">{pillar.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Key Features Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-2 justify-center md:justify-start">
                <div className="flex items-center gap-1.5 text-xs text-gray-300 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                  <CheckCircle2 size={13} className="text-brand-gold" />
                  <span>22 MCQ Question Modules</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-300 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5">
                  <CheckCircle2 size={13} className="text-brand-gold" />
                  <span>Objective Multiple Choice Format</span>
                </div>
              </div>

              <button
                onClick={() => setShowMobileForm(true)}
                className="md:hidden bg-brand-gold text-brand-navy px-8 py-3 rounded-full font-bold uppercase tracking-widest shadow-lg hover:bg-white transition-all transform active:scale-95 flex items-center gap-2 mt-6 mx-auto"
              >
                Start Test
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* School / Institution Banner if present */}
          {schoolName && (
            <div className="flex-none pt-4 opacity-90 justify-center md:justify-start">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 inline-flex flex-col">
                <p className="text-[10px] uppercase tracking-wider text-gray-300">Test Portal</p>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-white">{schoolName}</p>
                  {board && <span className="text-[11px] font-medium text-brand-gold bg-brand-gold/20 px-2 py-0.5 rounded">({board})</span>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Candidate Form (Name & Email) */}
      <div className={`
          ${showMobileForm ? 'flex' : 'hidden md:flex'}
          w-full md:w-1/2 items-center justify-center p-6 md:p-12 lg:p-16 bg-gray-50 h-screen overflow-y-auto animate-fade-in
      `}>
        <div className="w-[90%] md:w-[85%] max-w-md my-auto mx-auto pb-8">
          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl font-bold text-brand-navy tracking-tight mb-2">
              Candidate Details
            </h2>
            <p className="text-sm text-gray-600">
              Please enter your name and email to begin the MCQ examination.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Student Name */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide">
                <UserCircle size={15} className="text-brand-navy" />
                Student Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 outline-none text-sm focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-all"
                placeholder="Enter Student Full Name"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide">
                <Mail size={15} className="text-brand-navy" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 outline-none text-sm focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-all"
                placeholder="student@example.com"
              />
            </div>

            {/* Start Test Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-brand-navy text-white py-4 rounded-lg font-bold hover:bg-brand-navyLight transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-navy/30 hover:shadow-xl transform hover:-translate-y-0.5 text-base uppercase tracking-wider ${isLoading ? 'cursor-not-allowed opacity-80' : ''}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Preparing MCQ Test...
                  </>
                ) : (
                  <>
                    Start Test
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentInputScreen;