export const time = () => {
  const start = new Date();
  const end = new Date();
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return {
    start,
    end,
  };
};
