# Exam Management System (Radily.io)

A comprehensive online examination platform built with React, TypeScript, and browser local storage. This application enables teachers to create and manage exams while students can take tests and track their performance.

## Features

### For Teachers
- Create and manage multiple-choice exams with up to 4 options per question
- Edit existing exams and questions
- View analytics and performance metrics across all exams
- Monitor student progress and exam results in real-time
- Generate detailed student reports with performance breakdowns
- Dashboard with quick access to exam statistics

### For Students
- Browse and take available exams created by teachers
- View instant exam results with automatic grading
- Track exam history and performance trends over time
- View detailed answer breakdowns showing correct/incorrect responses
- Dashboard showing recent activity and available exams

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand with persist middleware
- **Data Storage**: Browser LocalStorage (no backend required)
- **Build Tool**: Vite
- **Icons**: Lucide React

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Modern web browser with localStorage support

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
src/
├── components/
│   ├── layout/         # Layout components (Sidebar, TopNavigation, MainLayout, etc.)
│   ├── ui/             # Reusable UI components (Button, Card, Modal, Input, etc.)
│   └── ProtectedRoute.tsx
├── pages/
│   ├── auth/           # Authentication pages (Login, Register)
│   ├── teacher/        # Teacher-specific pages (Dashboard, CreateExam, ManageExams, etc.)
│   └── student/        # Student-specific pages (Dashboard, TakeExam, ExamResult, etc.)
├── store/
│   └── authStore.ts    # Zustand authentication store with persistence
├── types/
│   └── index.ts        # TypeScript type definitions
├── utils/
│   ├── cn.ts           # Class name utility
│   ├── date.ts         # Date formatting utilities
│   ├── routes.ts       # Route constants
│   ├── score.ts        # Score calculation utilities
│   ├── storage.ts      # Local storage utilities for data persistence
│   └── validation.ts   # Form validation utilities
├── App.tsx             # Main application component with routing
└── main.tsx            # Application entry point
```

## Data Storage

The application uses browser LocalStorage to persist all data. No backend server or database is required. Data is stored in the following structure:

### Storage Keys:
- **exam-system-users** - User accounts (teachers and students)
- **exams** - Exam definitions with metadata
- **questions** - Exam questions with text and position
- **answer_options** - Multiple choice options with correct answer flags
- **attempts** - Student exam submissions with scores
- **answers** - Individual student answers for each question
- **auth-storage** - Current authentication state (Zustand persist)

### Data Models:
- **User**: id, name, email, password, role (teacher/student), created_at
- **Exam**: id, title, description, created_by, questions_count, created_at
- **Question**: id, exam_id, text, position, answer_options
- **AnswerOption**: id, question_id, text, is_correct, option_letter (A-D)
- **ExamAttempt**: id, exam_id, student_id, score, total_questions, started_at, completed_at, time_taken
- **StudentAnswer**: id, attempt_id, question_id, selected_option_id, is_correct

## Authentication

The application uses a custom authentication system built with Zustand and localStorage:

- Email/password based authentication
- Role-based access control (teacher or student)
- Persistent sessions using Zustand persist middleware
- Protected routes that redirect based on user role
- Automatic login state restoration on page reload

### User Roles:
- **Teacher**: Can create exams, view analytics, and see all student results
- **Student**: Can take exams and view their own results

## Security & Data Isolation

- Teachers can only access and edit exams they created
- Students can only view their own exam attempts and results
- Protected routes prevent unauthorized access to role-specific pages
- Password storage in localStorage (Note: suitable for demo purposes only)

## Key Features Explained

### Exam Creation
Teachers can create exams with:
- Title and description fields
- Multiple-choice questions with 4 answer options
- Radio button selection for correct answer
- Dynamic question addition/removal
- Question ordering and positioning

### Exam Taking
Students can:
- View list of all available exams
- Take exams with progress tracking
- Select one answer per question
- Navigate between questions (previous/next)
- Submit exams for instant automatic grading
- View detailed results with correct/incorrect answers highlighted

### Analytics Dashboard
Teachers get insights into:
- Total number of exams created
- Total students who have taken exams
- Average scores across all exams
- Recent exam attempts with student names and scores
- Performance trends and completion rates

### Student Reports
Teachers can view:
- Individual student performance on each exam
- Score breakdowns and percentages
- Time taken for each attempt
- Question-by-question answer analysis

## Getting Started Guide

### For Teachers:
1. Register with "Teacher" role selected
2. Create your first exam from the dashboard
3. Add questions with multiple choice options
4. Mark the correct answer for each question
5. Save the exam and view it in "My Exams"
6. Monitor student results from the Analytics page

### For Students:
1. Register with "Student" role selected
2. Browse available exams from the dashboard
3. Click "Take Exam" to start
4. Answer all questions and submit
5. View instant results with score and feedback
6. Check "My Results" to see exam history

## Browser Compatibility

The application requires a modern browser with support for:
- ES6+ JavaScript features
- LocalStorage API
- CSS Grid and Flexbox

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Data Persistence Notes

All data is stored locally in the browser's localStorage. This means:
- Data persists across page reloads and browser sessions
- Data is specific to each browser and device
- Clearing browser data will delete all exams and results
- No synchronization between different browsers or devices
- Suitable for single-user demo and testing purposes

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue in the repository.
