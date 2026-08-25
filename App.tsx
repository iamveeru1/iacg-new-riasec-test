import React, { useState, useEffect } from 'react';
import { User, ViewState, AssessmentData, UserAnswers } from './types';
import { buildMCQAssessment } from './data/mcq_questions';
import StudentInputScreen from './components/Auth/StudentInputScreen';
import TestScreen from './components/Assessment/TestScreen';
import SubmissionSuccessScreen from './components/Assessment/SubmissionSuccessScreen';
import Header from './components/Layout/Header';

import { db, auth } from './utils/firebase';
import { collection, doc, setDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

function App() {
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          try {
            await signInAnonymously(auth);
            console.log("Signed in anonymously");
          } catch (error) {
            console.warn("Anonymous sign-in skipped (static mode):", error);
          }
        } else {
          console.log("User already signed in:", user.uid);
        }
      });
    } catch (err) {
      console.warn("Auth state observer skipped (static mode):", err);
    }

    return () => {
      try {
        unsubscribe();
      } catch (e) {}
    };
  }, []);

  const [user, setUser] = useState<User | null>(null);
  // Default to Student Details View
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.STUDENT_DETAILS);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});

  // Loading states for async operations
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<{ [key: string]: string }>({});

  const handleStudentDetailsSubmit = (studentUser: User) => {
    setUser(studentUser);
    // Randomly pick 20 questions from the 50-question MCQ bank for this student
    setAssessmentData(buildMCQAssessment(20));
    setCurrentView(ViewState.ASSESSMENT);
  };

  const handleLogout = () => {
    setUser(null);
    setAssessmentData(null);
    setUserAnswers({});
    setCurrentView(ViewState.STUDENT_DETAILS);
    setServerErrors({});
  };

  const completeTest = async (answers: UserAnswers) => {
    setIsLoading(true);

    const allQuestions = assessmentData?.sections.flatMap(s => s.questions) || [];
    const testTitle = assessmentData?.sections[0]?.title || 'Architecture, Construction & Built Environment';
    const testId = assessmentData?.milestoneId || 'architecture_construction_built_environment';
    
    // Build clean results map: { questionId: "correct" | "wrong" }
    const results: { [questionId: string]: 'correct' | 'wrong' } = {};
    allQuestions.forEach(q => {
      results[q.id] = answers[q.id] === q.correctAnswer ? 'correct' : 'wrong';
    });

    const userEmail = (user?.email || '').trim().toLowerCase();

    try {
      if (userEmail) {
        // Document ID is the student's email, ensuring all tests for this student are grouped in one document
        const studentDocRef = doc(db, "students", userEmail);
        
        // Save under tests[testId] with merge: true so other tests are preserved
        await setDoc(studentDocRef, {
          email: user?.email || userEmail,
          tests: {
            [testId]: {
              testId: testId,
              testName: testTitle,
              results: results
            }
          }
        }, { merge: true });

        console.log("Firebase submission saved successfully for student:", {
          email: userEmail,
          testId,
          results
        });
      }
    } catch (error) {
      console.warn("Firebase save error:", error);
    } finally {
      setUserAnswers(answers);
      setCurrentView(ViewState.SUCCESS);
      window.scrollTo(0, 0);
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