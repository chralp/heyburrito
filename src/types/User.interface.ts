export default interface User {
  _id?: string;
  username?: string;
  name?: string;
  avatar?: string;
  score?: number;
  received?: number;
  gived?: number;
  receivedToday?: number;
  givedToday?: number;
  scoreinc?: number;
  scoredec?: number;
}
