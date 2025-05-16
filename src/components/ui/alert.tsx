import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  className,
}) => {
  const icons = {
    info: <Info className="text-primary" />,
    success: <CheckCircle className="text-success" />,
    warning: <AlertCircle className="text-warning" />,
    error: <XCircle className="text-error" />,
  };

  const styles = {
    info: 'bg-primary/10 border-primary/20',
    success: 'bg-success/10 border-success/20',
    warning: 'bg-warning/10 border-warning/20',
    error: 'bg-error/10 border-error/20',
  };

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        styles[type],
        className
      )}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {icons[type]}
        </div>
        <div>
          {title && (
            <h4 className="font-medium mb-1">{title}</h4>
          )}
          <div className="text-white/70">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Alert;