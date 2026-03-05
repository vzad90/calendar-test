export const theme = {
  header: {
    gradient: 'linear-gradient(135deg, #e86b2a 0%, #f5a623 100%)',
    text: '#fff',
  },
  navBar: {
    bg: '#e8e8e8',
    border: '#d0d0d0',
    text: '#333',
    buttonHover: '#d8d8d8',
    toggleActive: '#fff',
    toggleInactive: '#888',
  },
  grid: {
    bg: '#f0f0f0',
    cellBg: '#fff',
    cellOtherMonth: '#f8f8f8',
    border: '#e5e5e5',
    weekdayColor: '#666',
  },
  card: {
    bg: '#fff',
    shadow: '0 1px 3px rgba(0,0,0,0.08)',
    labelColors: ['#61bd4f', '#f2d600', '#ff9f1a', '#eb5a46', '#c377e0'],
  },
  breakpoints: {
    xs: 380,
    sm: 640,
    md: 768,
    lg: 1024,
  },
} as const;
