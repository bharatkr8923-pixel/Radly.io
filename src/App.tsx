import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateExam from './pages/teacher/CreateExam';
import ManageExams from './pages/teacher/ManageExams';
import EditExam from './pages/teacher/EditExam';
import Analytics from './pages/teacher/Analytics';
import StudentReports from './pages/teacher/StudentReports';
import StudentDashboard from './pages/student/StudentDashboard';
import TakeExam from './pages/student/TakeExam';
import ExamResult from './pages/student/ExamResult';
import ExamHistory from './pages/student/ExamHistory';
import MyResults from './pages/student/MyResults';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { ROUTES } from './utils/routes';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  const getDefaultRoute = () => {
    if (!isAuthenticated) return ROUTES.LOGIN;
    return user?.role === 'teacher' ? ROUTES.TEACHER_DASHBOARD : ROUTES.STUDENT_DASHBOARD;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<Navigate to={getDefaultRoute()} replace />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />

        <Route
          path={ROUTES.TEACHER_DASHBOARD}
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.TEACHER_CREATE_EXAM}
          element={
            <ProtectedRoute allowedRole="teacher">
              <CreateExam />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.TEACHER_EXAMS}
          element={
            <ProtectedRoute allowedRole="teacher">
              <ManageExams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/exam/:id/edit"
          element={
            <ProtectedRoute allowedRole="teacher">
              <EditExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/analytics"
          element={
            <ProtectedRoute allowedRole="teacher">
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/reports"
          element={
            <ProtectedRoute allowedRole="teacher">
              <StudentReports />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.STUDENT_DASHBOARD}
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/results"
          element={
            <ProtectedRoute allowedRole="student">
              <MyResults />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.STUDENT_TAKE_EXAM}
          element={
            <ProtectedRoute allowedRole="student">
              <TakeExam />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.STUDENT_EXAM_RESULT}
          element={
            <ProtectedRoute allowedRole="student">
              <ExamResult />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.STUDENT_HISTORY}
          element={
            <ProtectedRoute allowedRole="student">
              <ExamHistory />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
