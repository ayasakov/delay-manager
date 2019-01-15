export const isWorkingDay = (dayIndex: number, state: any): boolean => {
  const isWorkDay = dayIndex !== 0 && dayIndex !== 6; // Sunday and Saturday
  return dayIndex in state ? state[dayIndex] : isWorkDay; // From storage or by default
};
