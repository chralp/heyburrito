import LocalStore from '../store/LocalStore';
import User from '../types/User.interface';

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
                ...meta,
            };
        }
        return undefined;
    }).filter((y: any) => y);
};
