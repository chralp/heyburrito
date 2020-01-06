import { expect } from 'chai';
import { validBotMention, validMessage, selfMention, sentFromBot, sentToBot } from '../src/lib/validator'
let msg, resultShouldBe, res, storedBots, joinedChannel, pingUser, dmToBot, kicked, userJoinedChannel, emojis;

describe('/app/lib/validator', () => {

    beforeEach(() => {
        res = null
        emojis = [{ type: 'inc', emoji: ':burrito:' }, { type: 'dec', emoji: ':rottenburrito:' }]

        storedBots = [{
            id: 'HEYBURRITO',
            name: 'heyburrito',
            avatar: 'https://burrito.web.png'
        },
        {
            id: 'slackbot',
            name: 'slackbot',
            avatar: 'https://slack.bot.png'
        }]

    })


    describe('sentFromBot', () => {

        it('should return true', () => {
            msg = {
                user: 'HEYBURRITO',
                text: 'hejsan'
            }

            res = sentFromBot(msg, storedBots)
            expect(res).to.equal(true)
        });

        it('should return false', () => {
            msg = {
                user: 'notBot',
                text: 'hejsan'
            }

            res = sentFromBot(msg, storedBots)
            expect(res).to.equal(false)
        });
    });


    describe('sentToBot', () => {

        it('should return true', () => {
            msg = {
                user: 'USER1',
                text: 'hello <@HEYBURRITO>'
            }

            res = sentToBot(msg, storedBots)
            expect(res).to.equal(true)
        });

        it('should return false', () => {

            msg = {
                user: 'USER1',
                text: 'hello HEYBURRITO'
            }

            res = sentToBot(msg, storedBots)
            expect(res).to.equal(false)
        });


    });


    // Test if sender is mentioned in slackmessage
    describe('selfMention', () => {

        it('should return true', () => {
            msg = {
                user: 'USER1',
                text: '<@USER2> <@USER1> :burrito: :burrito:'
            }
            res = selfMention(msg)
            expect(res).to.equal(true)
        });

        it('should return false', () => {
            msg = {
                user: 'USER1',
                text: '<@USER2> :burrito: :burrito:'
            }
            res = selfMention(msg)
            expect(res).to.equal(false)
        });

    })
});
