import dotenv from 'dotenv';
dotenv.config();
import mapper from '../src/lib/mapper';
import { initSlack } from './lib/slack';

describe('/src/lib/mapper', () => {

  beforeAll(async () => await initSlack());

  it('Should map USER2 with data from LocalStore', async () => {
    const result = mapper([{ _id: 'USER2', score: 10 }])
    expect(result).toEqual([
      {
        username: 'USER2',
        name: 'User2',
        memberType: 'member',
        avatar: 'https://link.to.avatar.48.burrito',
        score: 10
      }
    ]);
  });

  it('Should map USER1 and USER3 with data from LocalStore', async () => {
    const result = mapper([{ _id: 'USER1', score: 10 }, { _id: 'USER3', score: 12 }])
    expect(result).toEqual([
      {
        username: 'USER1',
        name: 'User1',
        avatar: 'https://link.to.avatar.48.burrito',
        memberType: 'member',
        score: 10
      },
      {
        username: 'USER3',
        name: 'User3',
        memberType: 'member',
        avatar: 'https://link.to.avatar.48.burrito',
        score: 12
      }
    ]);
  });

  it('Should return empty array, due to no user found in LocalStore', async () => {
    const result = mapper([{ _id: 'USER1111', score: 10 }, { _id: 'USER1111111', score: 12 }])
    expect(result).toEqual([]);
  });
});
