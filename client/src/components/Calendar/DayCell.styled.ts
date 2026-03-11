import styled from '@emotion/styled';
import { theme } from '../../theme';

export const Cell = styled.div<{ isCurrentMonth: boolean }>`
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

export const CellHead = styled.div<{ isCurrentMonth: boolean }>`
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

export const DayLabel = styled.span<{ isCurrentMonth: boolean }>`
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

export const CardCount = styled.span`
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

export const HolidayList = styled.div`
  flex-shrink: 0;
  margin-bottom: 4px;
  @media (max-width: ${theme.breakpoints.xs}px) {
    margin-bottom: 2px;
  }
`;

export const HolidayName = styled.div`
  font-size: 10px;
  color: #666;
  line-height: 1.3;
  padding: 1px 0;
  @media (max-width: ${theme.breakpoints.xs}px) {
    font-size: 9px;
  }
`;

export const TaskList = styled.ul`
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

export const TaskCard = styled.li`
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

export const DeleteBtn = styled.button`
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

export const CardLabelBar = styled.div<{ color: string }>`
  height: 3px;
  background: ${(p) => p.color};
  flex-shrink: 0;
  @media (max-width: ${theme.breakpoints.xs}px) {
    height: 2px;
  }
`;

export const CardTitle = styled.div`
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

export const InlineInput = styled.input`
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

export const AddInputWrap = styled.div`
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

export const DropPlaceholder = styled.div`
  height: 4px;
  margin: 2px 0;
  border-radius: 2px;
  background: #4a90d9;
  opacity: 0.6;
  flex-shrink: 0;
  pointer-events: none;
`;

export const DropEndZone = styled.div<{ $active: boolean }>`
  min-height: ${(p) => (p.$active ? 28 : 0)}px;
  flex-shrink: 0;
  margin-top: ${(p) => (p.$active ? 2 : 0)}px;
  overflow: hidden;
`;

