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
  padding: 10px 12px;
  background: ${theme.navBar.bg};
  border-bottom: 1px solid ${theme.navBar.border};
  flex-shrink: 0;
  gap: 10px;
  flex-wrap: nowrap;
  min-height: 56px;
  @media (max-width: ${theme.breakpoints.sm}px) {
    padding: 10px 8px;
    gap: 8px;
    min-height: 52px;
  }
`;

export const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
`;

export const NavArrow = styled.button`
  width: 40px;
  height: 36px;
  min-width: 40px;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.navBar.bg};
  border: 1px solid ${theme.navBar.border};
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  color: ${theme.navBar.text};
  -webkit-tap-highlight-color: transparent;
  &:hover {
    background: ${theme.navBar.buttonHover};
  }
  &:active {
    background: ${theme.navBar.border};
  }
  @media (max-width: ${theme.breakpoints.sm}px) {
    width: 44px;
    height: 40px;
    min-width: 44px;
    min-height: 40px;
    font-size: 20px;
  }
`;

export const MonthTitle = styled.h2`
  margin: 0;
  font-size: clamp(14px, 3.5vw, 16px);
  font-weight: 600;
  color: ${theme.navBar.text};
  flex: 1;
  text-align: center;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (max-width: ${theme.breakpoints.sm}px) {
    font-size: 15px;
  }
`;

export const ViewToggle = styled.div`
  display: flex;
  border: 1px solid ${theme.navBar.border};
  border-radius: 6px;
  overflow: hidden;
  background: ${theme.navBar.bg};
  flex-shrink: 0;
`;

export const ViewToggleButton = styled.button<{ active?: boolean }>`
  padding: 8px 14px;
  min-height: 40px;
  font-size: 13px;
  border: none;
  cursor: pointer;
  background: ${(p) => (p.active ? theme.navBar.toggleActive : 'transparent')};
  color: ${(p) => (p.active ? theme.navBar.text : theme.navBar.toggleInactive)};
  font-weight: ${(p) => (p.active ? 600 : 400)};
  box-shadow: ${(p) => (p.active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none')};
  -webkit-tap-highlight-color: transparent;
  &:hover {
    color: ${theme.navBar.text};
  }
  @media (max-width: ${theme.breakpoints.sm}px) {
    padding: 8px 12px;
    min-height: 44px;
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
