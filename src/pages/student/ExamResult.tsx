import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import Alert from '../../components/ui/Alert';
import { ROUTES } from '../../utils/routes';
import { storageUtils } from '../../utils/storage';

interface ResultDetail {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export default function ExamResult() {
  const { id: attemptId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [examTitle, setExamTitle] = useState('');
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [results, setResults] = useState<ResultDetail[]>([]);

  useEffect(() => {
    loadResults();
  }, [attemptId]);

  const loadResults = () => {
    if (!attemptId) {
      setError('Attempt not found');
      setLoading(false);
      return;
    }

    const attempts = storageUtils.getAttempts();
    const attempt = attempts.find((a) => a.id === attemptId);

    if (!attempt) {
      setError('Attempt not found');
      setLoading(false);
      return;
    }

    const exam = storageUtils.getExam(attempt.exam_id);
    if (!exam) {
      setError('Exam not found');
      setLoading(false);
      return;
    }

    setExamTitle(exam.title);
    setScore(Math.round((attempt.score / 100) * attempt.total_questions));
    setTotal(attempt.total_questions);
    setPercentage(attempt.score);
    setTimeTaken(attempt.time_taken || 0);

    const answers = storageUtils.getAnswers(attemptId);
    const questions = storageUtils.getQuestions(attempt.exam_id);

    const resultDetails: ResultDetail[] = questions.map((q) => {
      const answer = answers.find((a) => a.question_id === q.id);
      const allOptions = storageUtils.getAnswerOptions(q.id);
      const selectedOption = allOptions.find((o) => o.id === answer?.selected_option_id);
      const correctOption = allOptions.find((o) => o.is_correct);

      return {
        question: q.text,
        userAnswer: selectedOption ? `${selectedOption.option_letter}. ${selectedOption.text}` : 'Not answered',
        correctAnswer: correctOption ? `${correctOption.option_letter}. ${correctOption.text}` : 'Unknown',
        isCorrect: answer?.is_correct || false,
      };
    });

    setResults(resultDetails);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Loading text="Loading results..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
          <Button onClick={() => navigate(ROUTES.STUDENT_DASHBOARD)}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardBody className="text-center py-8">
            <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
              percentage >= 70 ? 'bg-green-100' : percentage >= 50 ? 'bg-orange-100' : 'bg-red-100'
            }`}>
              <span className={`text-4xl font-bold ${
                percentage >= 70 ? 'text-green-600' : percentage >= 50 ? 'text-orange-600' : 'text-red-600'
              }`}>
                {percentage}%
              </span>
            </div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">Exam Completed!</h1>
            <h2 className="text-xl text-secondary-700 mb-3">{examTitle}</h2>
            <p className="text-secondary-600 mb-2">
              You scored {score} out of {total} questions correctly
            </p>
            {timeTaken > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm text-secondary-500">
                <Clock className="w-4 h-4" />
                <span>Time taken: {formatTime(timeTaken)}</span>
              </div>
            )}
          </CardBody>
        </Card>

        <h2 className="text-xl font-bold text-secondary-900 mb-4">Question Review</h2>

        <div className="space-y-4">
          {results.map((result, index) => (
            <Card key={index}>
              <CardHeader className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-secondary-600">
                      Question {index + 1}
                    </span>
                    <Badge variant={result.isCorrect ? 'success' : 'error'}>
                      {result.isCorrect ? 'Correct' : 'Incorrect'}
                    </Badge>
                  </div>
                  <p className="text-secondary-900">{result.question}</p>
                </div>
                {result.isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-accent-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                )}
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-secondary-600">Your Answer:</p>
                    <p
                      className={`font-medium ${
                        result.isCorrect ? 'text-accent-600' : 'text-red-600'
                      }`}
                    >
                      {result.userAnswer}
                    </p>
                  </div>
                  {!result.isCorrect && (
                    <div>
                      <p className="text-sm text-secondary-600">Correct Answer:</p>
                      <p className="font-medium text-accent-600">{result.correctAnswer}</p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button onClick={() => navigate(ROUTES.STUDENT_DASHBOARD)}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
