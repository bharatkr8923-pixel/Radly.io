import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-secondary-900 font-heading">{title}</h1>
        {action && <div>{action}</div>}
      </div>
      {description && <p className="text-secondary-600">{description}</p>}
    </div>
  );
}
