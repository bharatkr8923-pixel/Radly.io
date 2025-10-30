import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Plus, FileText, BarChart3, Edit, Trash2, Users, Calendar, ClipboardList } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { Card, CardBody } from '../../components/ui/Card';
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

export default function ManageExams() {
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

  const getExamStats = (examId: string) => {
    const attempts = storageUtils.getAttempts(examId).filter((a) => a.completed_at);
    if (attempts.length === 0) return null;

    const avgScore = attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length;
    return {
      attempts: attempts.length,
      avgScore: Math.round(avgScore),
    };
  };

  if (exams.length === 0) {
    return (
      <MainLayout navItems={navItems} userName={user?.name} userRole={user?.role}>
        <PageHeader
          title="My Exams"
          description="View and manage all your examinations"
        />

        <Card className="p-6">
          <EmptyState
            icon={FileText}
            title="No exams found"
            description="You haven't created any exams yet. Create your first exam to get started."
            action={
              <Button onClick={() => navigate(ROUTES.TEACHER_CREATE_EXAM)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Exam
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
        title="My Exams"
        description="View and manage all your examinations"
        action={
          <Button onClick={() => navigate(ROUTES.TEACHER_CREATE_EXAM)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Exam
          </Button>
        }
      />

      <div className="space-y-4">
        {exams.map((exam) => {
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
