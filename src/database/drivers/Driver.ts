import UserScore from '../../types/UserScore.interface';
import Score from '../../types/Score.interface';

export default abstract class Driver {
    abstract async findFrom(user:string): Promise<Array<Score>>;

    abstract async findFromToday(user:string): Promise<Array<Score>>;

    abstract async give(to:string, from:string);

    abstract async takeAway(to:string, from:string);

    abstract async getScore(user:string): Promise<Array<UserScore>>;

    abstract async getGiven(user:string): Promise<Array<UserScore>>;

    abstract async getGivers(user:string): Promise<Array<UserScore>>;
}
