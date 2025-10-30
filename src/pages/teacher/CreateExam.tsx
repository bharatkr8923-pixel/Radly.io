import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Plus, FileText, BarChart3, Trash2, ClipboardList } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import PageHeader from '../../components/layout/PageHeader';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { ROUTES } from '../../utils/routes';
import { useAuthStore } from '../../store/authStore';
import { storageUtils } from '../../utils/storage';

const navItems = [
  { to: ROUTES.TEACHER_DASHBOARD, icon: Home, label: 'Dashboard' },
  { to: ROUTES.TEACHER_CREATE_EXAM, icon: Plus, label: 'Create Exam' },
  { to: ROUTES.TEACHER_EXAMS, icon: FileText, label: 'My Exams' },
  { to: '/teacher/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/teacher/reports', icon: ClipboardList, label: 'Student Reports' },
];

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export default function CreateExam() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', text: '', options: ['', '', '', ''], correctAnswer: 0 },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now().toString(), text: '', options: ['', '', '', ''], correctAnswer: 0 },
    ]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = useAuthStore.getState().user;
      if (!user) return;

      const examId = Date.now().toString();
      const exam = {
        id: examId,
        title,
        description,
        created_by: user.id,
        questions_count: questions.length,
        created_at: new Date().toISOString(),
      };

      storageUtils.saveExam(exam);

      const examQuestions = questions.map((q, index) => {
        const questionId = `${examId}-q${index}`;
        return {
          id: questionId,
          exam_id: examId,
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
        navigate(ROUTES.TEACHER_DASHBOARD);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout navItems={navItems} userName={user?.name} userRole={user?.role}>
      <PageHeader title="Create New Exam" description="Design your examination with multiple-choice questions" />

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

          <Button type="button" variant="ghost" onClick={() => navigate(ROUTES.TEACHER_DASHBOARD)}>
            Cancel
          </Button>

          <Button type="submit" isLoading={isLoading}>
            Save Exam
          </Button>
        </div>
      </form>
    </MainLayout>
  );
}
