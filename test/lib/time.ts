
export const randomDate = () => {
  const today = new Date();
  const yesterDay = new Date(today);
  const oneWeek = new Date(today);
  yesterDay.setDate(yesterDay.getDate() - 1);
  oneWeek.setDate(today.getDate() - 7);
  const time = new Date(oneWeek.getTime() + Math.random() * (today.getTime() - oneWeek.getTime()));
  return oneWeek;
}
