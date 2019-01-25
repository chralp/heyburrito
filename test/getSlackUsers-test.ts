
import { stub } from 'sinon';
import { expect } from 'chai';
import slackUsers from './data/slackUsers'
import getSlackUsers from '../app/lib/getSlackUsers'

let wbc, parsed;

before(() => {

    wbc = {
        users: {
            list: stub().returns(Promise.resolve(slackUsers))
        }
    },
        parsed = {
            "users": [
                {
                    "id": "USER1",
                    "name": "User1",
                    "avatar": "https://link.to.avatar.48.burrito"
                },
                {
                    "id": "USER2",
                    "name": "User2",
                    "avatar": "https://link.to.avatar.48.burrito"
                },
                {
                    "id": "USER3",
                    "name": "User3",
                    "avatar": "https://link.to.avatar.48.burrito"
                },
                {
                    "id": "USER4",
                    "name": "User4",
                    "avatar": "https://link.to.avatar.48.burrito"
                }
            ],
            "bots": [
                {
                    "id": "BURRITOBOT",
                    "name": "heyburrito",
                    "avatar": "https://link.to.avatar.48.burrito"
                }
            ]
        }
})

describe('getSlackUsers-test', () => {

    it('should return object containing 2 arrays ( users, bots )', () => {
        return getSlackUsers(wbc).then((res) => {
            expect(res).to.deep.equal(parsed)
        })
    });

});
