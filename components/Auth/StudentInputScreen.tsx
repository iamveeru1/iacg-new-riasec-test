import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { UserCircle, School, ArrowRight, Loader2 } from 'lucide-react';
import { db } from '../../utils/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface StudentInputScreenProps {
  onSubmit: (user: User) => void;
  isLoading?: boolean;
  serverErrors?: { [key: string]: string };
}

interface SchoolOption {
  name: string;
  code: string;
  displayName: string;
}

const StudentInputScreen: React.FC<StudentInputScreenProps> = ({ onSubmit, isLoading = false, serverErrors = {} }) => {
  const [name, setName] = useState('');
  const [selectedSchoolCode, setSelectedSchoolCode] = useState('');
  const [schools, setSchools] = useState<SchoolOption[]>([]);
  const [isSchoolsLoading, setIsSchoolsLoading] = useState(true);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // State to toggle between Landing Image view and Form view on mobile
  const [showMobileForm, setShowMobileForm] = useState(false);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const q = query(collection(db, "schoolAssessments"), where("status", "==", "Open"));
        const querySnapshot = await getDocs(q);
        const schoolsList: SchoolOption[] = querySnapshot.docs
          .map(doc => {
            const data = doc.data();
            // Ensure we have both fields
            if (data.schoolName && data.uniqueCode) {
              return {
                name: data.schoolName,
                code: data.uniqueCode,
                displayName: `${data.schoolName} (${data.uniqueCode})`
              };
            }
            return null;
          })
          .filter((s): s is SchoolOption => s !== null)
          .sort((a, b) => a.displayName.localeCompare(b.displayName));

        setSchools(schoolsList);
      } catch (error) {
        console.error("Error fetching schools:", error);
      } finally {
        setIsSchoolsLoading(false);
      }
    };
    fetchSchools();
  }, []);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    // Student Name
    const nameRegex = /^[a-zA-Z\s]*$/;
    if (!name.trim()) {
      newErrors.name = "Student Name is required";
      isValid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = "Min 2 characters";
      isValid = false;
    } else if (!nameRegex.test(name)) {
      newErrors.name = "Letters only";
      isValid = false;
    }

    // School Name
    if (!selectedSchoolCode.trim()) {
      newErrors.school = "Select a school";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (validate()) {
      const selectedSchool = schools.find(s => s.code === selectedSchoolCode);
      if (selectedSchool) {
        const user: User = {
          name: name.trim(),
          school: selectedSchool.name,
          schoolCode: selectedSchool.code
        };
        onSubmit(user);
      }
    }
  };

  // Helper to combine local validation errors with server errors
  const getError = (field: string) => errors[field] || serverErrors[field];

  return (
    <div className="min-h-screen flex w-full bg-white relative">
      {/* Left Side (Desktop) / Welcome Screen (Mobile) */}
      <div className={`
          ${showMobileForm ? 'hidden md:flex' : 'flex'} 
          w-full md:w-1/2 relative overflow-hidden bg-brand-navy min-h-screen md:min-h-auto transition-all duration-500
      `}>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')" }}
        />
        <div className="relative z-10 flex flex-col h-full w-full p-8 md:p-12 lg:p-16 text-white justify-between">
          {/* Logo Section */}
          <div className="flex-none flex flex-col items-center md:items-start pt-4 md:pt-0">
            <img
              src="/logo.png"
              alt="IACG Multimedia College"
              className="h-16 w-auto object-contain bg-white p-2 rounded-md"
            />
          </div>

          {/* Center Content */}
          <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">Student Career <br />Analysis</h2>
            <p className="text-base lg:text-lg text-gray-200 max-w-md leading-relaxed mb-8 md:mb-0">
              Enter your details to begin the psychometric assessment. This tool will help identify your strengths and interests to guide your future career path.
            </p>

            {/* Mobile Only Start Button */}
            <button
              onClick={() => setShowMobileForm(true)}
              className="md:hidden bg-brand-gold text-brand-navy px-8 py-3.5 rounded-full font-bold uppercase tracking-widest shadow-lg hover:bg-white transition-all transform active:scale-95 flex items-center gap-2 mt-6 animate-pulse"
            >
              Get Started
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Bottom Indicators */}
          <div className="flex-none flex gap-2 opacity-70 justify-center md:justify-start pb-4 md:pb-0">
            <div className="w-2 h-2 rounded-full bg-brand-gold"></div>
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className={`
          ${showMobileForm ? 'flex' : 'hidden md:flex'}
          w-full md:w-1/2 items-center justify-center p-4 md:p-8 lg:p-12 bg-gray-50 h-screen overflow-y-auto animate-fade-in
      `}>
        <div className="w-[90%] md:w-[80%] max-w-md my-auto mx-auto">
          <div className="text-center lg:text-left mb-4 md:mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-brand-navy tracking-tight mb-1 md:mb-2">
              Student Details
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Please provide complete information to start the test.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Student Name */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide">
                <UserCircle size={14} className="text-brand-navy" />
                Student Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className={`w-full px-3 py-2.5 bg-white border rounded-lg text-gray-900 outline-none text-sm transition-all ${getError('name') ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-300 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20'} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                placeholder="Student Full Name"
              />
              {getError('name') && <p className="text-[10px] text-red-500 font-bold">{getError('name')}</p>}
            </div>

            {/* Select School */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide">
                <School size={14} className="text-brand-navy" />
                Select School
              </label>
              <div className="relative">
                <select
                  value={selectedSchoolCode}
                  onChange={(e) => setSelectedSchoolCode(e.target.value)}
                  disabled={isLoading || isSchoolsLoading}
                  className={`w-full px-3 py-2.5 bg-white border rounded-lg text-gray-900 outline-none appearance-none text-sm cursor-pointer transition-all ${getError('school') ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-300 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20'} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <option value="" disabled>
                    {isSchoolsLoading ? "Loading schools..." : "Select School"}
                  </option>
                  {schools.map((sch) => (
                    <option key={sch.code} value={sch.code}>{sch.displayName}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                  {isSchoolsLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  )}
                </div>
              </div>
              {getError('school') && <p className="text-[10px] text-red-500 font-bold">{getError('school')}</p>}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-brand-navy text-white py-3.5 rounded-lg font-bold hover:bg-brand-navyLight transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-navy/30 hover:shadow-xl transform hover:-translate-y-0.5 text-base uppercase tracking-wide ${isLoading ? 'cursor-not-allowed opacity-80' : ''}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Please wait...
                  </>
                ) : (
                  <>
                    Start Assessment
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