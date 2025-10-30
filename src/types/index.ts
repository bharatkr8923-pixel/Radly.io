export interface User {
  id: string;
  email: string;
  name: string;
  role: 'teacher' | 'student';
  created_at: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  created_by: string;
  questions_count: number;
  created_at: string;
  updated_at?: string;
}

export interface Question {
  id: string;
  exam_id: string;
  text: string;
  position: number;
  answer_options: AnswerOption[];
}

export interface AnswerOption {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  option_letter: 'A' | 'B' | 'C' | 'D';
}

export interface ExamAttempt {
  id: string;
  exam_id: string;
  student_id: string;
  score: number;
  total_questions: number;
  started_at: string;
  completed_at: string | null;
  time_taken?: number;
}

export interface StudentAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_option_id: string;
  is_correct: boolean;
}

export interface ExamWithQuestions extends Exam {
  questions: Question[];
}

export interface ExamResult extends ExamAttempt {
  exam_title: string;
  student_name: string;
  percentage: number;
  answers: StudentAnswer[];
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: 'teacher' | 'student') => Promise<void>;
  register: (name: string, email: string, password: string, role: 'teacher' | 'student') => Promise<void>;
  logout: () => void;
}
