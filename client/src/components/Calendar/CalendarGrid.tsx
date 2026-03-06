import {
  GridWrap,
  WeekdayRow,
  WeekdayCell,
  DaysGrid,
} from './styled';
import { DayCell } from './DayCell';
import type { Task } from '../../types/task';
import type { CalendarDay } from '../../types/calendar';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type CalendarGridProps = {
  days: CalendarDay[];
  tasks: Task[];
  holidaysByDate: Record<string, string[]>;
  onCreate: (title: string, date: string) => Promise<unknown>;
  onUpdate: (id: number, data: { title?: string; date?: string; order?: number }) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
};

function tasksByDate(tasks: Task[]): Record<string, Task[]> {
  const map: Record<string, Task[]> = {};
  for (const t of tasks) {
    if (!map[t.date]) map[t.date] = [];
    map[t.date].push(t);
  }
  for (const key of Object.keys(map)) {
    map[key].sort((a, b) => a.order - b.order);
  }
  return map;
}

export function CalendarGrid({ days, tasks, holidaysByDate, onCreate, onUpdate, onDelete }: CalendarGridProps) {
  const byDate = tasksByDate(tasks);
  return (
    <GridWrap>
      <WeekdayRow>
        {WEEKDAYS.map((w) => (
          <WeekdayCell key={w}>{w}</WeekdayCell>
        ))}
      </WeekdayRow>
      <DaysGrid>
        {days.map((day) => (
          <DayCell
            key={day.date}
            day={day}
            tasks={byDate[day.date] ?? []}
            holidays={holidaysByDate[day.date] ?? []}
            onCreate={onCreate}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </DaysGrid>
    </GridWrap>
  );
}
