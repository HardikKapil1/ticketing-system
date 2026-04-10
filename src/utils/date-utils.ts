// src/event/date-util.ts

export const getDateRange = (filter: string) => {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  if (filter === 'today') {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (filter === 'week') {
    start.setDate(now.getDate() - 7);
    start.setHours(0, 0, 0, 0);
  }

  return { start, end };
};
