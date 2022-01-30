import { sort } from '../src/lib/utils/sort';
let data;
beforeEach(() => {
  data = [
    {
      username: 'USER2',
      name: 'User2',
      avatar: 'https://link.to.avatar.48.burrito',
      score: 3
    },
    {
      username: 'USER1',
      name: 'User1',
      avatar: 'https://link.to.avatar.48.burrito',
      score: 15
    },
    {
      username: 'USER3',
      name: 'User3',
      avatar: 'https://link.to.avatar.48.burrito',
      score: 20
    }
  ]
})

describe('Utils-test', () => {
  it('should return shorted list descending', () => {
    expect(sort(data)).toEqual([
      {
        username: 'USER3',
        name: 'User3',
        avatar: 'https://link.to.avatar.48.burrito',
        score: 20
      },
      {
        username: 'USER1',
        name: 'User1',
        avatar: 'https://link.to.avatar.48.burrito',
        score: 15
      },
      {
        username: 'USER2',
        name: 'User2',
        avatar: 'https://link.to.avatar.48.burrito',
        score: 3
      }
    ]);
  });

  it('should return shorted list ascending', () => {
    expect(sort(data, 'asc')).toEqual([
      {
        username: 'USER2',
        name: 'User2',
        avatar: 'https://link.to.avatar.48.burrito',
        score: 3
      },
      {
        username: 'USER1',
        name: 'User1',
        avatar: 'https://link.to.avatar.48.burrito',
        score: 15
      },
      {
        username: 'USER3',
        name: 'User3',
        avatar: 'https://link.to.avatar.48.burrito',
        score: 20
      },

    ]);
  });
});
