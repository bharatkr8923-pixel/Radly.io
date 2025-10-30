import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardBody, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import Alert from '../../components/ui/Alert';
import { ROUTES, getStudentExamResultRoute } from '../../utils/routes';
import { useAuthStore } from '../../store/authStore';
import { storageUtils } from '../../utils/storage';
import type { Question, AnswerOption } from '../../types';

interface QuestionWithOptions extends Question {
  options: AnswerOption[];
}

export default function TakeExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<QuestionWithOptions[]>([]);
  const [examTitle, setExamTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startTime] = useState(Date.now());

  useEffect(() => {
    loadExam();
  }, [id]);

  const loadExam = () => {
    if (!id) {
      setError('Exam not found');
      setLoading(false);
      return;
    }

    const exam = storageUtils.getExam(id);
    if (!exam) {
      setError('Exam not found');
      setLoading(false);
      return;
    }

    setExamTitle(exam.title);

    const examQuestions = storageUtils.getQuestions(id);
    const questionsWithOptions: QuestionWithOptions[] = examQuestions
      .sort((a, b) => a.position - b.position)
      .map((q) => {
        const options = storageUtils.getAnswerOptions(q.id)
          .sort((a, b) => a.option_letter.localeCompare(b.option_letter));
        return { ...q, options };
      });

    setQuestions(questionsWithOptions);
    setLoading(false);
  };

  const totalQuestions = questions.length;
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (!user?.id || !id) return;

    setIsSubmitting(true);

    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000);

    let correctCount = 0;
    const studentAnswers = questions.map((q) => {
      const selectedOptionId = selectedAnswers[q.id];
      const selectedOption = q.options.find((o) => o.id === selectedOptionId);
      const isCorrect = selectedOption?.is_correct || false;

      if (isCorrect) correctCount++;

      return {
        question_id: q.id,
        selected_option_id: selectedOptionId || '',
        is_correct: isCorrect,
      };
    });

    const score = Math.round((correctCount / totalQuestions) * 100);

    const attemptId = `${id}-${user.id}-${Date.now()}`;
    const attempt = {
      id: attemptId,
      exam_id: id,
      student_id: user.id,
      score,
      total_questions: totalQuestions,
      started_at: new Date(startTime).toISOString(),
      completed_at: new Date(endTime).toISOString(),
      time_taken: timeTaken,
    };

    storageUtils.saveAttempt(attempt);

    studentAnswers.forEach((answer, index) => {
      storageUtils.saveAnswer({
        id: `${attemptId}-ans${index}`,
        attempt_id: attemptId,
        ...answer,
      });
    });

    setTimeout(() => {
      navigate(getStudentExamResultRoute(attemptId));
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Loading text="Loading exam..." />
        </div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen bg-secondary-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Alert variant="error" className="mb-4">
            {error || 'No questions found for this exam'}
          </Alert>
          <Button onClick={() => navigate(ROUTES.STUDENT_DASHBOARD)}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">{examTitle}</h1>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-secondary-600 mt-2">
            Question {currentQuestion + 1} of {totalQuestions}
          </p>
        </div>

        <Card>
          <CardBody className="space-y-6">
            <h2 className="text-lg font-semibold text-secondary-900">{currentQ.text}</h2>

            <div className="space-y-3">
              {currentQ.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() =>
                    setSelectedAnswers({ ...selectedAnswers, [currentQ.id]: option.id })
                  }
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    selectedAnswers[currentQ.id] === option.id
                      ? 'border-primary bg-primary-50'
                      : 'border-secondary-300 hover:border-secondary-400'
                  }`}
                >
                  <span className="font-medium text-secondary-900">
                    {option.option_letter}.
                  </span>{' '}
                  {option.text}
                </button>
              ))}
            </div>
          </CardBody>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentQuestion < totalQuestions - 1 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} isLoading={isSubmitting}>
                Submit Exam
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="mt-4 text-center">
          <Button variant="ghost" onClick={() => navigate(ROUTES.STUDENT_DASHBOARD)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
