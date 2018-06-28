const chai = require('chai');
const expect = chai.expect;
const { MongoClient } = require('mongo-mock');
const Driver = require('../app/database/drivers/mongodb');
const DriverInstance = new Driver(MongoClient,{url:'localhost:27017', name:'burrito'});
const BurritoStore = require('../app/store/burrito');
BurritoStore.setDatabase(DriverInstance);
// Import/Mock database layer
// BurritoStore.setDatabase(mockedDatabase);
// Ready to interact with BurritoStore

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

        messageGiveTrue2 = {
            giver: 'USERTWO',
            updates: [
                { username: 'USERONE', type: 'inc' },
                { username: 'USERONE', type: 'inc' },
                { username: 'USERONE', type: 'inc' },
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
            { user: 'USERONE', score: '3' },
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


    it('Give burritos', () => {
        Promise.all([
            BurritoStore.giveBurrito('chralp','chralp'),
            BurritoStore.giveBurrito('chralp','chralp')
        ]).then(() => {
            BurritoStore.getUserScore('chralp').then(res => {
                console.log("res",res)
            })

        });

    });

});
