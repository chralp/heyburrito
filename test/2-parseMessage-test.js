const chai = require('chai');
const expect = chai.expect;
const parseMessage = require('../app/lib/parseMessage');

describe('Parse message', () => {

    beforeEach(() => {


        messageOneFalse = {
            user: 'USERONE',
            text: '<@USERTWO> This Should not be Valid :taco:',
        }

        messageOneTrue = {
            user: 'USERONE',
            text: '<@USERTWO> This Should be Valid :burrito::burrito:',
        }

        messageTwoTrue = {
            user: 'USERONE',
            text: '<@USERTWO> <@USERTHREE>  This Should be Valid :rottenburrito::burrito::burrito:',
        }

        messageOneTrueRes = {
            giver: 'USERONE',
            updates: [
                { username: 'USERTWO', type: 'inc' },
                { username: 'USERTWO', type: 'inc' }
            ]
        }

        messageTwoTrueRes ={
            giver: 'USERONE',
            updates: [
                { username: 'USERTWO', type: 'inc' },
                { username: 'USERTHREE', type: 'inc' },
                { username: 'USERTWO', type: 'inc' },
                { username: 'USERTHREE', type: 'inc' },
                { username: 'USERTWO', type: 'dec' },
                { username: 'USERTHREE', type: 'dec' }
            ]
        }

        emojis = [
            {
                emoji: ':burrito:',
                type: 'inc',
            },
            {
                emoji: ':rottenburrito:',
                type: 'dec',
            },
        ];
    });

        it('Message should not be valid', () => {
            expect(parseMessage(messageOneFalse,emojis)).to.be.false
        });

        it('Message should return valid Object', () => {
            expect(parseMessage(messageOneTrue,emojis)).to.deep.equal(messageOneTrueRes)
        });

        it('Message should return valid Object ( Muliple users )', () => {
            expect(parseMessage(messageTwoTrue,emojis)).to.deep.equal(messageTwoTrueRes)
        });
    });
