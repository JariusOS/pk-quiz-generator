
import { Star } from 'lucide-react';

interface PKStarCounterProps {
  pkStars: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const PKStarCounter = ({ pkStars, size = 'md' }: PKStarCounterProps) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'lg': return 'h-6 w-6';
      case 'xl': return 'h-8 w-8';
      default: return 'h-5 w-5';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-lg';
      case 'xl': return 'text-xl font-bold';
      default: return 'text-base';
    }
  };

  const getContainerSize = () => {
    switch (size) {
      case 'sm': return 'p-1 px-3';
      case 'lg': return 'p-2 px-5';
      case 'xl': return 'p-3 px-6';
      default: return 'p-2 px-4';
    }
  };

  return (
    <div className={`flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-950/40 ${getContainerSize()} rounded-full border border-yellow-200 dark:border-yellow-900/50`}>
      <Star className={`${getSize()} fill-yellow-400 text-yellow-400`} />
      <span className={`font-medium text-yellow-700 dark:text-yellow-400 ${getTextSize()}`}>{pkStars}</span>
    </div>
  );
};

export default PKStarCounter;
