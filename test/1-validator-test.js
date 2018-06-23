const chai = require('chai');
const expect = chai.expect;
const {validBotMention,validMessage} = require('../app/lib/validator')(true);

describe('Message Validation', () => {

    beforeEach(() => {
        // Globals
        bots = [
            {
                id: 'BOTONE',
                name: 'botone',
            },
            {
                id: 'BOTTWO',
                name: 'bottwo',
            }
        ]

        // False message

        messFromBotFalse = {
            user: 'BOTONE',
            text: '<@USERONE> :burrito::burrito:',
        };

        messToBotFalse = {
            user: 'USERONE',
            text: '<@BOTONE> stat S',
        };

        messToBotFalse2 = {
            user: 'USERONE',
            text: '<@BOTTWO> stats',
        };


        messFromUserFalse = {
            user: 'USERONE',
            text: '<@BOTTWO> <@USERTHREE> :burrito::burrito:',
        };
        messFromUserFalse2 = {
            user: 'USERONE',
            text: '<@BOTTWO> <@USERTHREE> :burrito::burrito:',
            subtype: 'message_changed'
        };
        messFromUserFalse3 = {
            user: 'USERONE',
            text: '<@BOTTWO> <@USERTHREE> :burrito::burrito:',
            subtype: 'message_deleted'
        };
        messFromUserFalse4 = {
            user: 'USERONE',
            text: '<@BOTTWO> <@USERTHREE> :burrito::burrito:',
            subtype: 'bot_message'

        };
        messFromUserFalse5 = {
            user: 'USERONE',
            text: '<@USERONE> :burrito::burrito:',
        };

        bot_id = "BOTONE"

        // True message
        messFromUserTrue = {
            user: 'USERONE',
            text: '<@USERTWO> <@USERTHREE> :burrito::burrito:',
        };

        messToBotTrue = {
            user: 'USERONE',
            text: '<@BOTONE> oha mf stats',
        };


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

        it('message from user should be valid', () => {
            function allBots () {
                return bots;
            }
            expect(validMessage(messFromUserTrue, emojis, allBots)).to.be.true

        });


        it('message from user should not be valid', () => {
            function allBots () {
                return bots;
            }
            expect(validMessage(messFromUserFalse, emojis, allBots)).to.be.false

        });


        it('message from bot should not be valid', () => {
            function allBots () {
                return bots;
            }
            expect(validMessage(messFromBotFalse, emojis,allBots)).to.be.false

        });


        it('subtype message_changed should not be valid', () => {
            expect(validMessage(messFromUserFalse2, emojis)).to.be.false

        });

        it('subtype message_deleted should not be valid', () => {
            expect(validMessage(messFromUserFalse3, emojis)).to.be.false

        });
        it('subtype bot_message should not be valid', () => {
            expect(validMessage(messFromUserFalse4, emojis)).to.be.false

        });
        it('giving burrito to myself should not be valid', () => {
            expect(validMessage(messFromUserFalse5, emojis)).to.be.false

        });



        it('botMention should return false', () => {
            function botUserID() {
                return bot_id;
            }
            expect(validBotMention(messToBotFalse,botUserID)).to.be.false

        });

        it('botMention should return false again', () => {
            function botUserID() {
                return bot_id;
            }
            expect(validBotMention(messToBotFalse2,botUserID)).to.be.false

        });

        it('botMention should return true', () => {
            function botUserID() {
                return bot_id;
            }
            expect(validBotMention(messToBotTrue,botUserID)).to.be.true

        });
});
