import { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import {
  GridWrap,
  WeekdayRow,
  WeekdayCell,
  DaysGrid,
} from './styled';
import { DayCell } from './DayCell';
import type { Task } from '../../types/task';
import type { CalendarDay } from '../../types/calendar';
import { theme } from '../../theme';

type DropTarget = { date: string; index: number } | null;

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TASK_ID_PREFIX = 'task-';
const DAY_ID_PREFIX = 'day-';
const DAY_END_SUFFIX = '-end';

type CalendarGridProps = {
  days: CalendarDay[];
  tasks: Task[];
  holidaysByDate: Record<string, string[]>;
  onCreate: (title: string, date: string) => Promise<unknown>;
  onUpdate: (id: number, data: { title?: string; date?: string; order?: number }) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
  onRefetch: () => Promise<void>;
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

function collisionDetection(args: Parameters<typeof pointerWithin>[0]) {
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) return pointerCollisions;
  return rectIntersection(args);
}

const overlayLabelColors = theme.card.labelColors;
function overlayCardColor(taskId: number): string {
  return overlayLabelColors[taskId % overlayLabelColors.length];
}

export function CalendarGrid({ days, tasks, holidaysByDate, onCreate, onUpdate, onDelete, onRefetch }: CalendarGridProps) {
  const byDate = useMemo(() => tasksByDate(tasks), [tasks]);
  const [dropTarget, setDropTarget] = useState<DropTarget>(null);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) {
      setDropTarget(null);
      return;
    }
    const activeId = String(active.id);
    const overId = String(over.id);
    if (!activeId.startsWith(TASK_ID_PREFIX)) return;

    const taskId = parseInt(activeId.slice(TASK_ID_PREFIX.length), 10);
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (overId.startsWith(DAY_ID_PREFIX)) {
      const rest = overId.slice(DAY_ID_PREFIX.length);
      const isEndZone = rest.endsWith(DAY_END_SUFFIX);
      const date = isEndZone ? rest.slice(0, -DAY_END_SUFFIX.length) : rest;
      if (date !== task.date) {
        const dayTasks = byDate[date] ?? [];
        setDropTarget({ date, index: dayTasks.length });
      } else {
        setDropTarget(null);
      }
      return;
    }
    if (overId.startsWith(TASK_ID_PREFIX)) {
      const overTaskId = parseInt(overId.slice(TASK_ID_PREFIX.length), 10);
      const overTask = tasks.find((t) => t.id === overTaskId);
      if (!overTask) return;
      if (overTask.date !== task.date) {
        const targetDayTasks = byDate[overTask.date] ?? [];
        const index = targetDayTasks.findIndex((t) => t.id === overTaskId);
        if (index !== -1) setDropTarget({ date: overTask.date, index });
      } else {
        setDropTarget(null);
      }
    }
  };

  const clearDropTarget = () => setDropTarget(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = String(active.id);
    if (id.startsWith(TASK_ID_PREFIX)) {
      setActiveTaskId(parseInt(id.slice(TASK_ID_PREFIX.length), 10));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const targetToUse = dropTarget;
    clearDropTarget();
    setActiveTaskId(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (!activeId.startsWith(TASK_ID_PREFIX)) return;

    const taskId = parseInt(activeId.slice(TASK_ID_PREFIX.length), 10);
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updates: Promise<unknown>[] = [];

    if (overId.startsWith(DAY_ID_PREFIX)) {
      const rest = overId.slice(DAY_ID_PREFIX.length);
      const isEndZone = rest.endsWith(DAY_END_SUFFIX);
      const newDate = isEndZone ? rest.slice(0, -DAY_END_SUFFIX.length) : rest;
      if (newDate !== task.date) {
        const dayTasks = byDate[newDate] ?? [];
        const insertIndex =
          targetToUse?.date === newDate ? targetToUse.index : dayTasks.length;
        updates.push(onUpdate(taskId, { date: newDate, order: insertIndex }));
        dayTasks.forEach((t, i) => {
          if (i >= insertIndex && t.order !== i + 1) {
            updates.push(onUpdate(t.id, { order: i + 1 }));
          }
        });
      }
      if (updates.length > 0) {
        Promise.all(updates).then(() => onRefetch(), () => onRefetch());
      }
      return;
    }

    if (overId.startsWith(TASK_ID_PREFIX)) {
      const overTaskId = parseInt(overId.slice(TASK_ID_PREFIX.length), 10);
      const overTask = tasks.find((t) => t.id === overTaskId);
      if (!overTask) return;

      if (overTask.date === task.date) {
        const dayTasks = byDate[task.date] ?? [];
        const oldIndex = dayTasks.findIndex((t) => t.id === taskId);
        const newIndex = dayTasks.findIndex((t) => t.id === overTaskId);
        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

        const reordered = arrayMove(dayTasks, oldIndex, newIndex);
        reordered.forEach((t, i) => {
          if (t.order !== i) {
            updates.push(onUpdate(t.id, { order: i }));
          }
        });
      } else {
        const targetDayTasks = byDate[overTask.date] ?? [];
        const insertIndex =
          targetToUse?.date === overTask.date
            ? targetToUse.index
            : targetDayTasks.findIndex((t) => t.id === overTaskId);
        if (insertIndex === -1) return;

        updates.push(onUpdate(taskId, { date: overTask.date, order: insertIndex }));
        targetDayTasks.forEach((t, i) => {
          if (i >= insertIndex && t.order !== i + 1) {
            updates.push(onUpdate(t.id, { order: i + 1 }));
          }
        });
      }
      if (updates.length > 0) {
        Promise.all(updates).then(() => onRefetch(), () => onRefetch());
      }
    }
  };

  const activeTask = activeTaskId != null ? tasks.find((t) => t.id === activeTaskId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => { clearDropTarget(); setActiveTaskId(null); }}
    >
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
              dropTarget={dropTarget?.date === day.date ? dropTarget.index : null}
              isDropTargetDay={dropTarget?.date === day.date ? true : false}
              onCreate={onCreate}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </DaysGrid>
      </GridWrap>
      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div
            style={{
              background: theme.card.bg,
              borderRadius: 3,
              boxShadow: theme.card.shadow,
              maxWidth: 280,
              cursor: 'grabbing',
            }}
          >
            <div
              style={{
                height: 3,
                background: overlayCardColor(activeTask.id),
                borderRadius: '3px 3px 0 0',
              }}
            />
            <div
              style={{
                padding: '6px 8px',
                fontSize: 12,
                color: '#333',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {activeTask.title}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
