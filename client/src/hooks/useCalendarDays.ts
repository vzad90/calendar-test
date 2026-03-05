import { useMemo } from 'react';
import { getCalendarDays } from '../utils/date';

export function useCalendarDays(year: number, month: number, weekStartsOn: 0 | 1 = 0) {
  return useMemo(() => getCalendarDays(year, month, weekStartsOn), [year, month, weekStartsOn]);
}
