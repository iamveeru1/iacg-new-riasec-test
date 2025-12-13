import React, { useState } from 'react';
import { User, ViewState, AssessmentData, UserAnswers } from './types';
import { SAMPLE_ASSESSMENT } from './constants';
import StudentInputScreen from './components/Auth/StudentInputScreen';
import TestScreen from './components/Assessment/TestScreen';
import SubmissionSuccessScreen from './components/Assessment/SubmissionSuccessScreen';
import Header from './components/Layout/Header';

import { db } from './utils/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState<User | null>(null);
  // Default to Student Details View
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.STUDENT_DETAILS);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});

  // Loading states for async operations
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<{ [key: string]: string }>({});

  const handleStudentDetailsSubmit = async (studentUser: User) => {
    setIsLoading(true);
    setServerErrors({}); // Clear previous errors

    try {
      const studentsRef = collection(db, "students");

      // 1. Save student details to Firestore 'students' collection (Checks removed as fields are removed)

      // 1. Save student details to Firestore 'students' collection
      const docRef = await addDoc(studentsRef, {
        ...studentUser,
        status: 'REGISTERED',
        createdAt: serverTimestamp(),
      });

      // 2. Attach the generated ID to the user object
      const userWithId = { ...studentUser, id: docRef.id };
      setUser(userWithId);

      // 3. Direct flow: Load sample assessment and go to Assessment view (starts with Instructions)
      setAssessmentData(SAMPLE_ASSESSMENT);
      setCurrentView(ViewState.ASSESSMENT);
    } catch (error) {
      console.error("Error saving student details:", error);
      alert("There was an error saving your details. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAssessmentData(null);
    setUserAnswers({});
    setCurrentView(ViewState.STUDENT_DETAILS);
    setServerErrors({});
  };

  const completeTest = async (answers: UserAnswers) => {
    if (!user?.id) {
      console.error("No user ID found, cannot save results.");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Update the existing student document with answers and completion status
      const studentRef = doc(db, "students", user.id);

      await updateDoc(studentRef, {
        answers: answers,
        status: 'COMPLETED',
        completedAt: serverTimestamp()
      });

      setUserAnswers(answers);
      setCurrentView(ViewState.SUCCESS);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Failed to submit test. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-brand-text font-sans relative">

      <div className="flex flex-col min-h-screen">
        {/* Only show Header if we have user details and not in student details screen */}
        {currentView !== ViewState.STUDENT_DETAILS && (
          <Header
            user={user}
            onLogout={handleLogout}
          />
        )}

        {/* Views */}
        {currentView === ViewState.STUDENT_DETAILS ? (
          <StudentInputScreen
            onSubmit={handleStudentDetailsSubmit}
            isLoading={isLoading}
            serverErrors={serverErrors}
          />
        ) : currentView === ViewState.ASSESSMENT && assessmentData ? (
          <TestScreen
            data={assessmentData}
            onComplete={completeTest}
            isSubmitting={isLoading}
          />
        ) : currentView === ViewState.SUCCESS ? (
          <SubmissionSuccessScreen
            onGoHome={handleLogout}
          />
        ) : null}
      </div>
    </div>
  );
}

export default App;