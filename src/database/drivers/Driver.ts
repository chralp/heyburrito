import UserScore from '../../types/UserScore.interface';
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
    //abstract async findFrom(user: string): Promise<Array<Score>>;

    abstract async findFromToday(user: string, listType: string): Promise<Array<Score>>;

    abstract async give(to: string, from: string);

    abstract async takeAway(to: string, from: string);

    abstract async getScore(user: string, listType: string): Promise<Sum[]>;

    //abstract async getGiven(user: string): Promise<Array<UserScore>>;

    //abstract async getGivers(user: string): Promise<Array<UserScore>>;
}
