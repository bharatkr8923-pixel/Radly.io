import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Trophy, Clock, Calendar, FileText } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import PageHeader from '../../components/layout/PageHeader';
import { Card, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { ROUTES, getStudentExamResultRoute } from '../../utils/routes';
import { useAuthStore } from '../../store/authStore';
import { storageUtils } from '../../utils/storage';
import { formatDate } from '../../utils/date';
import type { ExamAttempt } from '../../types';

const navItems = [
  { to: ROUTES.STUDENT_DASHBOARD, icon: Home, label: 'Dashboard' },
  { to: '/student/results', icon: Trophy, label: 'My Results' },
  { to: ROUTES.STUDENT_HISTORY, icon: Clock, label: 'History' },
];

interface AttemptWithExam extends ExamAttempt {
  examTitle: string;
}

export default function ExamHistory() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [attempts, setAttempts] = useState<AttemptWithExam[]>([]);

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = () => {
    if (!user?.id) return;

    const allAttempts = storageUtils.getAttempts()
      .filter((a) => a.student_id === user.id && a.completed_at)
      .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime());

    const attemptsWithExams: AttemptWithExam[] = allAttempts.map((attempt) => {
      const exam = storageUtils.getExam(attempt.exam_id);
      return {
        ...attempt,
        examTitle: exam?.title || 'Unknown Exam',
      };
    });

    setAttempts(attemptsWithExams);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreVariant = (score: number): 'success' | 'warning' | 'error' => {
    if (score >= 70) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  if (attempts.length === 0) {
    return (
      <MainLayout navItems={navItems} userName={user?.name} userRole={user?.role}>
        <PageHeader
          title="Exam History"
          description="View all your past exam attempts and results"
        />

        <Card className="p-6">
          <EmptyState
            icon={Clock}
            title="No exam history"
            description="You haven't taken any exams yet. Start by taking an available exam."
            action={
              <Button onClick={() => navigate(ROUTES.STUDENT_DASHBOARD)}>
                Browse Exams
              </Button>
            }
          />
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout navItems={navItems} userName={user?.name} userRole={user?.role}>
      <PageHeader
        title="Exam History"
        description="View all your past exam attempts and results"
      />

      <div className="space-y-4">
        {attempts.map((attempt) => (
          <Card key={attempt.id}>
            <CardBody>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    {attempt.examTitle}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-secondary-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(attempt.completed_at!)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{attempt.total_questions} questions</span>
                    </div>
                    {attempt.time_taken && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(attempt.time_taken)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getScoreVariant(attempt.score)}>
                      Score: {attempt.score}%
                    </Badge>
                    <span className="text-sm text-secondary-600">
                      {Math.round((attempt.score / 100) * attempt.total_questions)} / {attempt.total_questions} correct
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(getStudentExamResultRoute(attempt.id))}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
}
