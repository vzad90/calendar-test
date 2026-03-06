import { useState, useMemo } from 'react';
import { useCalendarDays } from '../../hooks/useCalendarDays';
import { useTasks } from '../../hooks/useTasks';
import { useHolidays } from '../../hooks/useHolidays';
import { addMonths, addDays, toYMD, getWeekDays } from '../../utils/date';
import {
  CalendarWrap,
  NavBar,
  NavLeft,
  NavRight,
  NavArrow,
  MonthTitle,
  NavSearchWrap,
  NavSearchInput,
  ViewToggle,
  ViewToggleButton,
  ErrorBanner,
  LoadingWrap,
} from './styled';
import { CalendarGrid } from './CalendarGrid';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatWeekTitle(from: string, to: string): string {
  const [y1, m1, d1] = from.split('-').map(Number);
  const [y2, m2, d2] = to.split('-').map(Number);
  if (y1 === y2 && m1 === m2) {
    return `${d1} – ${d2} ${MONTH_SHORT[m2 - 1]} ${y2}`;
  }
  return `${d1} ${MONTH_SHORT[m1 - 1]} – ${d2} ${MONTH_SHORT[m2 - 1]} ${y2}`;
}

function filterTasksBySearch<T extends { title: string }>(items: T[], searchQuery: string): T[] {
  const q = searchQuery.trim().toLowerCase();
  if (!q) return items;
  return items.filter((t) => t.title.toLowerCase().includes(q));
}

export function Calendar() {
  const [current, setCurrent] = useState(() => new Date());
  const [view, setView] = useState<'week' | 'month'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const year = current.getFullYear();
  const month = current.getMonth() + 1;
  const monthDays = useCalendarDays(year, month, 0);
  const weekDays = useMemo(() => getWeekDays(current, 0), [current]);
  const range = useMemo(() => {
    if (view === 'month') {
      if (monthDays.length === 0) return { from: toYMD(current), to: toYMD(current) };
      return { from: monthDays[0].date, to: monthDays[monthDays.length - 1].date };
    }
    return { from: weekDays[0].date, to: weekDays[6].date };
  }, [view, monthDays, weekDays, current]);
  const years = useMemo(() => {
    const y1 = parseInt(range.from.slice(0, 4), 10);
    const y2 = parseInt(range.to.slice(0, 4), 10);
    return y1 === y2 ? [y1] : [y1, y2].sort((a, b) => a - b);
  }, [range.from, range.to]);
  const { tasks, loading, error, create, update, remove } = useTasks(range.from, range.to);
  const filteredTasks = useMemo(() => filterTasksBySearch(tasks, searchQuery), [tasks, searchQuery]);
  const { holidaysByDate } = useHolidays(years);

  const goPrev = () =>
    setCurrent((d) => (view === 'month' ? addMonths(d, -1) : addDays(d, -7)));
  const goNext = () =>
    setCurrent((d) => (view === 'month' ? addMonths(d, 1) : addDays(d, 7)));

  const navLabel = view === 'month' ? 'month' : 'week';
  const title =
    view === 'month'
      ? `${MONTH_NAMES[month - 1]} ${year}`
      : formatWeekTitle(weekDays[0].date, weekDays[6].date);

  return (
    <CalendarWrap>
      <NavBar>
        <NavLeft>
          <NavArrow type="button" onClick={goPrev} aria-label={`Previous ${navLabel}`}>
            ‹
          </NavArrow>
          <NavArrow type="button" onClick={goNext} aria-label={`Next ${navLabel}`}>
            ›
          </NavArrow>
        </NavLeft>
        <MonthTitle>{title}</MonthTitle>
        <NavRight>
          <NavSearchWrap>
            <NavSearchInput
              type="search"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search tasks by title"
            />
          </NavSearchWrap>
          <ViewToggle>
            <ViewToggleButton
              type="button"
              active={view === 'week'}
              onClick={() => setView('week')}
            >
              Week
            </ViewToggleButton>
            <ViewToggleButton
              type="button"
              active={view === 'month'}
              onClick={() => setView('month')}
            >
              Month
            </ViewToggleButton>
          </ViewToggle>
        </NavRight>
      </NavBar>
      {error && <ErrorBanner>{error}</ErrorBanner>}
      {loading ? (
        <LoadingWrap>Loading…</LoadingWrap>
      ) : view === 'month' ? (
        <CalendarGrid
          days={monthDays}
          tasks={filteredTasks}
          holidaysByDate={holidaysByDate}
          onCreate={create}
          onUpdate={update}
          onDelete={remove}
        />
      ) : (
        <CalendarGrid
          days={weekDays}
          tasks={filteredTasks}
          holidaysByDate={holidaysByDate}
          onCreate={create}
          onUpdate={update}
          onDelete={remove}
        />
      )}
    </CalendarWrap>
  );
}
