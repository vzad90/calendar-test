import { useState, useEffect, useCallback } from 'react';
import { fetchHolidays } from '../api/holidays';
import type { Holiday } from '../types/holiday';

const cache = new Map<string, Holiday[]>();

function cacheKey(year: number, country: string): string {
  return `${year}-${country}`;
}

export function useHolidays(years: number[], countryCode: string = 'UA') {
  const [byDate, setByDate] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (years.length === 0) {
      setByDate({});
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const all: Holiday[] = [];
      for (const year of years) {
        const key = cacheKey(year, countryCode);
        if (cache.has(key)) {
          all.push(...(cache.get(key) ?? []));
        } else {
          const list = await fetchHolidays(year, countryCode);
          cache.set(key, list);
          all.push(...list);
        }
      }
      const map: Record<string, string[]> = {};
      for (const h of all) {
        if (!map[h.date]) map[h.date] = [];
        map[h.date].push(h.name);
      }
      setByDate(map);
    } catch (e) {
      setError((e as Error).message);
      setByDate({});
    } finally {
      setLoading(false);
    }
  }, [years.join(','), countryCode]);

  useEffect(() => {
    load();
  }, [load]);

  return { holidaysByDate: byDate, loading, error };
}
