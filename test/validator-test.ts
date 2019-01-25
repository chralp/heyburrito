import { expect } from 'chai';
import { validBotMention, validMessage, selfMention, sentFromBot, sentToBot } from '../app/lib/validator'
let msg, resultShouldBe, res, storedBots, joinedChannel, pingUser, dmToBot, kicked, userJoinedChannel, emojis

/*
 if ((!!event.subtype) && (event.subtype === 'channel_join')) {
            log.info('Joined channel', event.channel);
        }

        if (event.type === 'message') {
            if (validMessage(event, emojis, this.allBots)) {
                if (validBotMention(event, this.botUserID)) {
                    // Geather data and send back to user
                    this.getUserStats(event.user).then((res) => {
                        this.sendToUser(event.user, res);
                    });
                } else {
                    const result = parseMessage(event, emojis);
                    console.log('result', result);
                    if (result) {
                        storeminator(result);
                    }
                }
            }
        }
*/
describe('validator-test', () => {

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

        it('should retrun true', () => {
            msg = {
                user: 'HEYBURRITO',
                text: 'hejsan'
            }
            function getBots() {
                return storedBots;
            }
            res = sentFromBot(msg, getBots)
            console.log("aasd", res)
            expect(res).to.equal(true)
        });

        it('should retrun false', () => {
            msg = {
                user: 'HEYBURRITO',
                text: 'hejsan'
            }
            function getBots() {
                return storedBots;
            }
            res = sentFromBot(msg, getBots)
            expect(res).to.equal(false)
        });


    });


    describe('sentToBot', () => {

        it('should retrun true', () => {
            msg = {
                user: 'USER1',
                text: 'hello <@HEYBURRITO>'
            }
            function getBots() {
                return storedBots;
            }
            res = sentToBot(msg, getBots)
            expect(res).to.equal(true)
        });

        it('should retrun false', () => {

            msg = {
                user: 'USER1',
                text: 'hello HEYBURRITO'
            }

            function getBots() {
                return storedBots;
            }
            res = sentToBot(msg, getBots)
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
