import { User } from '../mapper';

export const sort = (input: User[], sortType: string = 'desc'): User[] => {
  const sorted = input.sort((a, b) => {
    if (a.score) {
      if (sortType === 'desc') return b.score - a.score;
      return a.score - b.score;
    } else {
      if (sortType === 'desc') return b.scoreinc - a.scoreinc;
      return a.scoreinc - b.scoreinc;
    }
  });
  return sorted;
};
