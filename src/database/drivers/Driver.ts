export interface Find {
  _id: string;
  to: string;
  from: string;
  value: number;
  given_at: Date;
  overdrawn?: boolean;
};

export interface DatabasePost {
  _id?: string,
  to?: string,
  from?: string,
  value?: number,
  given_at?: Date;
  overdrawn?: boolean;
};

export interface GetScoreBoard {
  user?: string;
  listType?: string;
  today?: boolean;
};

export interface GivePost {
  _id?: string;
  to: string;
  from: string;
  value: number;
  given_at: Date;
  overdrawn: boolean;
};

export default abstract class Driver {

  abstract give(score: GivePost);

  abstract getScore(user: string, listType: string): Promise<DatabasePost[]>;

  abstract findFromToday(user: string, listType: string): Promise<DatabasePost[]>;

  abstract getScoreBoard({ }: GetScoreBoard): Promise<DatabasePost[]>;
}
