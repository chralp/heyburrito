import { WebMock } from './lib/slackMock'
import { stub } from 'sinon';
import { expect } from 'chai';
import { sort } from '../src/lib/utils';
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

describe('Utils-test', async () => {
    it('should return shorted list descending', async () => {
        expect(sort(data)).to.deep.equal([
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

    it('should return shorted list ascending', async () => {
        expect(sort(data, 'asc')).to.deep.equal([
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
