import { stub } from 'sinon';
import { expect } from 'chai';
import slackUsers from './data/slackUsers'
import mergeUserData  from '../app/lib/mergeUserData'

let storedUsers, param2, mapped;

before(() => {
    storedUsers = [
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
    ]
    param2 = [ { _id: 'USER4', score: 2 } ]

    mapped =[{ username: 'USER4',
               name: 'User4',
               score: 2,
               avatar: 'https://link.to.avatar.48.burrito' }]
})

describe('mergeUserData-test', () => {

    it('should return object where param2 is mapped to storedSlackUsers', () => {
        expect(mergeUserData(storedUsers,param2)).to.deep.equal(mapped)
    });

});
