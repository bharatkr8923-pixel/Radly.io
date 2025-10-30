import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Trophy, Clock, TrendingUp, Calendar, FileText, Eye } from 'lucide-react';
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

interface ExamResult {
  examId: string;
  examTitle: string;
  attemptCount: number;
  bestScore: number;
  latestScore: number;
  latestAttemptId: string;
  lastAttemptDate: string;
}

export default function MyResults() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [completedAttempts, setCompletedAttempts] = useState<AttemptWithExam[]>([]);

  useEffect(() => {
    loadResults();
  }, [user]);

  const loadResults = () => {
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

    setCompletedAttempts(attemptsWithExams);

    const examMap = new Map<string, ExamResult>();

    attemptsWithExams.forEach((attempt) => {
      const existing = examMap.get(attempt.exam_id);

      if (!existing) {
        examMap.set(attempt.exam_id, {
          examId: attempt.exam_id,
          examTitle: attempt.examTitle,
          attemptCount: 1,
          bestScore: attempt.score,
          latestScore: attempt.score,
          latestAttemptId: attempt.id,
          lastAttemptDate: attempt.completed_at!,
        });
      } else {
        existing.attemptCount += 1;
        existing.bestScore = Math.max(existing.bestScore, attempt.score);
        if (new Date(attempt.completed_at!) > new Date(existing.lastAttemptDate)) {
          existing.latestScore = attempt.score;
          existing.latestAttemptId = attempt.id;
          existing.lastAttemptDate = attempt.completed_at!;
        }
      }
    });

    const resultsList = Array.from(examMap.values()).sort(
      (a, b) => new Date(b.lastAttemptDate).getTime() - new Date(a.lastAttemptDate).getTime()
    );

    setResults(resultsList);
  };

  const getScoreVariant = (score: number): 'success' | 'warning' | 'error' => {
    if (score >= 70) return 'success';
    if (score >= 50) return 'warning';
    return 'error';
  };

  const avgScore = completedAttempts.length > 0
    ? Math.round(completedAttempts.reduce((sum, a) => sum + a.score, 0) / completedAttempts.length)
    : 0;

  const totalExams = results.length;
  const totalAttempts = completedAttempts.length;

  if (results.length === 0) {
    return (
      <MainLayout navItems={navItems} userName={user?.name} userRole={user?.role}>
        <PageHeader
          title="My Results"
          description="View your exam scores and performance"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Exams Taken</p>
                  <p className="text-3xl font-bold text-secondary-900 mt-2">0</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Total Attempts</p>
                  <p className="text-3xl font-bold text-secondary-900 mt-2">0</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-600">Average Score</p>
                  <p className="text-3xl font-bold text-secondary-900 mt-2">-</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardBody>
            <EmptyState
              icon={Trophy}
              title="No results yet"
              description="You haven't completed any exams yet. Start by taking an available exam."
              action={
                <Button onClick={() => navigate(ROUTES.STUDENT_DASHBOARD)}>
                  Browse Exams
                </Button>
              }
            />
          </CardBody>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout navItems={navItems} userName={user?.name} userRole={user?.role}>
      <PageHeader
        title="My Results"
        description="View your exam scores and performance"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Exams Taken</p>
                <p className="text-3xl font-bold text-secondary-900 mt-2">{totalExams}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Total Attempts</p>
                <p className="text-3xl font-bold text-secondary-900 mt-2">{totalAttempts}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Average Score</p>
                <p className="text-3xl font-bold text-secondary-900 mt-2">{avgScore}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">Exam Results</h2>
        {results.map((result) => (
          <Card key={result.examId}>
            <CardBody>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    {result.examTitle}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-secondary-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Last taken: {formatDate(result.lastAttemptDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{result.attemptCount} attempt{result.attemptCount !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getScoreVariant(result.bestScore)}>
                      Best Score: {result.bestScore}%
                    </Badge>
                    <Badge variant={getScoreVariant(result.latestScore)}>
                      Latest: {result.latestScore}%
                    </Badge>
                  </div>
                </div>
                <div className="ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(getStudentExamResultRoute(result.latestAttemptId))}
                  >
                    <Eye className="w-4 h-4 mr-2" />
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
