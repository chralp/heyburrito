import LocalStore from '../store/LocalStore';

export interface User {
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

export default (data: User[]): User[] => {
  const slackUsers = LocalStore.getSlackUsers();
  if (!data) return [];
  if (!slackUsers) return [];

  return slackUsers.map((x: any) => {
    const match = data.find(({ _id }) => _id === x.id && x.name);
    if (match) {
      const { _id, ...meta } = match;
      return {
        username: _id,
        name: x.name,
        avatar: x.avatar,
        memberType: x.memberType,
        ...meta,
      };
    }
    return undefined;
  }).filter((y: any) => y);
};
