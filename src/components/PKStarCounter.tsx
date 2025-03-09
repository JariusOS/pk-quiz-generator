
import { Star } from 'lucide-react';

interface PKStarCounterProps {
  pkStars: number;
  size?: 'sm' | 'md' | 'lg';
}

const PKStarCounter = ({ pkStars, size = 'md' }: PKStarCounterProps) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'lg': return 'h-6 w-6';
      default: return 'h-5 w-5';
    }
  };

  return (
    <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-950/40 p-2 rounded-full px-4 border border-yellow-200 dark:border-yellow-900/50">
      <Star className={`${getSize()} fill-yellow-400 text-yellow-400`} />
      <span className="font-medium text-yellow-700 dark:text-yellow-400">{pkStars}</span>
    </div>
  );
};

export default PKStarCounter;
