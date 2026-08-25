import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { Mail, ArrowRight, Loader2, Compass, CheckCircle2, Sparkles, Palette, Activity, Briefcase, AlertCircle } from 'lucide-react';
import { db } from '../../utils/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

interface StudentInputScreenProps {
  onSubmit: (user: User) => void;
  isLoading?: boolean;
  serverErrors?: { [key: string]: string };
}

const CURRENT_TEST_ID = 'architecture_construction_built_environment';
const CURRENT_TEST_NAME = 'Architecture, Construction & Built Environment';

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

const EMAIL_OPTIONS = Array.from({ length: 10 }, (_, i) => `veeru${i + 1}@gmail.com`);

const StudentInputScreen: React.FC<StudentInputScreenProps> = ({ onSubmit, isLoading = false, serverErrors = {} }) => {
  // Candidate Email
  const [email, setEmail] = useState('');
  const [attemptedEmails, setAttemptedEmails] = useState<string[]>([]);
  const [checkError, setCheckError] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);

  // Hidden/URL Params
  const [schoolName, setSchoolName] = useState('');
  const [uniqueCode, setUniqueCode] = useState('');
  const [counsellorEmail, setCounsellorEmail] = useState('');
  const [board, setBoard] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showMobileForm, setShowMobileForm] = useState(false);

  // Fetch already attempted emails for THIS specific test from Firestore on mount
  useEffect(() => {
    const fetchAttemptedEmails = async () => {
      try {
        const snapshot = await getDocs(collection(db, "students"));
        const emails: string[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          const docEmail = (data.email || docSnap.id || '').trim().toLowerCase();
          // Check if this specific test has been attempted (or legacy single-result structure)
          const hasAttemptedThisTest = Boolean(data.tests?.[CURRENT_TEST_ID] || (data.results && !data.tests));
          if (docEmail && hasAttemptedThisTest) {
            emails.push(docEmail);
          }
        });
        setAttemptedEmails(emails);
      } catch (err) {
        console.warn("Could not fetch attempted emails from database:", err);
      }
    };

    fetchAttemptedEmails();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isChecking) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    setIsChecking(true);
    setCheckError('');

    // Check Firestore database to see if this student has already attempted this specific test
    try {
      const studentDocRef = doc(db, "students", trimmedEmail.toLowerCase());
      const docSnap = await getDoc(studentDocRef);

      let isAlreadyTaken = false;
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.tests?.[CURRENT_TEST_ID] || data.results) {
          isAlreadyTaken = true;
        }
      }

      // Also check fallback for any documents stored with auto-ID
      if (!isAlreadyTaken) {
        const q = query(collection(db, "students"), where("email", "==", trimmedEmail));
        const snapshot = await getDocs(q);
        snapshot.forEach(d => {
          const data = d.data();
          if (data.tests?.[CURRENT_TEST_ID] || data.results) {
            isAlreadyTaken = true;
          }
        });
      }

      if (isAlreadyTaken) {
        setCheckError(`The email "${trimmedEmail}" has already completed the ${CURRENT_TEST_NAME} assessment.`);
        if (!attemptedEmails.includes(trimmedEmail.toLowerCase())) {
          setAttemptedEmails(prev => [...prev, trimmedEmail.toLowerCase()]);
        }
        setIsChecking(false);
        return;
      }
    } catch (error) {
      console.warn("Error verifying email in database:", error);
    }

    setIsChecking(false);

    const user: User = {
      name: trimmedEmail,
      email: trimmedEmail,
      school: schoolName || 'IACG',
    };
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

      {/* Right Side - Candidate Form (Email Dropdown) */}
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
              Please select your email from the list to begin the MCQ examination.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email Address Dropdown */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide">
                <Mail size={15} className="text-brand-navy" />
                Select Email Address
              </label>
              <div className="relative">
                <select
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setCheckError('');
                  }}
                  disabled={isLoading || isChecking}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 outline-none text-sm focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-all appearance-none cursor-pointer pr-10 font-medium"
                >
                  <option value="" disabled>-- Select Candidate Email --</option>
                  {EMAIL_OPTIONS.map((em) => {
                    const isAttempted = attemptedEmails.includes(em.toLowerCase());
                    return (
                      <option 
                        key={em} 
                        value={em} 
                        disabled={isAttempted}
                        className={isAttempted ? "text-gray-400 bg-gray-100" : "text-gray-900"}
                      >
                        {em} {isAttempted ? '— (Already Attempted)' : ''}
                      </option>
                    );
                  })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Error Message when Email is already attempted */}
            {checkError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2.5 animate-fade-in shadow-sm">
                <AlertCircle size={17} className="text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">
                  <p className="font-semibold">{checkError}</p>
                </div>
              </div>
            )}

            {/* Start Test Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || isChecking || (!!email && attemptedEmails.includes(email.toLowerCase()))}
                className={`w-full bg-brand-navy text-white py-4 rounded-lg font-bold hover:bg-brand-navyLight transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-navy/30 hover:shadow-xl transform hover:-translate-y-0.5 text-base uppercase tracking-wider ${(isLoading || isChecking || (!!email && attemptedEmails.includes(email.toLowerCase()))) ? 'cursor-not-allowed opacity-75' : ''}`}
              >
                {isChecking ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Checking Database...
                  </>
                ) : isLoading ? (
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