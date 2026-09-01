import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { Mail, ArrowRight, Loader2, AlertCircle, Hash, BookOpen } from 'lucide-react';
import { db } from '../../utils/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

import { ASSESSMENT_MODULES } from '../../data/mcq_questions';

interface StudentInputScreenProps {
  onSubmit: (user: User, testId: string, testName?: string) => void;
  isLoading?: boolean;
  serverErrors?: { [key: string]: string };
}

interface TestModuleItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
  order?: number;
  isEnabled: boolean;
}

interface StudentRecord {
  docId: string;
  email: string;
  name?: string;
  rollNumber?: string;
  rollNo?: string;
  status?: string;
  tests?: { [key: string]: any };
  results?: any;
}

const StudentInputScreen: React.FC<StudentInputScreenProps> = ({ onSubmit, isLoading = false, serverErrors = {} }) => {
  // Enabled Assessment Modules strictly from Firestore (configured by Admin)
  const [availableModules, setAvailableModules] = useState<TestModuleItem[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState<boolean>(true);
  const [selectedTestId, setSelectedTestId] = useState<string>('');

  // Dynamic student list from Firestore
  const [studentsList, setStudentsList] = useState<StudentRecord[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState<boolean>(true);

  // Candidate Form Inputs
  const [selectedEmail, setSelectedEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [checkError, setCheckError] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);

  // Hidden/URL Params
  const [schoolName, setSchoolName] = useState('');
  const [uniqueCode, setUniqueCode] = useState('');
  const [counsellorEmail, setCounsellorEmail] = useState('');
  const [board, setBoard] = useState('');

  const [showMobileForm, setShowMobileForm] = useState(false);

  // 1. Fetch strictly enabled assessment test modules from Firestore "assessment_tests" on mount
  useEffect(() => {
    const fetchAssessmentModules = async () => {
      setIsLoadingModules(true);
      try {
        const snapshot = await getDocs(collection(db, "assessment_tests"));
        const modules: TestModuleItem[] = [];

        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          const docId = docSnap.id;
          // STRICT CHECK: Only include if isEnabled === true in Firebase AND question bank is defined
          if (data.isEnabled === true && ASSESSMENT_MODULES[docId]) {
            const name = (data.name || ASSESSMENT_MODULES[docId].title).trim();
            modules.push({
              id: docId,
              name: name,
              description: data.description || '',
              category: data.category || '',
              order: typeof data.order === 'number' ? data.order : 999,
              isEnabled: true
            });
          }
        });

        // Sort by order ascending
        modules.sort((a, b) => (a.order || 999) - (b.order || 999));

        setAvailableModules(modules);

        // Check if URL specifies a test
        const searchParams = new URLSearchParams(window.location.search);
        const urlTest = searchParams.get('testId') || searchParams.get('test') || searchParams.get('assessment');
        
        if (urlTest && modules.some(m => m.id === urlTest)) {
          setSelectedTestId(urlTest);
        } else if (modules.length > 0) {
          // Default to first enabled module from Firebase
          setSelectedTestId(modules[0].id);
        } else {
          setSelectedTestId('');
        }
      } catch (err) {
        console.warn("Could not fetch assessment modules from database:", err);
        setAvailableModules([]);
        setSelectedTestId('');
      } finally {
        setIsLoadingModules(false);
      }
    };

    fetchAssessmentModules();
  }, []);

  // 2. Fetch all registered students from Firestore "students" collection on mount
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoadingStudents(true);
      try {
        const snapshot = await getDocs(collection(db, "students"));
        const list: StudentRecord[] = [];
        snapshot.forEach(docSnap => {
          const data = docSnap.data();
          const docEmail = (data.email || docSnap.id || '').trim();
          if (docEmail) {
            list.push({
              docId: docSnap.id,
              email: docEmail,
              name: data.name || '',
              rollNumber: data.rollNumber || data.rollNo || '',
              rollNo: data.rollNo || data.rollNumber || '',
              status: data.status,
              tests: data.tests || {},
              results: data.results
            });
          }
        });

        // Sort alphabetically by email
        list.sort((a, b) => a.email.localeCompare(b.email));
        setStudentsList(list);
      } catch (err) {
        console.warn("Could not fetch students from database:", err);
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
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

  const activeModule = availableModules.find(m => m.id === selectedTestId) 
    || availableModules[0] 
    || { id: selectedTestId, name: 'Multi-Disciplinary Assessment' };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isChecking) return;

    const trimmedEmail = selectedEmail.trim();
    const trimmedRoll = rollNumber.trim();

    if (!selectedTestId) {
      setCheckError('Please select an assessment test module.');
      return;
    }

    if (!trimmedEmail) {
      setCheckError('Please select a student email address.');
      return;
    }

    if (!trimmedRoll) {
      setCheckError('Please enter your roll number.');
      return;
    }

    setIsChecking(true);
    setCheckError('');

    // Find student in our loaded list
    const student = studentsList.find(s => s.email.toLowerCase() === trimmedEmail.toLowerCase());

    if (!student) {
      setCheckError('Selected email was not found in the student database.');
      setIsChecking(false);
      return;
    }

    // Verify Roll Number
    const storedRoll = (student.rollNumber || student.rollNo || '').trim().toLowerCase();
    const enteredRoll = trimmedRoll.toLowerCase();

    const isRollMatching = storedRoll && (
      enteredRoll === storedRoll ||
      (!isNaN(Number(enteredRoll)) && !isNaN(Number(storedRoll)) && Number(enteredRoll) === Number(storedRoll))
    );

    if (!isRollMatching) {
      setCheckError('Roll number does not match for the selected email. Please check your credentials and try again.');
      setIsChecking(false);
      return;
    }

    // Check if student has already completed this selected assessment
    try {
      const studentDocRef = doc(db, "students", student.docId);
      const docSnap = await getDoc(studentDocRef);

      let isAlreadyTaken = false;
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.tests?.[selectedTestId] || (data.results && !data.tests && selectedTestId === 'architecture_construction_built_environment')) {
          isAlreadyTaken = true;
        }
      } else if (student.tests?.[selectedTestId] || (student.results && !student.tests && selectedTestId === 'architecture_construction_built_environment')) {
        isAlreadyTaken = true;
      }

      if (isAlreadyTaken) {
        setCheckError(`The email "${trimmedEmail}" has already completed the ${activeModule.name} assessment.`);
        setIsChecking(false);
        return;
      }
    } catch (error) {
      console.warn("Error verifying student status in database:", error);
    }

    setIsChecking(false);

    const user: User = {
      docId: student.docId,
      name: student.name || trimmedEmail.split('@')[0],
      email: student.email,
      rollNumber: student.rollNumber || student.rollNo || trimmedRoll,
      rollNo: student.rollNo || student.rollNumber || trimmedRoll,
      school: schoolName || 'IACG',
    };
    onSubmit(user, selectedTestId, activeModule.name);
  };

  const selectedStudentObj = studentsList.find(s => s.email.toLowerCase() === selectedEmail.toLowerCase());
  const isSelectedAttempted = selectedStudentObj 
    ? Boolean(selectedStudentObj.tests?.[selectedTestId] || (selectedStudentObj.results && !selectedStudentObj.tests && selectedTestId === 'architecture_construction_built_environment'))
    : false;

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

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight text-white mb-5 leading-tight">
            Multi-Disciplinary <span className="text-[#FBBF24]">MCQ Assessment</span>
          </h2>

          {/* Subtitle / Description */}
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

      {/* Right Side - Candidate Form (Email & Roll Number) - 40% Width */}
      <div className={`
          ${showMobileForm ? 'flex' : 'hidden md:flex'}
          w-full md:w-[40%] items-center justify-center p-6 md:p-10 lg:p-12 bg-gray-50 h-screen overflow-y-auto animate-fade-in
      `}>
        <div className="w-[90%] md:w-[85%] max-w-md my-auto mx-auto pb-8">
          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl font-bold text-brand-navy tracking-tight">
              Candidate Details
            </h2>
            <p className="text-sm text-gray-500 mt-1.5">
              Select your registered email and enter your roll number to access the assessment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Assessment Test Module Dropdown (Configured from Admin) */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide">
                <BookOpen size={15} className="text-brand-navy" />
                Select Assessment Module
              </label>
              <div className="relative">
                <select
                  required
                  value={selectedTestId}
                  onChange={(e) => {
                    setSelectedTestId(e.target.value);
                    setCheckError('');
                  }}
                  disabled={isLoading || isChecking || isLoadingModules || availableModules.length === 0}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 outline-none text-sm focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-all appearance-none cursor-pointer pr-10 font-medium disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoadingModules ? (
                    <option value="" disabled>-- Loading Assessment Modules from Admin... --</option>
                  ) : availableModules.length === 0 ? (
                    <option value="" disabled>-- No Modules Available (Disabled by Admin) --</option>
                  ) : (
                    availableModules.map((mod) => {
                      const hasBank = Boolean(ASSESSMENT_MODULES[mod.id]);
                      return (
                        <option 
                          key={mod.id} 
                          value={mod.id}
                          disabled={!hasBank}
                          className={!hasBank ? "text-gray-400 bg-gray-100" : "text-gray-900"}
                        >
                          {mod.name} {mod.category ? `• ${mod.category}` : ''} {!hasBank ? '— (Content Coming Soon)' : ''}
                        </option>
                      );
                    })
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  {isLoadingModules ? (
                    <Loader2 size={16} className="animate-spin text-brand-navy" />
                  ) : (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Email Address Dropdown (from Firebase) */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide">
                <Mail size={15} className="text-brand-navy" />
                Select Email Address
              </label>
              <div className="relative">
                <select
                  required
                  value={selectedEmail}
                  onChange={(e) => {
                    setSelectedEmail(e.target.value);
                    setCheckError('');
                  }}
                  disabled={isLoading || isChecking || isLoadingStudents || isLoadingModules || availableModules.length === 0}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 outline-none text-sm focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-all appearance-none cursor-pointer pr-10 font-medium disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>
                    {isLoadingStudents ? '-- Loading Registered Candidates... --' : '-- Select Candidate Email --'}
                  </option>
                  {studentsList.map((student) => {
                    const isAttempted = Boolean(student.tests?.[selectedTestId] || (student.results && !student.tests && selectedTestId === 'architecture_construction_built_environment'));
                    return (
                      <option 
                        key={student.docId || student.email} 
                        value={student.email} 
                        disabled={isAttempted}
                        className={isAttempted ? "text-gray-400 bg-gray-100" : "text-gray-900"}
                      >
                        {student.email} {student.name ? `(${student.name})` : ''} {isAttempted ? '— (Already Attempted)' : ''}
                      </option>
                    );
                  })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  {isLoadingStudents ? (
                    <Loader2 size={16} className="animate-spin text-brand-navy" />
                  ) : (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Roll Number Input */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide">
                <Hash size={15} className="text-brand-navy" />
                Roll Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={(e) => {
                    setRollNumber(e.target.value);
                    setCheckError('');
                  }}
                  disabled={isLoading || isChecking || isLoadingModules || availableModules.length === 0}
                  placeholder="Enter your Roll Number (e.g. 001, 002)"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 outline-none text-sm focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-all font-medium placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Error Message */}
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
                disabled={isLoading || isChecking || isLoadingStudents || isLoadingModules || availableModules.length === 0 || isSelectedAttempted || !selectedEmail || !rollNumber.trim()}
                className={`w-full bg-brand-navy text-white py-4 rounded-lg font-bold hover:bg-brand-navyLight transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-navy/30 hover:shadow-xl transform hover:-translate-y-0.5 text-base uppercase tracking-wider ${(isLoading || isChecking || isLoadingStudents || isLoadingModules || availableModules.length === 0 || isSelectedAttempted || !selectedEmail || !rollNumber.trim()) ? 'cursor-not-allowed opacity-75' : ''}`}
              >
                {isChecking ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Verifying Credentials...
                  </>
                ) : isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Preparing Assessment...
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