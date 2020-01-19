import Score from '../../types/Score.interface';

interface Find {
    _id: string;
    to: string;
    from: string;
    value: number;
    given_at: Date;
}


interface Sum {
    _id?: string; // Username
    score?: number;
}

export default abstract class Driver {
    abstract async give(to: string, from: string, date): Promise<boolean>;

    abstract async takeAway(to: string, from: string, date): Promise<boolean>;

    abstract async getScore(user: string, listType: string): Promise<number | Find[]>;

    abstract async findFromToday(user: string, listType: string): Promise<Array<Score>>;
}
