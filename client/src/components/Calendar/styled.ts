import styled from '@emotion/styled';
import { theme } from '../../theme';

export const CalendarWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
`;

export const NavBar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${theme.navBar.bg};
  border-bottom: 1px solid ${theme.navBar.border};
  box-shadow: ${theme.navBar.shadow};
  flex-shrink: 0;
  gap: 12px;
  flex-wrap: nowrap;
  min-height: 58px;
  @media (max-width: ${theme.breakpoints.sm}px) {
    padding: 10px 12px;
    gap: 10px;
    min-height: 54px;
  }
`;

export const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
  justify-content: flex-start;
`;

export const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
  justify-content: flex-end;
`;

export const NavArrow = styled.button`
  width: 38px;
  height: 38px;
  min-width: 38px;
  min-height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid ${theme.navBar.border};
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
  color: ${theme.navBar.text};
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
  &:hover {
    background: #fafafa;
    border-color: #ddd;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }
  &:active {
    box-shadow: 0 0 0 2px ${theme.navBar.accentFocus};
  }
  @media (max-width: ${theme.breakpoints.sm}px) {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    font-size: 20px;
  }
`;

export const MonthTitle = styled.h2`
  margin: 0;
  font-size: clamp(15px, 3.5vw, 17px);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: ${theme.navBar.text};
  flex-shrink: 0;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (max-width: ${theme.breakpoints.sm}px) {
    font-size: 16px;
  }
`;

export const NavSearchWrap = styled.div`
  min-width: 0;
  flex: 1;
  max-width: 220px;
  @media (max-width: ${theme.breakpoints.sm}px) {
    max-width: 150px;
  }
`;

export const NavSearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  font-size: 13px;
  line-height: 1.4;
  border: 1px solid ${theme.navBar.border};
  border-radius: 8px;
  background: #fff;
  color: #333;
  outline: none;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  transition: border-color 0.15s, box-shadow 0.15s;
  &::placeholder {
    color: #999;
  }
  &:hover {
    border-color: #ddd;
  }
  &:focus {
    border-color: ${theme.navBar.accent};
    box-shadow: 0 0 0 3px ${theme.navBar.accentFocus};
  }
  @media (max-width: ${theme.breakpoints.sm}px) {
    padding: 6px 10px;
    font-size: 12px;
    border-radius: 6px;
  }
`;

export const ViewToggle = styled.div`
  display: flex;
  border: 1px solid ${theme.navBar.border};
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
  flex-shrink: 0;
`;

export const ViewToggleButton = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  min-height: 38px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  background: ${(p) => (p.active ? theme.navBar.text : 'transparent')};
  color: ${(p) => (p.active ? '#fff' : theme.navBar.toggleInactive)};
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s, color 0.15s;
  &:hover {
    color: ${(p) => (p.active ? '#fff' : theme.navBar.text)};
    background: ${(p) => (p.active ? theme.navBar.text : '#f5f5f5')};
  }
  &:active {
    opacity: 0.95;
  }
  @media (max-width: ${theme.breakpoints.sm}px) {
    padding: 8px 12px;
    min-height: 40px;
    font-size: 12px;
  }
`;

export const GridWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background: ${theme.grid.bg};
  min-height: 0;
  min-width: 0;
  @media (max-width: ${theme.breakpoints.sm}px) {
    padding: 6px;
  }
  @media (max-width: ${theme.breakpoints.xs}px) {
    padding: 4px;
  }
`;

export const WeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 1px;
  margin-bottom: 4px;
  flex-shrink: 0;
  min-width: 0;
  @media (max-width: ${theme.breakpoints.sm}px) {
    margin-bottom: 2px;
  }
`;

export const WeekdayCell = styled.div`
  padding: 8px 2px;
  font-size: 12px;
  font-weight: 600;
  color: ${theme.grid.weekdayColor};
  text-align: center;
  @media (max-width: ${theme.breakpoints.sm}px) {
    font-size: 10px;
    padding: 4px 1px;
  }
  @media (max-width: ${theme.breakpoints.xs}px) {
    font-size: 9px;
    padding: 2px 0;
  }
`;

export const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-auto-rows: minmax(90px, 1fr);
  gap: 1px;
  flex: 1;
  min-height: 280px;
  min-width: 0;
  @media (max-width: ${theme.breakpoints.sm}px) {
    grid-auto-rows: minmax(72px, 1fr);
    min-height: 220px;
  }
  @media (max-width: ${theme.breakpoints.xs}px) {
    grid-auto-rows: minmax(64px, 1fr);
    min-height: 200px;
  }
`;

export const ErrorBanner = styled.div`
  padding: 8px 16px;
  background: #fee;
  color: #c00;
  font-size: 13px;
`;

export const LoadingWrap = styled.div`
  padding: 32px;
  text-align: center;
  color: ${theme.navBar.toggleInactive};
  font-size: 14px;
`;

