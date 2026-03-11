import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchHolidays } from '../api/holidays';
import type { Holiday } from '../types/holiday';

export function useHolidays(years: number[], countryCode: string = 'UA') {
  const { data = [], isLoading, error } = useQuery<Holiday[]>({
    queryKey: ['holidays', years, countryCode],
    queryFn: async () => {
      const lists = await Promise.all(
        years.map((year) => fetchHolidays(year, countryCode))
      );
      return lists.flat();
    },
    enabled: years.length > 0,
    staleTime: 1000 * 60 * 60,
  });

  const byDate = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const h of data) {
      if (!map[h.date]) map[h.date] = [];
      map[h.date].push(h.name);
    }
    return map;
  }, [data]);

  return { holidaysByDate: byDate, loading: isLoading, error: error ? (error as Error).message : null };
}
