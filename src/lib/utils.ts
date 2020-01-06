import UserInterface from '../types/User.interface';

const time = () => {
    const start = new Date();
    const end = new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return {
        start,
        end,
    };
};

const sort = (input: UserInterface[], sortType: string = 'desc'): UserInterface[] => {
    const sorted = input.sort((a, b) => {
        if (sortType === 'desc') return b.score - a.score;
        return a.score - b.score;
    });
    return sorted;
};

const env: string = process.env.NODE_ENV || 'development';

const fixPath = (p: string): string => {
    if (!p.startsWith('/')) return `/${p}`;
    if (!p.endsWith('/')) return `${p}/`;
    return p;
};

const mustHave = (key: string) => {
    if (!process.env[key]) throw new Error(`Missing ENV ${key}`);
    return process.env[key];
};

export {
    time,
    sort,
    mustHave,
    fixPath,
    env,
};
