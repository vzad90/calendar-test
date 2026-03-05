import styled from '@emotion/styled';
import type { Task } from '../../types/task';
import type { CalendarDay } from '../../types/calendar';
import { theme } from '../../theme';

const Cell = styled.div<{ isCurrentMonth: boolean }>`
  background: ${(p) => (p.isCurrentMonth ? theme.grid.cellBg : theme.grid.cellOtherMonth)};
  border: 1px solid ${theme.grid.border};
  border-radius: 4px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  @media (max-width: ${theme.breakpoints.sm}px) {
    padding: 4px;
    border-radius: 3px;
  }
  @media (max-width: ${theme.breakpoints.xs}px) {
    padding: 2px;
  }
`;

const CellHead = styled.div<{ isCurrentMonth: boolean }>`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 2px;
  margin-bottom: 2px;
  flex-shrink: 0;
  min-height: 18px;
  @media (max-width: ${theme.breakpoints.xs}px) {
    min-height: 16px;
    margin-bottom: 1px;
  }
`;

const DayLabel = styled.span<{ isCurrentMonth: boolean }>`
  font-size: 13px;
  color: ${(p) => (p.isCurrentMonth ? '#333' : '#999')};
  font-weight: 500;
  @media (max-width: ${theme.breakpoints.sm}px) {
    font-size: 11px;
  }
  @media (max-width: ${theme.breakpoints.xs}px) {
    font-size: 10px;
  }
`;

const CardCount = styled.span`
  font-size: 11px;
  color: #888;
  white-space: nowrap;
  @media (max-width: ${theme.breakpoints.sm}px) {
    font-size: 10px;
  }
  @media (max-width: ${theme.breakpoints.xs}px) {
    font-size: 9px;
  }
`;

const HolidayList = styled.div`
  flex-shrink: 0;
  margin-bottom: 4px;
  @media (max-width: ${theme.breakpoints.xs}px) {
    margin-bottom: 2px;
  }
`;

const HolidayName = styled.div`
  font-size: 10px;
  color: #666;
  line-height: 1.3;
  padding: 1px 0;
  @media (max-width: ${theme.breakpoints.xs}px) {
    font-size: 9px;
  }
`;

const TaskList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  overflow: auto;
  min-height: 0;
`;

const TaskCard = styled.li`
  background: ${theme.card.bg};
  border-radius: 3px;
  box-shadow: ${theme.card.shadow};
  margin-bottom: 4px;
  overflow: hidden;
  &:last-of-type {
    margin-bottom: 0;
  }
  @media (max-width: ${theme.breakpoints.xs}px) {
    margin-bottom: 2px;
  }
`;

const CardLabelBar = styled.div<{ color: string }>`
  height: 3px;
  background: ${(p) => p.color};
  flex-shrink: 0;
  @media (max-width: ${theme.breakpoints.xs}px) {
    height: 2px;
  }
`;

const CardTitle = styled.div`
  padding: 6px 8px;
  font-size: 12px;
  line-height: 1.35;
  color: #333;
  word-break: break-word;
  @media (max-width: ${theme.breakpoints.sm}px) {
    font-size: 11px;
    padding: 4px 6px;
  }
  @media (max-width: ${theme.breakpoints.xs}px) {
    font-size: 10px;
    padding: 3px 4px;
    line-height: 1.3;
  }
`;

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDayLabel(dateStr: string, isCurrentMonth: boolean): string {
  const day = Number(dateStr.slice(8, 10));
  if (isCurrentMonth) return String(day);
  const monthIndex = Number(dateStr.slice(5, 7)) - 1;
  return `${MONTH_SHORT[monthIndex]} ${day}`;
}

function cardColor(taskId: number): string {
  const colors = theme.card.labelColors;
  return colors[taskId % colors.length];
}

type DayCellProps = {
  day: CalendarDay;
  tasks: Task[];
  holidays: string[];
};

export function DayCell({ day, tasks, holidays }: DayCellProps) {
  const dayLabel = formatDayLabel(day.date, day.isCurrentMonth);
  return (
    <Cell isCurrentMonth={day.isCurrentMonth}>
      <CellHead isCurrentMonth={day.isCurrentMonth}>
        <DayLabel isCurrentMonth={day.isCurrentMonth}>{dayLabel}</DayLabel>
        {tasks.length > 0 && (
          <CardCount>{tasks.length} card{tasks.length !== 1 ? 's' : ''}</CardCount>
        )}
      </CellHead>
      {holidays.length > 0 && (
        <HolidayList>
          {holidays.map((name) => (
            <HolidayName key={name}>{name}</HolidayName>
          ))}
        </HolidayList>
      )}
      <TaskList>
        {tasks.map((t) => (
          <TaskCard key={t.id}>
            <CardLabelBar color={cardColor(t.id)} />
            <CardTitle>{t.title}</CardTitle>
          </TaskCard>
        ))}
      </TaskList>
    </Cell>
  );
}
