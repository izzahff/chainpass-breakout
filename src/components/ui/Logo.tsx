import React from 'react';
import { Link } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'w-10 h-10' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-primary rotate-12 rounded-sm"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Link 
          size={24} 
          strokeWidth={3} 
          color="#000" 
          className="transform -rotate-12" 
        />
      </div>
    </div>
  );
};

export default Logo;