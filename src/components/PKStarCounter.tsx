
import { Star } from 'lucide-react';

interface PKStarCounterProps {
  pkStars: number;
}

const PKStarCounter = ({ pkStars }: PKStarCounterProps) => {
  return (
    <div className="flex items-center space-x-1 bg-yellow-50 p-2 rounded-full px-4">
      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      <span className="font-medium">{pkStars}</span>
    </div>
  );
};

export default PKStarCounter;
