import { expect } from 'chai';
import { parseMessage, parseUsernames } from '../app/lib/parseMessage'

let msg, resultShouldBe, res, joinedChannel, pingUser, dmToBot, kicked, userJoinedChannel, emojis

before(() => {

    emojis = [{ type: 'inc', emoji: ':burrito:' }, { type: 'dec', emoji: ':rottenburrito:' }]


    //Hey burrito joinade en kanal
    joinedChannel = {
        user: 'UF34A58AC',
        inviter: 'UEKN9GNAJ',
        user_profile:
        {
            avatar_hash: 'a940dfda2378',
            image_72:
                'https://avatars.slack-edge.com/2018-12-30/513714034820_a940dfda23784468d1f2_72.png',
            first_name: '',
            real_name: 'heyburrito',
            display_name: '',
            team: 'TEKBZBLVD',
            name: 'heyburrito',
            is_restricted: false,
            is_ultra_restricted: false
        },
        type: 'message',
        subtype: 'channel_join',
        team: 'TEKBZBLVD',
        text: '<@UF34A58AC> has joined the channel',
        channel: 'CF4458XJ9',
        event_ts: '1546225820.000600',
        ts: '1546225820.000600'
    }

    pingUser = {
        type: 'message',
        user: 'UEKN9GNAJ',
        text: '<@UF34A58AC> hejsn',
        client_msg_id: 'cff7385d-56d2-4cec-a8d7-23ea85e96e22',
        team: 'TEKBZBLVD',
        channel: 'CF4458XJ9',
        event_ts: '1546225857.000800',
        ts: '1546225857.000800'
    }

    //direkt meddelande till heyburrito privat
    dmToBot = {
        type: 'message',
        user: 'UEKN9GNAJ',
        text: 'jahej',
        client_msg_id: 'e7f90cb1-da81-4075-828f-6f2e6ab2f12e',
        team: 'TEKBZBLVD',
        channel: 'DF386PMNV',
        event_ts: '1546225921.000100',
        ts: '1546225921.000100'
    }

    // jag joinade en kanal
    userJoinedChannel = {
        user: 'UEKN9GNAJ',
        user_profile:
        {
            avatar_hash: 'gc8facda114a',
            image_72:
                'https://secure.gravatar.com/avatar/c8facda114a361db902d0cbf6481e819.jpg?s=72&d=https%3A%2F%2Fa.slack-edge.com%2F66f9%2Fimg%2Favatars%2Fava_0006-72.png',
            first_name: 'chralp',
            real_name: 'chralp',
            display_name: '',
            team: 'TEKBZBLVD',
            name: 'christian',
            is_restricted: false,
            is_ultra_restricted: false
        },
        type: 'message',
        subtype: 'channel_join',
        team: 'TEKBZBLVD',
        text: '<@UEKN9GNAJ> has joined the channel',
        channel: 'CF4458XJ9',
        event_ts: '1546225958.001100',
        ts: '1546225958.001100'
    }

    //Kickad
    kicked = {
        type: 'message',
        user: 'USLACKBOT',
        text: 'You have been removed from #test by <@UEKN9GNAJ>',
        team: 'TEKBZBLVD',
        channel: 'DF3M00X3N',
        event_ts: '1546226014.000100',
        ts: '1546226014.000100'
    }

})

describe('handleMessage-test', () => {

    describe('parseUsername', () => {
        it('should return 2 unique usernames', () => {
            msg = {
                text: '<@USER2><@USER2><@USER3>:burrito: :burrito: :rottenburrito: user2',
            }
            resultShouldBe = ['USER2', 'USER3']
            res = parseUsernames(msg.text)
            expect(res).to.deep.equal(resultShouldBe)
        });

        it('should not return any usernames', () => {
            msg = {
                text: '<@USER2 @USER2> <USER3>:burrito: :burrito: :rottenburrito: user2',
            }
            res = parseUsernames(msg.text)
            expect(res).to.be.undefined
        });

    })


    describe('parseMessage', () => {

        it('should return 2 INC updates, one user', () => {
            msg = {
                user: 'USER1',
                text: '<@USER2>:burrito: :burrito:',
            }

            resultShouldBe = {
                giver: 'USER1',
                updates:
                    [{ username: 'USER2', type: 'inc' },
                    { username: 'USER2', type: 'inc' }]
            }
            res = parseMessage(msg, emojis)
            expect(res).to.deep.equal(resultShouldBe)
        });


        it('should return 4 INC updates, two users', () => {

            msg = {
                user: 'USER1',
                text: '<@USER2> <@USER3> :burrito: :burrito:',
            }

            resultShouldBe = {
                giver: 'USER1',
                updates:
                    [{ username: 'USER2', type: 'inc' },
                    { username: 'USER3', type: 'inc' },
                    { username: 'USER2', type: 'inc' },
                    { username: 'USER3', type: 'inc' }]
            }
            res = parseMessage(msg, emojis)
            expect(res).to.deep.equal(resultShouldBe)

        });

        it('should return 2 DEC updates, one user', () => {
            msg = {
                user: 'USER1',
                text: '<@USER2>:rottenburrito: :rottenburrito:',
            }

            resultShouldBe = {
                giver: 'USER1',
                updates:
                    [{ username: 'USER2', type: 'dec' },
                    { username: 'USER2', type: 'dec' }]
            }
            res = parseMessage(msg, emojis)
            expect(res).to.deep.equal(resultShouldBe)
        });


        it('should return 4 DEC updates, two users', () => {

            msg = {
                user: 'USER1',
                text: '<@USER2> <@USER3> :rottenburrito: :rottenburrito:',
            }

            resultShouldBe = {
                giver: 'USER1',
                updates:
                    [{ username: 'USER2', type: 'dec' },
                    { username: 'USER3', type: 'dec' },
                    { username: 'USER2', type: 'dec' },
                    { username: 'USER3', type: 'dec' }]
            }
            res = parseMessage(msg, emojis)
            expect(res).to.deep.equal(resultShouldBe)

        });

        it('should return 2 INC and 1 DEC updates, two users', () => {

            msg = {
                user: 'USER1',
                text: '<@USER2> <@USER3> :burrito::burrito: :rottenburrito:',
            }

            resultShouldBe = {
                giver: 'USER1',
                updates:
                    [{ username: 'USER2', type: 'inc' },
                    { username: 'USER3', type: 'inc' },
                    { username: 'USER2', type: 'inc' },
                    { username: 'USER3', type: 'inc' },
                    { username: 'USER2', type: 'dec' },
                    { username: 'USER3', type: 'dec' }]
            }
            res = parseMessage(msg, emojis)
            expect(res).to.deep.equal(resultShouldBe)

        });

    });

});
