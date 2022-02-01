const today = new Date();
const yesterDay = new Date(today);
const oneWeek = new Date(today);
yesterDay.setDate(yesterDay.getDate() - 1);
oneWeek.setDate(today.getDate() - 7);

export const randomDate = (start = oneWeek, end = today) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
