import dotenv from 'dotenv';
dotenv.config();
import { stub } from 'sinon';
import { expect } from 'chai';
import { wbcListParsed } from './data/slackUsers';
const proxyquire = require('proxyquire').noCallThru();

let LocalStore, mapper
beforeEach(() => {
    LocalStore = {
        getSlackUsers: () => {
            return wbcListParsed.users;
        }
    }
    mapper = proxyquire('../src/lib/mapper', { '../store/LocalStore': LocalStore });
    mapper = mapper.default;
})

describe('mapper-test', async () => {
    it('Should map USER2 with data from LocalStore', async () => {
        const result = mapper([{ _id: 'USER2', score: 10 }])
        expect(result).to.deep.equal([
            {
                username: 'USER2',
                name: 'User2',
                avatar: 'https://link.to.avatar.48.burrito',
                score: 10
            }
        ]);
    });


    it('Should map USER1 and USER3 with data from LocalStore', async () => {
        const result = mapper([{ _id: 'USER1', score: 10 }, { _id: 'USER3', score: 12 }])
        expect(result).to.deep.equal([
            {
                username: 'USER1',
                name: 'User1',
                avatar: 'https://link.to.avatar.48.burrito',
                score: 10
            },
            {
                username: 'USER3',
                name: 'User3',
                avatar: 'https://link.to.avatar.48.burrito',
                score: 12
            }
        ]);
    });

    it('Should return empty array, due to no user found in LocalStore', async () => {
        const result = mapper([{ _id: 'USER10', score: 10 }, { _id: 'USER11', score: 12 }])
        expect(result).to.deep.equal([]);
    });
});
