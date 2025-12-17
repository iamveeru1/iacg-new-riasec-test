import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { UserCircle, School, ArrowRight, Loader2, MapPin, Phone, Mail, User as UserIcon } from 'lucide-react';

interface StudentInputScreenProps {
  onSubmit: (user: User) => void;
  isLoading?: boolean;
  serverErrors?: { [key: string]: string };
}

const StudentInputScreen: React.FC<StudentInputScreenProps> = ({ onSubmit, isLoading = false, serverErrors = {} }) => {
  // Core Fields
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');

  // Student Details
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');

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

    // Debug log to ensure params are captured
    console.log("Params captured:", { sName, uCode, cEmail, sBoard });
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

    // Grade
    if (!grade.trim()) {
      newErrors.grade = "Grade is required";
      isValid = false;
    }

    // Additional Details Validation
    if (!parentName.trim()) {
      newErrors.parentName = "Parent Name is required";
      isValid = false;
    }
    if (!phone.trim()) {
      newErrors.phone = "Phone is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      newErrors.phone = "Enter valid 10-digit number";
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }
    if (!location.trim()) {
      newErrors.location = "Location is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (validate()) {
      const user: User = {
        name: name.trim(),
        studentClass: grade.trim(),
        school: schoolName || 'Unknown School', // Default if not provided
        schoolCode: uniqueCode || 'N/A',
        counsellorEmail: counsellorEmail,
        board: board,
        // Additional Details
        parentName: parentName.trim(),
        mobileNumber: phone.trim(),
        email: email.trim(),
        location: location.trim(),
      };
      console.log("Submitting user:", user);
      onSubmit(user);
    }
  };

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
          {/* Top Section: Logo + Text */}
          <div className="flex-1 flex flex-col items-center md:items-start pt-4 md:pt-0">
            {/* Logo */}
            <div className="mb-6 md:mb-8">
              <img
                src="/logo.png"
                alt="IACG Multimedia College"
                className="h-16 w-auto object-contain bg-white p-2 rounded-md"
              />
            </div>

            {/* Text Content */}
            <div className="text-center md:text-left">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">Student Career Analysis</h2>
              <p className="text-base lg:text-lg text-gray-200 max-w-md leading-relaxed">
                Enter your details to begin the psychometric assessment. This tool will help identify your strengths and interests.
              </p>

              <button
                onClick={() => setShowMobileForm(true)}
                className="md:hidden bg-brand-gold text-brand-navy px-8 py-3.5 rounded-full font-bold uppercase tracking-widest shadow-lg hover:bg-white transition-all transform active:scale-95 flex items-center gap-2 mt-8 animate-pulse mx-auto md:mx-0"
              >
                Get Started
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div className="flex-none flex gap-2 opacity-70 justify-center md:justify-start pb-4 md:pb-0">
            {schoolName && (
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                <p className="text-xs uppercase tracking-wider text-gray-300">Taking test for</p>
                <div className="flex flex-col">
                  <p className="font-bold text-xl">{schoolName}</p>
                  {board && <p className="text-sm font-medium text-brand-gold">{board} Board</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className={`
          ${showMobileForm ? 'flex' : 'hidden md:flex'}
          w-full md:w-1/2 items-center justify-center p-4 md:p-8 lg:p-12 bg-gray-50 h-screen overflow-y-auto animate-fade-in
      `}>
        <div className="w-[90%] md:w-[80%] max-w-md my-auto mx-auto pb-8">
          <div className="text-center lg:text-left mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-brand-navy tracking-tight mb-2">
              Student Details
            </h2>
            <p className="text-sm text-gray-600">
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

            {/* Grade */}
            <div className="space-y-1">
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide">
                <School size={14} className="text-brand-navy" />
                Grade / Class
              </label>
              <div className="relative">
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  disabled={isLoading}
                  className={`w-full px-3 py-2.5 bg-white border rounded-lg text-gray-900 outline-none appearance-none text-sm cursor-pointer transition-all ${getError('grade') ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-300 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20'} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <option value="" disabled>Select Class</option>
                  <option value="Grade 8">Grade 8</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              {getError('grade') && <p className="text-[10px] text-red-500 font-bold">{getError('grade')}</p>}
            </div>

            {/* Additional Details Fields */}
            <div className="space-y-4 animate-fade-in">
              {/* Parent Name */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide">
                  <UserIcon size={14} className="text-brand-navy" />
                  Parent Name
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className={`w-full px-3 py-2.5 bg-white border rounded-lg text-sm ${getError('parentName') ? 'border-red-500' : 'border-gray-300 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20'}`}
                  placeholder="Parent Name"
                />
                {getError('parentName') && <p className="text-[10px] text-red-500 font-bold">{getError('parentName')}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide">
                  <Phone size={14} className="text-brand-navy" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-3 py-2.5 bg-white border rounded-lg text-sm ${getError('phone') ? 'border-red-500' : 'border-gray-300 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20'}`}
                  placeholder="10-digit Mobile Number"
                />
                {getError('phone') && <p className="text-[10px] text-red-500 font-bold">{getError('phone')}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide">
                  <Mail size={14} className="text-brand-navy" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3 py-2.5 bg-white border rounded-lg text-sm ${getError('email') ? 'border-red-500' : 'border-gray-300 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20'}`}
                  placeholder="email@example.com"
                />
                {getError('email') && <p className="text-[10px] text-red-500 font-bold">{getError('email')}</p>}
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 uppercase tracking-wide">
                  <MapPin size={14} className="text-brand-navy" />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full px-3 py-2.5 bg-white border rounded-lg text-sm ${getError('location') ? 'border-red-500' : 'border-gray-300 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/20'}`}
                  placeholder="City, State"
                />
                {getError('location') && <p className="text-[10px] text-red-500 font-bold">{getError('location')}</p>}
              </div>
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
          </form >
        </div >
      </div >
    </div >
  );
};

export default StudentInputScreen;