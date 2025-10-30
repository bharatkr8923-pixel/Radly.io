import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, FileText, Award, Clock, Target, Activity, ClipboardList } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import PageHeader from '../../components/layout/PageHeader';
import { Card, CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Home, Plus } from 'lucide-react';
import { ROUTES } from '../../utils/routes';
import { useAuthStore } from '../../store/authStore';
import { storageUtils } from '../../utils/storage';
import { formatDate } from '../../utils/date';
import type { Exam, Attempt } from '../../types';

const navItems = [
  { to: ROUTES.TEACHER_DASHBOARD, icon: Home, label: 'Dashboard' },
  { to: ROUTES.TEACHER_CREATE_EXAM, icon: Plus, label: 'Create Exam' },
  { to: ROUTES.TEACHER_EXAMS, icon: FileText, label: 'My Exams' },
  { to: '/teacher/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/teacher/reports', icon: ClipboardList, label: 'Student Reports' },
];

export default function Analytics() {
  const user = useAuthStore((state) => state.user);
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    if (user?.id) {
      const teacherExams = storageUtils.getExams(user.id);
      setExams(teacherExams);

      const allAttempts = teacherExams.flatMap(exam =>
        storageUtils.getAttempts(exam.id).filter(a => a.completed_at)
      );
      setAttempts(allAttempts);
    }
  }, [user]);

  const totalAttempts = attempts.length;
  const uniqueStudents = new Set(attempts.map(a => a.student_id)).size;
  const averageScore = totalAttempts > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts)
    : 0;
  const passRate = totalAttempts > 0
    ? Math.round((attempts.filter(a => a.score >= 60).length / totalAttempts) * 100)
    : 0;

  const getExamAnalytics = (exam: Exam) => {
    const examAttempts = attempts.filter(a => a.exam_id === exam.id);
    if (examAttempts.length === 0) return null;

    const avgScore = examAttempts.reduce((sum, a) => sum + a.score, 0) / examAttempts.length;
    const passCount = examAttempts.filter(a => a.score >= 60).length;
    const passRate = (passCount / examAttempts.length) * 100;

    return {
      attempts: examAttempts.length,
      avgScore: Math.round(avgScore),
      passRate: Math.round(passRate),
      highestScore: Math.max(...examAttempts.map(a => a.score)),
      lowestScore: Math.min(...examAttempts.map(a => a.score)),
    };
  };

  const getScoreDistribution = () => {
    const ranges = [
      { label: '0-20%', min: 0, max: 20, count: 0 },
      { label: '21-40%', min: 21, max: 40, count: 0 },
      { label: '41-60%', min: 41, max: 60, count: 0 },
      { label: '61-80%', min: 61, max: 80, count: 0 },
      { label: '81-100%', min: 81, max: 100, count: 0 },
    ];

    attempts.forEach(attempt => {
      const range = ranges.find(r => attempt.score >= r.min && attempt.score <= r.max);
      if (range) range.count++;
    });

    return ranges;
  };

  const scoreDistribution = getScoreDistribution();
  const maxDistCount = Math.max(...scoreDistribution.map(r => r.count), 1);

  return (
    <MainLayout navItems={navItems} userName={user?.name} userRole={user?.role}>
      <PageHeader
        title="Analytics"
        description="Comprehensive insights into exam performance and student activity"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600 mb-1">Total Attempts</p>
                <p className="text-3xl font-bold text-secondary-900 mt-2">{totalAttempts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600 mb-1">Active Students</p>
                <p className="text-3xl font-bold text-secondary-900 mt-2">{uniqueStudents}</p>
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
                <p className="text-sm font-medium text-secondary-600 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-secondary-900 mt-2">{averageScore}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600 mb-1">Pass Rate</p>
                <p className="text-3xl font-bold text-secondary-900 mt-2">{passRate}%</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-secondary-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Score Distribution
            </h3>
            <div className="space-y-4">
              {scoreDistribution.map((range, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-secondary-700">{range.label}</span>
                    <span className="text-sm font-semibold text-secondary-900">{range.count} students</span>
                  </div>
                  <div className="w-full bg-secondary-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(range.count / maxDistCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-secondary-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {attempts.length === 0 ? (
                <div className="text-center py-8 text-secondary-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No activity to display</p>
                </div>
              ) : (
                attempts
                  .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
                  .slice(0, 5)
                  .map((attempt) => {
                    const exam = exams.find(e => e.id === attempt.exam_id);
                    return (
                      <div key={attempt.id} className="flex items-center justify-between py-3 border-b border-secondary-100 last:border-0">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-secondary-900">{exam?.title || 'Unknown Exam'}</p>
                          <p className="text-xs text-secondary-500 mt-1">
                            {formatDate(attempt.completed_at!)}
                          </p>
                        </div>
                        <Badge variant={attempt.score >= 60 ? 'success' : 'error'}>
                          {attempt.score}%
                        </Badge>
                      </div>
                    );
                  })
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold text-secondary-900 mb-6">Exam Performance Overview</h3>
          <div className="space-y-4">
            {exams.length === 0 ? (
              <div className="text-center py-12 text-secondary-500">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No exams created yet</p>
                <p className="text-sm">Create your first exam to start seeing analytics</p>
              </div>
            ) : (
              exams.map((exam) => {
                const analytics = getExamAnalytics(exam);
                if (!analytics) {
                  return (
                    <Card key={exam.id} className="bg-secondary-50">
                      <CardBody>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-secondary-900 mb-1">{exam.title}</h4>
                            <p className="text-sm text-secondary-500">No attempts yet</p>
                          </div>
                          <Badge variant="secondary">0 attempts</Badge>
                        </div>
                      </CardBody>
                    </Card>
                  );
                }

                return (
                  <Card key={exam.id}>
                    <CardBody>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-secondary-900 mb-1">{exam.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-secondary-500">
                            <span>{exam.questions_count} questions</span>
                            <span>{analytics.attempts} attempts</span>
                          </div>
                        </div>
                        <Badge variant="success">
                          {analytics.passRate}% pass rate
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-secondary-100">
                        <div>
                          <p className="text-xs text-secondary-500 mb-1">Average Score</p>
                          <p className="text-xl font-bold text-secondary-900">{analytics.avgScore}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-secondary-500 mb-1">Highest Score</p>
                          <p className="text-xl font-bold text-green-600">{analytics.highestScore}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-secondary-500 mb-1">Lowest Score</p>
                          <p className="text-xl font-bold text-orange-600">{analytics.lowestScore}%</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })
            )}
          </div>
        </CardBody>
      </Card>
    </MainLayout>
  );
}
