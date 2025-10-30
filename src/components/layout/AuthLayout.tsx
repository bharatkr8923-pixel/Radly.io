import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-primary-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-slide-down">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-primary rounded-3xl mb-4 shadow-2xl hover:scale-110 transition-transform duration-300">
            <span className="text-white font-bold text-4xl">R</span>
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-primary font-heading">Radly.io</h1>
          <p className="text-secondary-600 mt-2 font-medium">Online Examination System</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 hover:shadow-3xl transition-all duration-300">
          {children}
        </div>
      </div>
    </div>
  );
}
