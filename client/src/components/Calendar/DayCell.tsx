import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task } from '../../types/task';
import type { CalendarDay } from '../../types/calendar';
import { theme } from '../../theme';

const TASK_ID_PREFIX = 'task-';
const DAY_ID_PREFIX = 'day-';
const DAY_END_SUFFIX = '-end';

const Cell = styled.div<{ isCurrentMonth: boolean }>`
  background: ${(p) => (p.isCurrentMonth ? theme.grid.cellBg : theme.grid.cellOtherMonth)};
  border: 1px solid ${theme.grid.border};
  border-radius: 4px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
  &:hover {
    background: ${(p) => (p.isCurrentMonth ? '#f5f7f9' : '#f0f0f0')};
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
  }
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
  min-height: 24px;
  @media (max-width: ${theme.breakpoints.xs}px) {
    min-height: 20px;
  }
`;

const TaskCard = styled.li`
  position: relative;
  background: ${theme.card.bg};
  border-radius: 3px;
  box-shadow: ${theme.card.shadow};
  margin-bottom: 4px;
  overflow: visible;
  cursor: pointer;
  &:last-of-type {
    margin-bottom: 0;
  }
  &:hover [data-delete-btn] {
    opacity: 1;
  }
  @media (max-width: ${theme.breakpoints.xs}px) {
    margin-bottom: 2px;
    [data-delete-btn] {
      opacity: 1;
    }
  }
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 4px;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s, color 0.15s, background 0.15s;
  -webkit-tap-highlight-color: transparent;
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 1.5px;
    background: currentColor;
    border-radius: 1px;
  }
  &::before {
    transform: rotate(45deg);
  }
  &::after {
    transform: rotate(-45deg);
  }
  &:hover {
    background: rgba(222, 53, 11, 0.12);
    color: #de350b;
  }
  @media (max-width: ${theme.breakpoints.xs}px) {
    top: 3px;
    right: 3px;
    width: 18px;
    height: 18px;
    opacity: 1;
    &::before,
    &::after {
      width: 8px;
      height: 1px;
    }
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
  cursor: pointer;
  min-height: 20px;
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

const InlineInput = styled.input`
  width: 100%;
  padding: 6px 8px;
  font-size: 12px;
  border: 1px solid #4a90d9;
  border-radius: 3px;
  outline: none;
  box-sizing: border-box;
  @media (max-width: ${theme.breakpoints.sm}px) {
    font-size: 11px;
    padding: 4px 6px;
  }
  @media (max-width: ${theme.breakpoints.xs}px) {
    font-size: 10px;
    padding: 3px 4px;
  }
`;

const AddInputWrap = styled.div`
  margin-bottom: 4px;
  border: 1px dashed ${theme.grid.border};
  border-radius: 3px;
  background: #fafafa;
  &:focus-within {
    border-color: #4a90d9;
    background: #fff;
  }
  @media (max-width: ${theme.breakpoints.xs}px) {
    margin-bottom: 2px;
  }
`;

const DropPlaceholder = styled.div`
  height: 4px;
  margin: 2px 0;
  border-radius: 2px;
  background: #4a90d9;
  opacity: 0.6;
  flex-shrink: 0;
  pointer-events: none;
`;

const DropEndZone = styled.div<{ $active: boolean }>`
  min-height: ${(p) => (p.$active ? 28 : 0)}px;
  flex-shrink: 0;
  margin-top: ${(p) => (p.$active ? 2 : 0)}px;
  overflow: hidden;
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

type SortableTaskCardProps = {
  task: Task;
  isEditing: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onStartEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

function SortableTaskCard({
  task,
  isEditing,
  inputValue,
  onInputChange,
  onSubmit,
  onCancel,
  onStartEdit,
  onDelete,
  inputRef,
}: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${TASK_ID_PREFIX}${task.id}` });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  const dragProps = isEditing ? {} : { ...attributes, ...listeners };

  return (
    <TaskCard
      ref={setNodeRef}
      style={style}
      data-task-card
      onClick={(e) => e.stopPropagation()}
      {...dragProps}
    >
      <CardLabelBar color={cardColor(task.id)} />
      {isEditing ? (
        <InlineInput
          ref={inputRef}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onBlur={onSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit();
            if (e.key === 'Escape') onCancel();
          }}
        />
      ) : (
        <CardTitle onClick={() => onStartEdit(task)}>{task.title}</CardTitle>
      )}
      {!isEditing && (
        <DeleteBtn
          type="button"
          aria-label="Delete task"
          data-delete-btn
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
        />
      )}
    </TaskCard>
  );
}

type DayCellProps = {
  day: CalendarDay;
  tasks: Task[];
  holidays: string[];
  dropTarget: number | null;
  isDropTargetDay: boolean;
  onCreate: (title: string, date: string) => Promise<unknown>;
  onUpdate: (id: number, data: { title?: string }) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
};

export function DayCell({ day, tasks, holidays, dropTarget, isDropTargetDay, onCreate, onUpdate, onDelete }: DayCellProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { setNodeRef } = useDroppable({ id: `${DAY_ID_PREFIX}${day.date}` });
  const { setNodeRef: setEndZoneRef } = useDroppable({
    id: `${DAY_ID_PREFIX}${day.date}${DAY_END_SUFFIX}`,
  });

  const sortableIds = useMemo(
    () => tasks.map((t) => `${TASK_ID_PREFIX}${t.id}`),
    [tasks]
  );

  useEffect(() => {
    if (editingId !== null || isAdding) {
      inputRef.current?.focus();
    }
  }, [editingId, isAdding]);

  const submit = () => {
    const value = inputValue.trim();
    if (editingId !== null) {
      if (value) onUpdate(editingId, { title: value });
      setEditingId(null);
    } else if (isAdding && value) {
      onCreate(value, day.date);
      setIsAdding(false);
    } else if (isAdding) {
      setIsAdding(false);
    }
    setInputValue('');
  };

  const cancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setInputValue('');
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setInputValue(task.title);
  };

  const handleCellClick = (e: React.MouseEvent) => {
    if (isAdding || editingId !== null) return;
    const target = e.target as HTMLElement;
    if (target.closest('[data-task-card]')) return;
    setIsAdding(true);
  };

  const dayLabel = formatDayLabel(day.date, day.isCurrentMonth);

  return (
    <Cell
      ref={setNodeRef}
      isCurrentMonth={day.isCurrentMonth}
      onClick={handleCellClick}
    >
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
        {isAdding && (
          <AddInputWrap as="div" data-add-input onClick={(e) => e.stopPropagation()}>
            <InlineInput
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={submit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
                if (e.key === 'Escape') cancel();
              }}
              placeholder="Task title..."
            />
          </AddInputWrap>
        )}
        <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
          {tasks.map((t, i) => (
            <React.Fragment key={t.id}>
              {dropTarget === i && <DropPlaceholder />}
              <SortableTaskCard
                task={t}
                isEditing={editingId === t.id}
                inputValue={inputValue}
                onInputChange={setInputValue}
                onSubmit={submit}
                onCancel={cancel}
                onStartEdit={startEdit}
                onDelete={onDelete}
                inputRef={inputRef}
              />
            </React.Fragment>
          ))}
          {dropTarget === tasks.length && dropTarget !== null && (
            <DropPlaceholder key="drop-end" />
          )}
        </SortableContext>
        <DropEndZone ref={setEndZoneRef} data-drop-end $active={isDropTargetDay} />
      </TaskList>
    </Cell>
  );
}
