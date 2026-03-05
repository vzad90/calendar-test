import type { Holiday } from '../types/holiday';

const BASE = 'https://date.nager.at/api/v3';

type NagerHoliday = {
  date: string;
  name: string;
};

export async function fetchHolidays(year: number, countryCode: string): Promise<Holiday[]> {
  const res = await fetch(`${BASE}/PublicHolidays/${year}/${countryCode}`);
  if (!res.ok) throw new Error('Failed to fetch holidays');
  const data = (await res.json()) as NagerHoliday[];
  return data.map((h) => ({ date: h.date, name: h.name }));
}
