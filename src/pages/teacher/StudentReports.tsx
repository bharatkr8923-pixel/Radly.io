import { useState, useEffect } from 'react';
import { Search, FileText, TrendingUp, TrendingDown, Award, Clock, Calendar, Filter } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import PageHeader from '../../components/layout/PageHeader';
import { Card, CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import { useAuthStore } from '../../store/authStore';
import { storageUtils } from '../../utils/storage';
import { formatDate } from '../../utils/date';
import { ROUTES } from '../../utils/routes';
import type { User, ExamAttempt, Exam } from '../../types';
import { Home, Plus, FileText as FileTextIcon, BarChart3 } from 'lucide-react';

const navItems = [
  { to: ROUTES.TEACHER_DASHBOARD, icon: Home, label: 'Dashboard' },
  { to: ROUTES.TEACHER_CREATE_EXAM, icon: Plus, label: 'Create Exam' },
  { to: ROUTES.TEACHER_EXAMS, icon: FileTextIcon, label: 'My Exams' },
  { to: '/teacher/analytics', icon: BarChart3, label: 'Analytics' },
];

interface StudentReport {
  student: User;
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  completedExams: number;
  totalTimeTaken: number;
  recentAttempts: ExamAttempt[];
  examDetails: {
    exam: Exam;
    attempt: ExamAttempt;
  }[];
}

export default function StudentReports() {
  const user = useAuthStore((state) => state.user);
  const [studentReports, setStudentReports] = useState<StudentReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<StudentReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'attempts'>('name');

  const getStoredUsers = (): User[] => {
    const stored = localStorage.getItem('exam-system-users');
    if (!stored) return [];
    const users = JSON.parse(stored);
    return users.filter((u: User) => u.role === 'student').map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      created_at: u.created_at,
    }));
  };

  useEffect(() => {
    loadStudentReports();
  }, [user]);

  useEffect(() => {
    filterAndSortReports();
  }, [searchQuery, sortBy, studentReports]);

  const loadStudentReports = () => {
    if (!user?.id) return;

    const teacherExams = storageUtils.getExams(user.id);
    const allAttempts = storageUtils.getAttempts();
    const students = getStoredUsers();

    const reports: StudentReport[] = students
      .map((student) => {
        const studentAttempts = allAttempts.filter(
          (attempt) =>
            attempt.student_id === student.id &&
            attempt.completed_at &&
            teacherExams.some((exam) => exam.id === attempt.exam_id)
        );

        if (studentAttempts.length === 0) {
          return null;
        }

        const scores = studentAttempts.map((a) => a.score);
        const totalScore = scores.reduce((sum, score) => sum + score, 0);
        const avgScore = totalScore / scores.length;

        const examDetails = studentAttempts.map((attempt) => ({
          exam: teacherExams.find((e) => e.id === attempt.exam_id)!,
          attempt,
        }));

        return {
          student,
          totalAttempts: studentAttempts.length,
          averageScore: Math.round(avgScore),
          highestScore: Math.max(...scores),
          lowestScore: Math.min(...scores),
          completedExams: new Set(studentAttempts.map((a) => a.exam_id)).size,
          totalTimeTaken: studentAttempts.reduce(
            (sum, a) => sum + (a.time_taken || 0),
            0
          ),
          recentAttempts: studentAttempts
            .sort((a, b) =>
              new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime()
            )
            .slice(0, 5),
          examDetails: examDetails.sort((a, b) =>
            new Date(b.attempt.completed_at!).getTime() - new Date(a.attempt.completed_at!).getTime()
          ),
        };
      })
      .filter((report): report is StudentReport => report !== null);

    setStudentReports(reports);
  };

  const filterAndSortReports = () => {
    let filtered = [...studentReports];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.student.name.toLowerCase().includes(query) ||
          report.student.email.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.student.name.localeCompare(b.student.name);
        case 'score':
          return b.averageScore - a.averageScore;
        case 'attempts':
          return b.totalAttempts - a.totalAttempts;
        default:
          return 0;
      }
    });

    setFilteredReports(filtered);
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 90) return { variant: 'success' as const, label: 'Excellent', icon: Award };
    if (score >= 75) return { variant: 'primary' as const, label: 'Good', icon: TrendingUp };
    if (score >= 60) return { variant: 'warning' as const, label: 'Average', icon: TrendingUp };
    return { variant: 'error' as const, label: 'Needs Improvement', icon: TrendingDown };
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const calculateOverallStats = () => {
    if (studentReports.length === 0) {
      return {
        totalStudents: 0,
        averageScore: 0,
        totalAttempts: 0,
        excellentStudents: 0,
      };
    }

    const totalScore = studentReports.reduce(
      (sum, report) => sum + report.averageScore,
      0
    );
    const avgScore = totalScore / studentReports.length;
    const totalAttempts = studentReports.reduce(
      (sum, report) => sum + report.totalAttempts,
      0
    );
    const excellentStudents = studentReports.filter(
      (report) => report.averageScore >= 90
    ).length;

    return {
      totalStudents: studentReports.length,
      averageScore: Math.round(avgScore),
      totalAttempts,
      excellentStudents,
    };
  };

  const stats = calculateOverallStats();

  if (studentReports.length === 0) {
    return (
      <MainLayout navItems={navItems} userName={user?.name} userRole={user?.role}>
        <PageHeader
          title="Student Reports"
          description="Track student performance across all your exams"
        />
        <Card>
          <CardBody>
            <EmptyState
              icon={FileText}
              title="No student data available"
              description="Student reports will appear here once students start taking your exams"
            />
          </CardBody>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout navItems={navItems} userName={user?.name} userRole={user?.role}>
      <PageHeader
        title="Student Reports"
        description="Comprehensive view of student performance and progress"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600 mb-1">
                  Total Students
                </p>
                <p className="text-3xl font-bold text-secondary-900 mt-2">
                  {stats.totalStudents}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600 mb-1">
                  Average Score
                </p>
                <p className="text-3xl font-bold text-secondary-900 mt-2">
                  {stats.averageScore}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600 mb-1">
                  Total Attempts
                </p>
                <p className="text-3xl font-bold text-secondary-900 mt-2">
                  {stats.totalAttempts}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600 mb-1">
                  Excellent Students
                </p>
                <p className="text-3xl font-bold text-secondary-900 mt-2">
                  {stats.excellentStudents}
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 w-full sm:w-auto">
              <Input
                type="text"
                placeholder="Search students by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-secondary-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="name">Sort by Name</option>
                <option value="score">Sort by Score</option>
                <option value="attempts">Sort by Attempts</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="space-y-6">
        {filteredReports.map((report) => {
          const performance = getPerformanceBadge(report.averageScore);
          const PerformanceIcon = performance.icon;

          return (
            <Card key={report.student.id}>
              <CardBody>
                <div className="mb-4 pb-4 border-b border-secondary-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-secondary-900">
                          {report.student.name}
                        </h3>
                        <Badge variant={performance.variant}>
                          <PerformanceIcon className="w-3 h-3 mr-1" />
                          {performance.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-secondary-600">
                        {report.student.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary-600">
                        {report.averageScore}%
                      </p>
                      <p className="text-xs text-secondary-500 mt-1">
                        Average Score
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-secondary-50 rounded-lg p-3">
                      <p className="text-xs text-secondary-600 mb-1">
                        Total Attempts
                      </p>
                      <p className="text-lg font-semibold text-secondary-900">
                        {report.totalAttempts}
                      </p>
                    </div>
                    <div className="bg-secondary-50 rounded-lg p-3">
                      <p className="text-xs text-secondary-600 mb-1">
                        Exams Completed
                      </p>
                      <p className="text-lg font-semibold text-secondary-900">
                        {report.completedExams}
                      </p>
                    </div>
                    <div className="bg-secondary-50 rounded-lg p-3">
                      <p className="text-xs text-secondary-600 mb-1">
                        Highest Score
                      </p>
                      <p className="text-lg font-semibold text-success-600">
                        {report.highestScore}%
                      </p>
                    </div>
                    <div className="bg-secondary-50 rounded-lg p-3">
                      <p className="text-xs text-secondary-600 mb-1">
                        Lowest Score
                      </p>
                      <p className="text-lg font-semibold text-error-600">
                        {report.lowestScore}%
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-secondary-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Exam History
                  </h4>
                  <div className="space-y-2">
                    {report.examDetails.map(({ exam, attempt }) => (
                      <div
                        key={attempt.id}
                        className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-secondary-900">
                            {exam.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-secondary-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(attempt.completed_at!)}
                            </span>
                            {attempt.time_taken && (
                              <span className="text-xs text-secondary-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(attempt.time_taken)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm text-secondary-600">
                              {Math.round((attempt.score / 100) * attempt.total_questions)}/{attempt.total_questions}
                            </p>
                            <p className="text-xs text-secondary-500">correct</p>
                          </div>
                          <Badge
                            variant={
                              attempt.score >= 75
                                ? 'success'
                                : attempt.score >= 60
                                ? 'warning'
                                : 'error'
                            }
                          >
                            {attempt.score}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {filteredReports.length === 0 && searchQuery && (
        <Card>
          <CardBody>
            <EmptyState
              icon={Search}
              title="No students found"
              description={`No students match your search for "${searchQuery}"`}
            />
          </CardBody>
        </Card>
      )}
    </MainLayout>
  );
}
