const chai = require('chai');
const expect = chai.expect;

let redis = require('redis-mock'),
    client = redis.createClient();

const { storeminator } = require('../app/lib/storeminator')(redis, client, "5");
const { getFullScore, getGiven, getGivers } = require('../app/store/burrito')(redis, client);

const mergeGiven = require('../app/lib/mergeGiven');

describe('Storeminator', () => {

    beforeEach(() => {

        messageGiveTrue = {
            giver: 'USERONE',
            updates: [
                { username: 'USERTWO', type: 'inc' },
                { username: 'USERTWO', type: 'inc' },
                { username: 'USERTWO', type: 'inc' },
                { username: 'USERTHREE', type: 'inc' },
            ]
        }


        messageTryCap = {
            giver: 'USERONE',
            updates: [
                { username: 'USERTWO', type: 'inc' },
                { username: 'USERTWO', type: 'inc' },
                { username: 'USERTWO', type: 'inc' },
                { username: 'USERTHREE', type: 'inc' },
                { username: 'USERTHREE', type: 'inc' },
                { username: 'USERTHREE', type: 'inc' },
                { username: 'USERTHREE', type: 'inc' },
                { username: 'USERTHREE', type: 'inc' }

            ]
        }

        messageGiveFalse = {
            giver: 'USERONE',
            updates: []
        }


        fullScoreList = [
            { user: 'USERTWO', score: '3' },
            { user: 'USERTHREE', score: '1' }
        ]

        slackUsers = [
            {
                id:"USERONE",
                name:"userone name"
            },
            {
                id:"USERTWO",
                name: "usertwo name"

            }
        ]

        giversRawRes = [ 'USERONE', 'USERONE', 'USERONE','USERONE' ]
        giversRes = [ { id: 'USERONE', name: 'userone name', score: 4 } ]

    });


    it('Storeminator should return false', () => {
        expect(storeminator(messageGiveFalse)).to.be.false
    });

    it('Give burritos', () => {
        storeminator(messageGiveTrue);
    });

    it('should return received amount', () => {
        getFullScore().then((res) => {
            expect(res).deep.equal(fullScoreList);

        });
    });

    it('should return given amount for user', () => {
        getGiven('USERONE').then((res) => {
            expect(res).to.equal('4');
        });
    });

    it('Give burritos tryCap', () => {
        storeminator(messageTryCap);
    });

    it('should return given amount for user', () => {
        getGiven('USERONE').then((res) => {
            expect(res).to.equal('5');
        });
    });

    it('should return givers list from redis', () => {
        getGivers('USERTWO').then((res) => {
            expect(res).deep.equal(giversRawRes);
        });
    });

    it('should return givers list merged', () => {
        getGivers('USERTWO').then((res) => {
            expect(mergeGiven(slackUsers, res)).deep.equal(giversRes);
        });
    });
});
