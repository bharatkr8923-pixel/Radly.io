import { Exam, Question, ExamAttempt, StudentAnswer, AnswerOption } from '../types';

const STORAGE_KEYS = {
  EXAMS: 'exams',
  QUESTIONS: 'questions',
  ATTEMPTS: 'attempts',
  ANSWERS: 'answers',
  ANSWER_OPTIONS: 'answer_options',
};

export const storageUtils = {
  getExams: (teacherId?: string): Exam[] => {
    const exams = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXAMS) || '[]');
    return teacherId ? exams.filter((e: Exam) => e.created_by === teacherId) : exams;
  },

  getExam: (examId: string): Exam | null => {
    const exams = storageUtils.getExams();
    return exams.find((e) => e.id === examId) || null;
  },

  getExamById: (examId: string): Exam | null => {
    const exams = storageUtils.getExams();
    return exams.find((e) => e.id === examId) || null;
  },

  saveExam: (exam: Exam): void => {
    const exams = storageUtils.getExams();
    const existingIndex = exams.findIndex((e) => e.id === exam.id);

    if (existingIndex >= 0) {
      exams[existingIndex] = { ...exam, updated_at: new Date().toISOString() };
    } else {
      exams.push(exam);
    }

    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  },

  deleteExam: (examId: string): void => {
    const exams = storageUtils.getExams().filter((e) => e.id !== examId);
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));

    const questions = storageUtils.getQuestions().filter((q) => q.exam_id !== examId);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));

    const attempts = storageUtils.getAttempts().filter((a) => a.exam_id !== examId);
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
  },

  getQuestions: (examId?: string): Question[] => {
    const questions = JSON.parse(localStorage.getItem(STORAGE_KEYS.QUESTIONS) || '[]');
    if (examId) {
      return questions.filter((q: Question) => q.exam_id === examId);
    }
    return questions;
  },

  saveQuestions: (questions: Question[]): void => {
    const allQuestions = storageUtils.getQuestions();

    questions.forEach((newQ) => {
      const existingIndex = allQuestions.findIndex((q) => q.id === newQ.id);
      if (existingIndex >= 0) {
        allQuestions[existingIndex] = newQ;
      } else {
        allQuestions.push(newQ);
      }
    });

    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(allQuestions));
  },

  getAnswerOptions: (questionId?: string): AnswerOption[] => {
    const options = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANSWER_OPTIONS) || '[]');
    if (questionId) {
      return options.filter((o: AnswerOption) => o.question_id === questionId);
    }
    return options;
  },

  saveAnswerOptions: (options: AnswerOption[]): void => {
    const allOptions = storageUtils.getAnswerOptions();

    options.forEach((newO) => {
      const existingIndex = allOptions.findIndex((o) => o.id === newO.id);
      if (existingIndex >= 0) {
        allOptions[existingIndex] = newO;
      } else {
        allOptions.push(newO);
      }
    });

    localStorage.setItem(STORAGE_KEYS.ANSWER_OPTIONS, JSON.stringify(allOptions));
  },

  getAttempts: (examId?: string): ExamAttempt[] => {
    const attempts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTEMPTS) || '[]');
    if (examId) {
      return attempts.filter((a: ExamAttempt) => a.exam_id === examId);
    }
    return attempts;
  },

  saveAttempt: (attempt: ExamAttempt): void => {
    const attempts = storageUtils.getAttempts();
    const existingIndex = attempts.findIndex((a) => a.id === attempt.id);

    if (existingIndex >= 0) {
      attempts[existingIndex] = attempt;
    } else {
      attempts.push(attempt);
    }

    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
  },

  getAnswers: (attemptId?: string): StudentAnswer[] => {
    const answers = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANSWERS) || '[]');
    if (attemptId) {
      return answers.filter((a: StudentAnswer) => a.attempt_id === attemptId);
    }
    return answers;
  },

  saveAnswer: (answer: StudentAnswer): void => {
    const answers = storageUtils.getAnswers();
    const existingIndex = answers.findIndex((a) => a.id === answer.id);

    if (existingIndex >= 0) {
      answers[existingIndex] = answer;
    } else {
      answers.push(answer);
    }

    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));
  },

  getTotalStudents: (): number => {
    const attempts = storageUtils.getAttempts();
    const uniqueStudents = new Set(attempts.map((a) => a.student_id));
    return uniqueStudents.size;
  },
};
