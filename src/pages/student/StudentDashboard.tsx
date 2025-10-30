import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Trophy, Clock, TrendingUp, BookOpen, Calendar, FileText, ArrowRight } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import PageHeader from '../../components/layout/PageHeader';
import { Card, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { ROUTES, getStudentTakeExamRoute } from '../../utils/routes';
import { useAuthStore } from '../../store/authStore';
import { storageUtils } from '../../utils/storage';
import { formatDate } from '../../utils/date';
import type { Exam, ExamAttempt } from '../../types';

const navItems = [
  { to: ROUTES.STUDENT_DASHBOARD, icon: Home, label: 'Dashboard' },
  { to: '/student/results', icon: Trophy, label: 'My Results' },
  { to: ROUTES.STUDENT_HISTORY, icon: Clock, label: 'History' },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [allExams, setAllExams] = useState<Exam[]>([]);
  const [myAttempts, setMyAttempts] = useState<ExamAttempt[]>([]);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    const exams = storageUtils.getExams();
    setAllExams(exams);

    if (user?.id) {
      const attempts = storageUtils.getAttempts().filter((a) => a.student_id === user.id);
      setMyAttempts(attempts);
    }
  };

  const completedAttempts = myAttempts.filter((a) => a.completed_at);
  const avgScore = completedAttempts.length > 0
    ? Math.round(completedAttempts.reduce((sum, a) => sum + a.score, 0) / completedAttempts.length)
    : 0;

  const hasAttempted = (examId: string) => {
    return myAttempts.some((a) => a.exam_id === examId && a.completed_at);
  };

  const getAttemptCount = (examId: string) => {
    return myAttempts.filter((a) => a.exam_id === examId && a.completed_at).length;
  };

  const getBestScore = (examId: string) => {
    const examAttempts = myAttempts.filter((a) => a.exam_id === examId && a.completed_at);
    if (examAttempts.length === 0) return null;
    return Math.max(...examAttempts.map((a) => a.score));
  };

  return (
    <MainLayout navItems={navItems} userName={user?.name} userRole={user?.role}>
      <PageHeader
        title={`Welcome back, ${user?.name}!`}
        description="Browse available exams and track your progress"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
        <Card className="group">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600 mb-1">Available Exams</p>
                <p className="text-4xl font-bold bg-gradient-to-br from-blue-600 to-blue-400 bg-clip-text text-transparent mt-2">{allExams.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="group">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600 mb-1">Completed Exams</p>
                <p className="text-4xl font-bold bg-gradient-to-br from-green-600 to-emerald-500 bg-clip-text text-transparent mt-2">{completedAttempts.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="group">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600 mb-1">Average Score</p>
                <p className="text-4xl font-bold bg-gradient-to-br from-orange-600 to-amber-500 bg-clip-text text-transparent mt-2">
                  {completedAttempts.length > 0 ? `${avgScore}%` : '-'}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {allExams.length === 0 ? (
        <Card className="animate-scale-in">
          <CardBody>
            <EmptyState
              icon={BookOpen}
              title="No exams available"
              description="There are no exams available at the moment. Check back later."
            />
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-primary mb-6">Available Exams</h2>
          {allExams.map((exam) => {
            const attempted = hasAttempted(exam.id);
            const attemptCount = getAttemptCount(exam.id);
            const bestScore = getBestScore(exam.id);

            return (
              <Card key={exam.id} className="group hover:border-primary/30">
                <CardBody>
                  <div className="flex items-start justify-between relative">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-secondary-900">
                          {exam.title}
                        </h3>
                        {attempted && (
                          <Badge variant="success">Completed</Badge>
                        )}
                      </div>
                      {exam.description && (
                        <p className="text-sm text-secondary-600 mb-3">{exam.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-secondary-500">
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          <span>{exam.questions_count} questions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Created {formatDate(exam.created_at)}</span>
                        </div>
                        {attempted && (
                          <>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{attemptCount} attempt{attemptCount !== 1 ? 's' : ''}</span>
                            </div>
                            {bestScore !== null && (
                              <Badge variant="primary">Best: {bestScore}%</Badge>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <Button onClick={() => navigate(getStudentTakeExamRoute(exam.id))}>
                        {attempted ? 'Retake' : 'Start Exam'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
}
