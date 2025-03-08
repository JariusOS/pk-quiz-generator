
import { PKData } from '@/types/pkData';

/**
 * Fetches public knowledge data from LearnPool API
 */
export const fetchPKData = async (): Promise<PKData[]> => {
  try {
    const response = await fetch('https://api.learnpool.fun/api/v1/public-knowledge/all');
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data from LearnPool API:', error);
    throw error;
  }
};
