import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task } from '../../types/task';
import type { CalendarDay } from '../../types/calendar';
import {
  Cell,
  CellHead,
  DayLabel,
  CardCount,
  HolidayList,
  HolidayName,
  TaskList,
  TaskCard,
  DeleteBtn,
  CardLabelBar,
  CardTitle,
  InlineInput,
  AddInputWrap,
  DropPlaceholder,
  DropEndZone,
} from './DayCell.styled';

const TASK_ID_PREFIX = 'task-';
const DAY_ID_PREFIX = 'day-';
const DAY_END_SUFFIX = '-end';

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDayLabel(dateStr: string, isCurrentMonth: boolean): string {
  const day = Number(dateStr.slice(8, 10));
  if (isCurrentMonth) return String(day);
  const monthIndex = Number(dateStr.slice(5, 7)) - 1;
  return `${MONTH_SHORT[monthIndex]} ${day}`;
}

function cardColor(taskId: number): string {
  const colors = ['#61bd4f', '#f2d600', '#ff9f1a', '#eb5a46', '#c377e0'];
  return colors[taskId % colors.length];
}

type SortableTaskCardProps = {
  task: Task;
  isEditing: boolean;
  titleValue: string;
  onTitleChange: (value: string) => void;
  onSubmitEdit: () => void;
  onCancelEdit: () => void;
  onStartEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

function SortableTaskCard({
  task,
  isEditing,
  titleValue,
  onTitleChange,
  onSubmitEdit,
  onCancelEdit,
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
          value={titleValue}
          onChange={(e) => onTitleChange(e.target.value)}
          onBlur={onSubmitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmitEdit();
            if (e.key === 'Escape') onCancelEdit();
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
  onUpdate: (id: number, data: { title?: string; date?: string; order?: number }) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
};

type AddTaskInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

function AddTaskInput({ value, onChange, onSubmit, onCancel, inputRef }: AddTaskInputProps) {
  return (
    <AddInputWrap as="div" data-add-input onClick={(e) => e.stopPropagation()}>
      <InlineInput
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit();
          if (e.key === 'Escape') onCancel();
        }}
        placeholder="Task title..."
      />
    </AddInputWrap>
  );
}

export function DayCell({ day, tasks, holidays, dropTarget, isDropTargetDay, onCreate, onUpdate, onDelete }: DayCellProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [editTitle, setEditTitle] = useState('');
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

  const submitEdit = () => {
    const value = editTitle.trim();
    if (editingId !== null) {
      if (value) onUpdate(editingId, { title: value });
    }
    setEditingId(null);
    setEditTitle('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const submitAdd = () => {
    const value = newTitle.trim();
    if (isAdding && value) {
      onCreate(value, day.date);
    }
    setIsAdding(false);
    setNewTitle('');
  };

  const cancelAdd = () => {
    setIsAdding(false);
    setNewTitle('');
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
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
          <AddTaskInput
            value={newTitle}
            onChange={setNewTitle}
            onSubmit={submitAdd}
            onCancel={cancelAdd}
            inputRef={inputRef}
          />
        )}
        <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
          {tasks.map((t, i) => (
            <React.Fragment key={t.id}>
              {dropTarget === i && <DropPlaceholder />}
              <SortableTaskCard
                task={t}
                isEditing={editingId === t.id}
                titleValue={editTitle}
                onTitleChange={setEditTitle}
                onSubmitEdit={submitEdit}
                onCancelEdit={cancelEdit}
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
