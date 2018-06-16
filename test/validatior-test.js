const chai = require('chai')
const expect = chai.expect

const validate = require('../fun/validator')

let redis = require("redis-mock"),
    client = redis.createClient();
const { storeminator } = require('../lib/storeminator')(redis,client)
const {getUserScores, getGiven,getGivers} = require('../lib/burritoStore')(redis,client)

const mergeGiven = require('../fun/mergeGiven')

describe('HeyBurrito!',() => {
    let emojis = undefined
    let givenObj = undefined
    let givenObjRes = undefined
    beforeEach(() => {
        givenObj = {
            user: 'USERONE',
            text: '<@USERTWO> <@USERTHREE> :burrito::burrito:'
        }

        givenObjRes = {
            giver: 'USERONE',
            updates:
            [
                { username: 'USERTWO', type: 'inc' },
                { username: 'USERTHREE', type: 'inc' },
                { username: 'USERTWO', type: 'inc' },
                { username: 'USERTHREE', type: 'inc' },
            ]
        }

        emojis = [
            {
                "emoji":":burrito:",
                "type":"inc"
            }
        ]
        giversRes = [ 'USERONE', 'USERONE' ]
        receivedRes = [ { user: 'USERTWO', score: '2' },{ user: 'USERTHREE', score: '2' }]

        slackUsers = [
            {
                id: "USERONE",
                name: "userone name",
            },
            {
                id: "USERTWO",
                name: "usertwo name",
            },
            {
                id: "USERTHREE",
                name: "userthree name",
            }
        ]

        givenRes = [ { id: 'USERONE', name: 'userone name', score: 2 } ]
    })

    describe('Test burrito functions', () => {
        it('should be a valid JSON', () => {
            expect(validate(givenObj,emojis)).deep.equal(givenObjRes)
        });

        it('Give burritos', () => {
            storeminator(givenObjRes)
        })

        it('should return received amount', () => {
            getUserScores().then((res)=> {
                expect(res).deep.equal(receivedRes)
            })
        })

        it('should return given amount', () => {
            getGiven("USERONE").then((res)=> {
                expect(res).to.equal('4')
            })
        })

        it('should return givers list', () => {
            getGivers("USERTWO").then((res)=>{
                expect(res).deep.equal(giversRes)
            })
        })

        it('should return givers list', () => {
            getGivers("USERTWO").then((res)=>{
                expect(mergeGiven(slackUsers,res)).deep.equal(givenRes)

            })
        })

    });
});
