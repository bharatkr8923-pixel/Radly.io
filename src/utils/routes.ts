export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  TEACHER_DASHBOARD: '/teacher-dashboard',
  TEACHER_CREATE_EXAM: '/teacher/create-exam',
  TEACHER_EXAMS: '/teacher/exams',
  TEACHER_EDIT_EXAM: '/teacher/exam/:id/edit',
  TEACHER_EXAM_RESULTS: '/teacher/exam/:id/results',

  STUDENT_DASHBOARD: '/student-dashboard',
  STUDENT_TAKE_EXAM: '/student/exam/:id',
  STUDENT_EXAM_RESULT: '/student/exam/:id/result',
  STUDENT_HISTORY: '/student/history',
} as const;

export function getTeacherEditExamRoute(examId: string): string {
  return `/teacher/exam/${examId}/edit`;
}

export function getTeacherExamResultsRoute(examId: string): string {
  return `/teacher/exam/${examId}/results`;
}

export function getStudentTakeExamRoute(examId: string): string {
  return `/student/exam/${examId}`;
}

export function getStudentExamResultRoute(examId: string): string {
  return `/student/exam/${examId}/result`;
}
