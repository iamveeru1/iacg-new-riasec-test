import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { db } from '../../utils/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

interface StudentInputScreenProps {
  onSubmit: (user: User) => void;
  isLoading?: boolean;
  serverErrors?: { [key: string]: string };
}

const CURRENT_TEST_ID = 'architecture_construction_built_environment';
const CURRENT_TEST_NAME = 'Architecture, Construction & Built Environment';

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
      {/* Left Side (Desktop) / Test Overview (Mobile) - 60% Width */}
      <div className={`
          ${showMobileForm ? 'hidden md:flex' : 'flex'} 
          w-full md:w-[60%] relative overflow-hidden bg-brand-navy min-h-screen md:min-h-auto transition-all duration-500 items-center justify-center
      `}>
        {/* Dynamic Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop')" }}
        />

        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full w-full p-8 md:p-12 lg:p-16 my-auto">
          {/* Logo in White Badge */}
          <div className="mb-7">
            <div className="bg-white px-6 py-3 rounded-2xl shadow-xl inline-flex items-center justify-center border border-white/20">
              <img
                src="/logo.png"
                alt="IACG Multimedia College"
                className="h-12 md:h-14 w-auto object-contain"
              />
            </div>
          </div>

          {/* Heading - Increased Font Size */}
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight text-white mb-5 leading-tight">
            Multi-Disciplinary <span className="text-[#FBBF24]">MCQ Assessment</span>
          </h2>

          {/* Subtitle / Description - Student Focused */}
          <p className="text-sm md:text-base lg:text-[17px] text-gray-200 max-w-2xl mx-auto leading-relaxed text-center opacity-95">
            Online student examination and skill evaluation portal. Test your knowledge,<br className="hidden lg:inline" />
            {" "}conceptual clarity, and multidisciplinary reasoning across comprehensive<br className="hidden lg:inline" />
            {" "}academic and professional subject modules.
          </p>

          {/* Mobile Start Test Button */}
          <button
            onClick={() => setShowMobileForm(true)}
            className="md:hidden bg-brand-gold text-brand-navy px-8 py-3 rounded-full font-bold uppercase tracking-widest shadow-lg hover:bg-white transition-all transform active:scale-95 flex items-center gap-2 mt-8 mx-auto text-sm"
          >
            Start Test
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Right Side - Candidate Form (Email Dropdown) - 40% Width */}
      <div className={`
          ${showMobileForm ? 'flex' : 'hidden md:flex'}
          w-full md:w-[40%] items-center justify-center p-6 md:p-10 lg:p-12 bg-gray-50 h-screen overflow-y-auto animate-fade-in
      `}>
        <div className="w-[90%] md:w-[85%] max-w-md my-auto mx-auto pb-8">
          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl font-bold text-brand-navy tracking-tight">
              Candidate Details
            </h2>
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