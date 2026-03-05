export function toYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function startOfMonth(year: number, month: number): Date {
  return new Date(year, month - 1, 1);
}

export function endOfMonth(year: number, month: number): Date {
  return new Date(year, month, 0);
}

export function addMonths(d: Date, n: number): Date {
  const out = new Date(d);
  out.setMonth(out.getMonth() + n);
  return out;
}

export function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

export function startOfWeek(d: Date, weekStartsOn: 0 | 1 = 0): Date {
  const out = new Date(d);
  let day = out.getDay();
  if (weekStartsOn === 1) day = day === 0 ? 6 : day - 1;
  out.setDate(out.getDate() - day);
  return out;
}

export function getWeekDays(anchor: Date, weekStartsOn: 0 | 1 = 0): { date: string; isCurrentMonth: boolean }[] {
  const start = startOfWeek(anchor, weekStartsOn);
  const anchorY = anchor.getFullYear();
  const anchorM = anchor.getMonth() + 1;
  const days: { date: string; isCurrentMonth: boolean }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(start, i);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    days.push({
      date: toYMD(d),
      isCurrentMonth: y === anchorY && m === anchorM,
    });
  }
  return days;
}

export function getCalendarDays(year: number, month: number, weekStartsOn: 0 | 1 = 0): { date: string; isCurrentMonth: boolean }[] {
  const first = startOfMonth(year, month);
  const start = new Date(first);
  let dayOfWeek = start.getDay();
  if (weekStartsOn === 1) dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  start.setDate(start.getDate() - dayOfWeek);
  const days: { date: string; isCurrentMonth: boolean }[] = [];
  const currentMonth = month;
  const currentYear = year;
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    days.push({
      date: toYMD(d),
      isCurrentMonth: y === currentYear && m === currentMonth,
    });
  }
  return days;
}
