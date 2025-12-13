
export enum ViewState {
  STUDENT_DETAILS = 'STUDENT_DETAILS',
  MILESTONES = 'MILESTONES',
  INSTRUCTIONS = 'INSTRUCTIONS',
  ASSESSMENT = 'ASSESSMENT',
  SUCCESS = 'SUCCESS',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
}

export interface User {
  id?: string;
  name: string;
  school: string;
  studentClass?: string;
  email?: string;
  parentName?: string;
  schoolAddress?: string;
  mobileNumber?: string;
  board?: string;
  schoolCode?: string;
}

export interface Milestone {
  id: string;
  title: string;
  iconName: string; // mapping string to icon component
}

export interface Question {
  id: string;
  questionNumber?: string;
  subheading?: string;
  text: string;
  options?: string[];
  type: 'radio' | 'likert' | 'rating' | 'text' | 'checkbox' | 'textarea' | 'scale_0_4';
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export interface AssessmentData {
  milestoneId: string;
  sections: Section[];
}

export interface UserAnswers {
  [questionId: string]: string;
}