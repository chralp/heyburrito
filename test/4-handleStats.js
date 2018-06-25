const chai = require('chai');
const expect = chai.expect;

let redis = require('redis-mock'),
    client = redis.createClient();

function serverStoredSlackUsers(){
    return slackUsers
}

const {
    getUserStats,
    getRecivedList,
    getGivenList
} = require('../app/lib/handleStats')(redis, client, serverStoredSlackUsers);

    describe('HandleStats', () => {

    beforeEach(() => {

        slackUsers = [
            {
                id:"USERONE",
                name:"userone name",
                avatar: "1"
            },
            {
                id:"USERTWO",
                name: "usertwo name",
                avatar: "2"
            },
            {
                id:"USERTHREE",
                name: "userthree name",
                avatar: "3"
            }

        ]

        userOneStatsRes = {
            id: 'USERONE',
            name: 'userone name',
            avatar: '1',
            received: '3',
            gived: '5',
            givenToday: 5,
            givers: [ { id: 'USERTWO', name: 'usertwo name', score: 3 } ]
        }


        receivedListRes =[
            {
                username: 'USERTWO',
                name: 'usertwo name',
                score: '4',
                avatar: '2'
            },
            {
                username: 'USERONE',
                name: 'userone name',
                score: '3',
                avatar: '1'
            },
            {
                username: 'USERTHREE',
                name: 'userthree name',
                score: '1',
                avatar: '3'
            }
        ]

        GivenListRes = [
            {
                username: 'USERONE',
                name: 'userone name',
                score: '5',
                avatar: '1'
            },
            {
                username: 'USERTWO',
                name: 'usertwo name',
                score: '3',
                avatar: '2'
            }
        ]
    });


    it('Should return userOne stats', () => {
        getUserStats("USERONE").then(res => {
            expect(res).to.deep.eql(userOneStatsRes)
        })
    });

    it('Should return recivedList orderd DESC', () => {
        getRecivedList().then(res => {
            expect(res).to.deep.eql(receivedListRes)
        })
    });

    it('Should return givenList orderd DESC', () => {
        getGivenList().then(res => {
            expect(res).to.deep.eql(GivenListRes)            
        })
    });
});
