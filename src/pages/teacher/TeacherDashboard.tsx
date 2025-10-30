import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Plus, FileText, BarChart3, Users, Calendar, TrendingUp, Edit, Trash2, ClipboardList } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import PageHeader from '../../components/layout/PageHeader';
import { Card, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { ROUTES } from '../../utils/routes';
import { useAuthStore } from '../../store/authStore';
import { storageUtils } from '../../utils/storage';
import { formatDate } from '../../utils/date';
import type { Exam } from '../../types';

const navItems = [
  { to: ROUTES.TEACHER_DASHBOARD, icon: Home, label: 'Dashboard' },
  { to: ROUTES.TEACHER_CREATE_EXAM, icon: Plus, label: 'Create Exam' },
  { to: ROUTES.TEACHER_EXAMS, icon: FileText, label: 'My Exams' },
  { to: '/teacher/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/teacher/reports', icon: ClipboardList, label: 'Student Reports' },
];

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [exams, setExams] = useState<Exam[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadExams();
  }, [user]);

  const loadExams = () => {
    if (user?.id) {
      const teacherExams = storageUtils.getExams(user.id);
      setExams(teacherExams);
    }
  };

  const handleDeleteExam = (examId: string) => {
    storageUtils.deleteExam(examId);
    loadExams();
    setDeleteConfirm(null);
  };

  const totalExams = exams.length;
  const totalStudents = storageUtils.getTotalStudents();
  const recentAttempts = storageUtils.getAttempts().filter((a) =>
    exams.some((e) => e.id === a.exam_id)
  );

  const getExamStats = (examId: string) => {
    const attempts = storageUtils.getAttempts(examId).filter((a) => a.completed_at);
    if (attempts.length === 0) return null;

    const avgScore = attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length;
    return {
      attempts: attempts.length,
      avgScore: Math.round(avgScore),
    };
  };

  if (totalExams === 0) {
    return (
      <MainLayout navItems={navItems} userName={user?.name} userRole={user?.role}>
        <PageHeader
          title={`Welcome back, ${user?.name}!`}
          description="Manage your exams and track student performance"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
          <Card className="group">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600 mb-1">Total Exams</p>
                  <p className="text-4xl font-bold bg-gradient-to-br from-blue-600 to-blue-400 bg-clip-text text-transparent mt-2">0</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-sm text-secondary-600">Total Students</p>
              <p className="text-3xl font-bold text-secondary-900 mt-2">0</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-sm text-secondary-600">Recent Activity</p>
              <p className="text-3xl font-bold text-secondary-900 mt-2">0</p>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardBody>
            <EmptyState
              icon={FileText}
              title="No exams created yet"
              description="Get started by creating your first examination"
              action={
                <Button onClick={() => navigate(ROUTES.TEACHER_CREATE_EXAM)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Exam
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
        title={`Welcome back, ${user?.name}!`}
        description="Manage your exams and track student performance"
        action={
          <Button onClick={() => navigate(ROUTES.TEACHER_CREATE_EXAM)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Exam
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Total Exams</p>
                <p className="text-3xl font-bold text-secondary-900 mt-2">{totalExams}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Total Students</p>
                <p className="text-3xl font-bold text-secondary-900 mt-2">{totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600">Recent Activity</p>
                <p className="text-3xl font-bold text-secondary-900 mt-2">{recentAttempts.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">Recent Exams</h2>
        <div className="space-y-4">
          {exams.slice(0, 5).map((exam) => {
            const stats = getExamStats(exam.id);
            return (
              <Card key={exam.id}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                        {exam.title}
                      </h3>
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
                        {stats && (
                          <>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{stats.attempts} attempts</span>
                            </div>
                            <Badge variant="success">Avg: {stats.avgScore}%</Badge>
                          </>
                        )}
                        {!stats && (
                          <Badge variant="secondary">No attempts yet</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/teacher/exam/${exam.id}/edit`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(exam.id)}
                      >
                        <Trash2 className="w-4 h-4 text-error-600" />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {exams.length > 5 && (
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => navigate(ROUTES.TEACHER_EXAMS)}>
              View All Exams
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Exam"
        message="Are you sure you want to delete this exam? This action cannot be undone and will remove all associated student attempts."
        confirmLabel="Delete"
        onConfirm={() => deleteConfirm && handleDeleteExam(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </MainLayout>
  );
}
