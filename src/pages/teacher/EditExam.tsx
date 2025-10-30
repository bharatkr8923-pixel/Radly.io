import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Home, Plus, FileText, BarChart3, Trash2, ArrowLeft, ClipboardList } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import PageHeader from '../../components/layout/PageHeader';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';
import { ROUTES } from '../../utils/routes';
import { useAuthStore } from '../../store/authStore';
import { storageUtils } from '../../utils/storage';
import type { Exam, Question } from '../../types';

const navItems = [
  { to: ROUTES.TEACHER_DASHBOARD, icon: Home, label: 'Dashboard' },
  { to: ROUTES.TEACHER_CREATE_EXAM, icon: Plus, label: 'Create Exam' },
  { to: ROUTES.TEACHER_EXAMS, icon: FileText, label: 'My Exams' },
  { to: '/teacher/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/teacher/reports', icon: ClipboardList, label: 'Student Reports' },
];

interface QuestionForm {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export default function EditExam() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [examNotFound, setExamNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setExamNotFound(true);
      return;
    }

    const exam = storageUtils.getExamById(id);
    if (!exam) {
      setExamNotFound(true);
      return;
    }

    if (exam.created_by !== user?.id) {
      setError('You do not have permission to edit this exam');
      return;
    }

    setTitle(exam.title);
    setDescription(exam.description || '');

    const examQuestions = storageUtils.getQuestions(id);
    const formattedQuestions: QuestionForm[] = examQuestions.map((q) => ({
      id: q.id,
      text: q.text,
      options: q.answer_options
        .sort((a, b) => a.option_letter.localeCompare(b.option_letter))
        .map((opt) => opt.text),
      correctAnswer: q.answer_options.findIndex((opt) => opt.is_correct),
    }));

    setQuestions(formattedQuestions.length > 0 ? formattedQuestions : [
      { id: '1', text: '', options: ['', '', '', ''], correctAnswer: 0 },
    ]);
  }, [id, user]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now().toString(), text: '', options: ['', '', '', ''], correctAnswer: 0 },
    ]);
  };

  const removeQuestion = (questionId: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== questionId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const exam: Exam = {
        id,
        title,
        description,
        created_by: user!.id,
        questions_count: questions.length,
        created_at: storageUtils.getExamById(id)?.created_at || new Date().toISOString(),
      };

      storageUtils.saveExam(exam);

      const examQuestions: Question[] = questions.map((q, index) => {
        const questionId = q.id.startsWith(id) ? q.id : `${id}-q${index}`;
        return {
          id: questionId,
          exam_id: id,
          text: q.text,
          position: index,
          answer_options: q.options.map((optText, optIndex) => ({
            id: `${questionId}-opt${optIndex}`,
            question_id: questionId,
            text: optText,
            is_correct: q.correctAnswer === optIndex,
            option_letter: String.fromCharCode(65 + optIndex) as 'A' | 'B' | 'C' | 'D',
          })),
        };
      });

      storageUtils.saveQuestions(examQuestions);

      const allOptions = examQuestions.flatMap((q) => q.answer_options);
      storageUtils.saveAnswerOptions(allOptions);

      setTimeout(() => {
        navigate(ROUTES.TEACHER_EXAMS);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to update exam. Please try again.');
      setIsLoading(false);
    }
  };

  if (examNotFound) {
    return (
      <MainLayout navItems={navItems} userName={user?.name} userRole={user?.role}>
        <PageHeader title="Exam Not Found" />
        <Card>
          <CardBody>
            <Alert variant="error" title="Exam not found">
              The exam you're trying to edit does not exist.
            </Alert>
            <div className="mt-4">
              <Button onClick={() => navigate(ROUTES.TEACHER_EXAMS)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to My Exams
              </Button>
            </div>
          </CardBody>
        </Card>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout navItems={navItems} userName={user?.name} userRole={user?.role}>
        <PageHeader title="Permission Denied" />
        <Card>
          <CardBody>
            <Alert variant="error" title="Access denied">
              {error}
            </Alert>
            <div className="mt-4">
              <Button onClick={() => navigate(ROUTES.TEACHER_DASHBOARD)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </CardBody>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout navItems={navItems} userName={user?.name} userRole={user?.role}>
      <PageHeader
        title="Edit Exam"
        description="Update your examination questions and details"
      />

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <Card className="mb-6">
          <CardBody className="space-y-4">
            <Input
              label="Exam Title"
              placeholder="Enter exam title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <TextArea
              label="Exam Description"
              placeholder="Enter exam description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </CardBody>
        </Card>

        <div className="space-y-6 mb-6">
          {questions.map((question, qIndex) => (
            <Card key={question.id}>
              <CardBody className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-secondary-900">
                    Question {qIndex + 1}
                  </h3>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <TextArea
                  label="Question Text"
                  placeholder="Enter question text"
                  value={question.text}
                  onChange={(e) => {
                    const updated = [...questions];
                    updated[qIndex].text = e.target.value;
                    setQuestions(updated);
                  }}
                  required
                />

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-secondary-700">
                    Answer Options
                  </label>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`correct-${question.id}`}
                        checked={question.correctAnswer === oIndex}
                        onChange={() => {
                          const updated = [...questions];
                          updated[qIndex].correctAnswer = oIndex;
                          setQuestions(updated);
                        }}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <Input
                        placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                        value={option}
                        onChange={(e) => {
                          const updated = [...questions];
                          updated[qIndex].options[oIndex] = e.target.value;
                          setQuestions(updated);
                        }}
                        required
                      />
                    </div>
                  ))}
                  <p className="text-xs text-secondary-500">Select the correct answer</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={addQuestion}>
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>

          <div className="flex-1" />

          <Button type="button" variant="ghost" onClick={() => navigate(ROUTES.TEACHER_EXAMS)}>
            Cancel
          </Button>

          <Button type="submit" isLoading={isLoading}>
            Update Exam
          </Button>
        </div>
      </form>
    </MainLayout>
  );
}
