# Exam Management System

A comprehensive online examination platform built with React, TypeScript, and Supabase. This application enables teachers to create and manage exams while students can take tests and track their performance.

## Features

### For Teachers
- Create and manage multiple-choice exams with up to 4 options per question
- Edit existing exams and questions
- View analytics and performance metrics
- Monitor student progress and exam results
- Generate detailed student reports
- Dashboard with quick access to exam statistics

### For Students
- Browse and take available exams
- View real-time exam results
- Track exam history and performance trends
- View detailed answer breakdowns
- Dashboard showing recent activity

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Build Tool**: Vite
- **Icons**: Lucide React

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

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

4. Start the development server:
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
│   ├── layout/         # Layout components (Sidebar, TopNavigation, etc.)
│   ├── ui/             # Reusable UI components (Button, Card, Modal, etc.)
│   └── ProtectedRoute.tsx
├── pages/
│   ├── auth/           # Authentication pages (Login, Register)
│   ├── teacher/        # Teacher-specific pages
│   └── student/        # Student-specific pages
├── store/
│   └── authStore.ts    # Zustand authentication store
├── types/
│   └── index.ts        # TypeScript type definitions
├── utils/
│   ├── cn.ts           # Class name utility
│   ├── date.ts         # Date formatting utilities
│   ├── routes.ts       # Route constants
│   ├── score.ts        # Score calculation utilities
│   ├── storage.ts      # Local storage utilities
│   └── validation.ts   # Form validation utilities
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## Database Schema

The application uses the following main tables in Supabase:

- **users** - User accounts (teachers and students)
- **exams** - Exam definitions
- **questions** - Exam questions
- **answer_options** - Multiple choice options
- **exam_attempts** - Student exam submissions
- **student_answers** - Individual question responses

## Authentication

The application uses Supabase Authentication with email/password authentication. Users are automatically assigned roles (teacher or student) during registration.

## Security

- Row Level Security (RLS) policies ensure data isolation
- Teachers can only access their own exams and student results
- Students can only view available exams and their own results
- Protected routes prevent unauthorized access

## Key Features Explained

### Exam Creation
Teachers can create exams with:
- Title and description
- Multiple-choice questions (up to 4 options)
- Correct answer selection
- Question ordering

### Exam Taking
Students can:
- Select one answer per question
- Navigate between questions
- Submit exams for instant grading
- View detailed results with correct answers

### Analytics
Teachers get insights into:
- Average exam scores
- Student performance trends
- Question difficulty analysis
- Completion rates

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
