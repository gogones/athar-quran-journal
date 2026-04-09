import { useEffect, useState } from 'react';
import { getStreak } from '../utils/storage';

export function useStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    getStreak().then(setStreak);
  }, []);

  return { streak, setStreak };
}
