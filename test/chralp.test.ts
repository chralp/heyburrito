import { calculateScore } from '../src/store/calc'
import * as config from '../src/config';
import { scoreBoard, user1ScoreData, user2ScoreData, user3ScoreData, user4ScoreData } from './data/calculatescore-data';


interface args {
  listType: string;
  scoreType: string;
  user?: string;
}

const getScore = ({ listType, scoreType, user }:args) => {
  const uniqueUsername: string[] = [...new Set(scoreBoard.map((x) => x[listType]))];

  const scoreList = uniqueUsername
    .map((user) => ({ _id: user, score: calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user }) }))
    .map((entry) => (entry.score !== 0) ? entry : null).filter(y => y);
  return scoreList;
}


describe('calculateScore', () => {

  describe('userscore', () => {


        /*
    [
      { to: 'USER1', from: 'USER2', value: 1 },
      { to: 'USER1', from: 'USER2', value: 1 },
      { to: 'USER1', from: 'USER3', value: -1 },
      { to: 'USER1', from: 'USER3', value: -1 },
      { to: 'USER1', from: 'USER2', value: -1 },
      { to: 'USER1', from: 'USER2', value: 1, overdrawn: false },
      { to: 'USER1', from: 'USER2', value: 1, overdrawn: false },
      { to: 'USER1', from: 'USER2', value: 1, overdrawn: false },
      { to: 'USER1', from: 'USER2', value: 1, overdrawn: false },
      { to: 'USER1', from: 'USER3', value: 1, overdrawn: false },
      { to: 'USER1', from: 'USER3', value: 1, overdrawn: false },
      { to: 'USER1', from: 'USER3', value: 1, overdrawn: true },
      { to: 'USER1', from: 'USER3', value: 1, overdrawn: true },
      { to: 'USER1', from: 'USER3', value: 1, overdrawn: true },
      { to: 'USER1', from: 'USER3', value: 1, overdrawn: false },
      { to: 'USER1', from: 'USER4', value: 1 },
      { to: 'USER1', from: 'USER4', value: 1 },
      { to: 'USER1', from: 'USER4', value: 1, overdrawn: false },
      { to: 'USER1', from: 'USER4', value: 1, overdrawn: false },
      { to: 'USER1', from: 'USER4', value: 1, overdrawn: false },
      { to: 'USER1', from: 'USER4', value: 1, overdrawn: true }
      ]
        */


    /*
    [
      { to: 'USER2', from: 'USER1', value: 1 },
      { to: 'USER2', from: 'USER1', value: 1 },
      { to: 'USER2', from: 'USER1', value: -1 },
      { to: 'USER2', from: 'USER1', value: -1 },
      { to: 'USER2', from: 'USER1', value: -1 },
      { to: 'USER2', from: 'USER1', value: -1 },
      { to: 'USER2', from: 'USER1', value: 1, overdrawn: false },
      { to: 'USER2', from: 'USER1', value: 1, overdrawn: false },
      { to: 'USER2', from: 'USER1', value: 1, overdrawn: false },
      { to: 'USER2', from: 'USER1', value: 1, overdrawn: true },
      { to: 'USER2', from: 'USER1', value: 1, overdrawn: true },
      { to: 'USER3', from: 'USER1', value: 1 },
      { to: 'USER3', from: 'USER1', value: 1 },
      { to: 'USER3', from: 'USER1', value: -1 },
      { to: 'USER3', from: 'USER1', value: 1 },
      { to: 'USER3', from: 'USER1', value: 1 },
      { to: 'USER3', from: 'USER1', value: 1, overdrawn: false },
      { to: 'USER3', from: 'USER1', value: 1, overdrawn: true },
      { to: 'USER3', from: 'USER1', value: 1, overdrawn: true },
      { to: 'USER4', from: 'USER1', value: 1 },
      { to: 'USER4', from: 'USER1', value: 1 },
      { to: 'USER4', from: 'USER1', value: -1 },
      { to: 'USER4', from: 'USER1', value: 1 },
      { to: 'USER4', from: 'USER1', value: 1, overdrawn: false }
    ]
     */


    it('Should calculate userscore for USER1 => to & inc => { enableOverDraw: false, enableDecrement: false }', () => {
      config.default.slack = { enableOverDraw: false, enableDecrement: false }
      const result = calculateScore(user1ScoreData, [], { listType: 'to', scoreType: 'inc', user: 'USER1' })
      expect(result).toEqual(14)
    });

    it('Should calculate userscore for USER1 => to & inc => { enableOverDraw: false, enableDecrement: true }', () => {
      config.default.slack = { enableOverDraw: false, enableDecrement: true }
      const result = calculateScore(user1ScoreData, [], { listType: 'to', scoreType: 'inc', user: 'USER1' })
      expect(result).toEqual(11)
    });

    it('Should calculate userscore for USER1 => to & inc => { enableOverDraw: true, enableDecrement: false }', () => {
      config.default.slack = { enableOverDraw: true, enableDecrement: false }
      const result = calculateScore(user1ScoreData, scoreBoard, { listType: 'to', scoreType: 'inc', user: 'USER1' })
      expect(result).toEqual(14)
    });

    it('Should calculate userscore for USER1 => to & inc => { enableOverDraw: true, enableDecrement: true }', () => {
      config.default.slack = { enableOverDraw: true, enableDecrement: true }
      const result = calculateScore(user1ScoreData, scoreBoard, { listType: 'to', scoreType: 'inc', user: 'USER1' })
      expect(result).toEqual(11)
    });

    it('Should calculate userscore for USER1 => to & dec => { enableOverDraw: false, enableDecrement: false }', () => {
      config.default.slack = { enableOverDraw: false, enableDecrement: false }
      const result = calculateScore(scoreBoard, [], { listType: 'to', scoreType: 'dec', user: 'USER1' })
      expect(result).toEqual(3)
    });

    it('Should calculate userscore for USER1 => to & dec => { enableOverDraw: false, enableDecrement: true }', () => {
      config.default.slack = { enableOverDraw: false, enableDecrement: true }
      const result = calculateScore(scoreBoard, [], { listType: 'to', scoreType: 'dec', user: 'USER1' })
      expect(result).toEqual(3)
    });

    it('Should calculate userscore for USER1 => to & dec => { enableOverDraw: true, enableDecrement: false }', () => {
      config.default.slack = { enableOverDraw: true, enableDecrement: false }
      const result = calculateScore(scoreBoard, [], { listType: 'to', scoreType: 'dec', user: 'USER1' })
      expect(result).toEqual(3)
    });

    it('Should calculate userscore for USER1 => to & dec => { enableOverDraw: true, enableDecrement: true }', () => {
      config.default.slack = { enableOverDraw: true, enableDecrement: true }
      const result = calculateScore(scoreBoard, [], { listType: 'to', scoreType: 'dec', user: 'USER1' })
      expect(result).toEqual(3)
    });


    it('Should calculate userscore for USER1 => from & inc => { enableOverDraw: false, enableDecrement: false }', () => {
      config.default.slack = { enableOverDraw: false, enableDecrement: false }
      const result = calculateScore(scoreBoard, [], { listType: 'from', scoreType: 'inc', user: 'USER1' })
      expect(result).toEqual(14)
    });

    it('Should calculate userscore for USER1 => from & inc => { enableOverDraw: false, enableDecrement: true }', () => {
      config.default.slack = { enableOverDraw: false, enableDecrement: true }
      const result = calculateScore(scoreBoard, [], { listType: 'from', scoreType: 'inc', user: 'USER1' })
      expect(result).toEqual(14)
    });

    it('Should calculate userscore for USER1 => from & inc => { enableOverDraw: true, enableDecrement: false }', () => {
      config.default.slack = { enableOverDraw: true, enableDecrement: false }
      const result = calculateScore(scoreBoard, [], { listType: 'from', scoreType: 'inc', user: 'USER1' })
      expect(result).toEqual(18)
    });


    it('Should calculate userscore for USER1 => from & inc => { enableOverDraw: true, enableDecrement: true }', () => {
      config.default.slack = { enableOverDraw: true, enableDecrement: true }
      const result = calculateScore(scoreBoard, [], { listType: 'from', scoreType: 'inc', user: 'USER1' })
      expect(result).toEqual(18)
    });


    it('Should calculate userscore for USER1 => from & dec => { enableOverDraw: false, enableDecrement: false }', () => {
      config.default.slack = { enableOverDraw: false, enableDecrement: false }
      const result = calculateScore(scoreBoard, [], { listType: 'from', scoreType: 'dec', user: 'USER1' })
      expect(result).toEqual(6)
    });

    it('Should calculate userscore for USER1 => from & dec => { enableOverDraw: false, enableDecrement: true }', () => {
      config.default.slack = { enableOverDraw: false, enableDecrement: true }
      const result = calculateScore(scoreBoard, [], { listType: 'from', scoreType: 'dec', user: 'USER1' })
      expect(result).toEqual(6)
    });

    it('Should calculate userscore for USER1 => from & dec => { enableOverDraw: true, enableDecrement: false }', () => {
      config.default.slack = { enableOverDraw: true, enableDecrement: false }
      const result = calculateScore(scoreBoard, [], { listType: 'from', scoreType: 'dec', user: 'USER1' })
      expect(result).toEqual(6)
    });

    it('Should calculate userscore for USER1 => from & dec => { enableOverDraw: true, enableDecrement: true }', () => {
      config.default.slack = { enableOverDraw: true, enableDecrement: true }
      const result = calculateScore(scoreBoard, [], { listType: 'from', scoreType: 'dec', user: 'USER1' })
      expect(result).toEqual(6)
    });


    it('Should calculate userscore for USER2 => to & inc => { enableOverDraw: false, enableDecrement: false }', () => {
      config.default.slack = { enableOverDraw: false, enableDecrement: false }
      const result = calculateScore(user2ScoreData, [], { listType: 'to', scoreType: 'inc', user: 'USER2' })
      expect(result).toEqual(9)
    });

    it('Should calculate userscore for USER2 => to & inc => { enableOverDraw: false, enableDecrement: true }', () => {
      config.default.slack = { enableOverDraw: false, enableDecrement: true }
      const result = calculateScore(user2ScoreData, [], { listType: 'to', scoreType: 'inc', user: 'USER2' })
      expect(result).toEqual(5)
    });

    it('Should calculate userscore for USER2 => to & inc => { enableOverDraw: true, enableDecrement: false }', () => {
      config.default.slack = { enableOverDraw: true, enableDecrement: false }
      const result = calculateScore(user2ScoreData, scoreBoard, { listType: 'to', scoreType: 'inc', user: 'USER2' })
      expect(result).toEqual(12)
    });


    it('Should calculate userscore for USER2 => to & inc => { enableOverDraw: true, enableDecrement: true }', () => {
      config.default.slack = { enableOverDraw: true, enableDecrement: true }
      const result = calculateScore(user2ScoreData, scoreBoard, { listType: 'to', scoreType: 'inc', user: 'USER2' })
      expect(result).toEqual(8)
    });





    /*
          [
      { to: 'USER1', from: 'USER2', value: 1 },
      { to: 'USER1', from: 'USER2', value: 1 },
      { to: 'USER1', from: 'USER2', value: -1 },
      { to: 'USER1', from: 'USER2', value: 1, overdrawn: false },
      { to: 'USER1', from: 'USER2', value: 1, overdrawn: false },
      { to: 'USER1', from: 'USER2', value: 1, overdrawn: false },
      { to: 'USER1', from: 'USER2', value: 1, overdrawn: false },
      { to: 'USER3', from: 'USER2', value: 1 },
      { to: 'USER3', from: 'USER2', value: 1 },
      { to: 'USER3', from: 'USER2', value: -1 },
      { to: 'USER3', from: 'USER2', value: 1 },
      { to: 'USER3', from: 'USER2', value: 1 },
      { to: 'USER3', from: 'USER2', value: 1, overdrawn: false },
      { to: 'USER4', from: 'USER2', value: 1 },
      { to: 'USER4', from: 'USER2', value: 1 },
      { to: 'USER4', from: 'USER2', value: 1, overdrawn: false }
      ]


    [
      { to: 'USER2', from: 'USER1', value: 1 },
      { to: 'USER2', from: 'USER1', value: 1 },
      { to: 'USER2', from: 'USER1', value: -1 },
      { to: 'USER2', from: 'USER1', value: -1 },
      { to: 'USER2', from: 'USER1', value: -1 },
      { to: 'USER2', from: 'USER1', value: -1 },
      { to: 'USER2', from: 'USER1', value: 1, overdrawn: false },
      { to: 'USER2', from: 'USER1', value: 1, overdrawn: false },
      { to: 'USER2', from: 'USER1', value: 1, overdrawn: false },
      { to: 'USER2', from: 'USER1', value: 1, overdrawn: true },
      { to: 'USER2', from: 'USER1', value: 1, overdrawn: true },
      { to: 'USER2', from: 'USER3', value: 1, overdrawn: true },
      { to: 'USER2', from: 'USER3', value: 1, overdrawn: false },
      { to: 'USER2', from: 'USER4', value: 1, overdrawn: false },
      { to: 'USER2', from: 'USER4', value: 1, overdrawn: false },
      { to: 'USER2', from: 'USER4', value: 1, overdrawn: false }
    ]
      */





    it('Should calculate userscore for USER2 => from & inc => { enableOverDraw: false, enableDecrement: false }', () => {
      config.default.slack = { enableOverDraw: false, enableDecrement: false }
      const result = calculateScore(scoreBoard, [], { listType: 'from', scoreType: 'inc', user: 'USER2' })
      expect(result).toEqual(9)
    });

    it('Should calculate userscore for USER2 => from & inc => { enableOverDraw: false, enableDecrement: true }', () => {
      config.default.slack = { enableOverDraw: false, enableDecrement: true }
      const result = calculateScore(scoreBoard, [], { listType: 'from', scoreType: 'inc', user: 'USER2' })
      expect(result).toEqual(5)
    });

    it('Should calculate userscore for USER2 => from & inc => { enableOverDraw: true, enableDecrement: false }', () => {
      config.default.slack = { enableOverDraw: true, enableDecrement: false }
      const result = calculateScore(scoreBoard, scoreBoard, { listType: 'from', scoreType: 'inc', user: 'USER2' })
      expect(result).toEqual(12)
    });


    it('Should calculate userscore for USER2 => from & inc => { enableOverDraw: true, enableDecrement: true }', () => {
      config.default.slack = { enableOverDraw: true, enableDecrement: true }
      const result = calculateScore(scoreBoard, scoreBoard, { listType: 'from', scoreType: 'inc', user: 'USER2' })

      const gg = scoreBoard.filter(data => {
        if(data['to'] === "USER2") return data
      })
      console.log(gg)

      expect(result).toEqual(8)
    });






    // it('User3 score should be 13 => to & inc => { enableOverDraw: false, enableDecrement: false }', () => {
    //   config.default.slack = { enableOverDraw: false, enableDecrement: false }
    //   const result = calculateScore(user3ScoreData, [], { listType: 'to', scoreType: 'inc', user: 'USER3' })
    //   expect(result).toEqual(13)
    // });

    // it('User3 score should be 9 => to & inc => { enableOverDraw: false, enableDecrement: true }', () => {
    //   config.default.slack = { enableOverDraw: false, enableDecrement: true }
    //   const result = calculateScore(user3ScoreData, [], { listType: 'to', scoreType: 'inc', user: 'USER3' })
    //   expect(result).toEqual(9)
    // });

    // it('User3 score should be 12 => to & inc => { enableOverDraw: true, enableDecrement: false }', () => {
    //   config.default.slack = { enableOverDraw: true, enableDecrement: false }
    //   const result = calculateScore(user3ScoreData, scoreBoard, { listType: 'to', scoreType: 'inc', user: 'USER3' })
    //   expect(result).toEqual(12)
    // });


    // it('User3 score should be 8 => to & inc => { enableOverDraw: true, enableDecrement: true }', () => {
    //   config.default.slack = { enableOverDraw: true, enableDecrement: true }
    //   const result = calculateScore(user3ScoreData, scoreBoard, { listType: 'to', scoreType: 'inc', user: 'USER3' })
    //   expect(result).toEqual(8)
    // });




    // it('User4 score should be 10 => to & inc => { enableOverDraw: false, enableDecrement: false }', () => {
    //   config.default.slack = { enableOverDraw: false, enableDecrement: false }
    //   const result = calculateScore(user4ScoreData, [], { listType: 'to', scoreType: 'inc', user: 'USER4' })
    //   expect(result).toEqual(10)
    // });

    // it('User4 score should be 10 => to & inc => { enableOverDraw: false, enableDecrement: true }', () => {
    //   config.default.slack = { enableOverDraw: false, enableDecrement: true }
    //   const result = calculateScore(user4ScoreData, [], { listType: 'to', scoreType: 'inc', user: 'USER4' })
    //   expect(result).toEqual(9)
    // });

    // it('User4 score should be 8 => to & inc => { enableOverDraw: true, enableDecrement: false }', () => {
    //   config.default.slack = { enableOverDraw: true, enableDecrement: false }
    //   const result = calculateScore(user4ScoreData, scoreBoard, { listType: 'to', scoreType: 'inc', user: 'USER4' })
    //   expect(result).toEqual(8)
    // });


    // it('User4 score should be 7 => to & inc => { enableOverDraw: true, enableDecrement: true }', () => {
    //   config.default.slack = { enableOverDraw: true, enableDecrement: true }
    //   const result = calculateScore(user4ScoreData, scoreBoard, { listType: 'to', scoreType: 'inc', user: 'USER4' })
    //   expect(result).toEqual(7)
    // });



  });

  describe('scoreboard', () => {

    // it('Should calculate scoreboard => to & inc => { enableOverDraw: false, enableDecrement: false }', async () => {
    //   config.default.slack = { enableOverDraw: false, enableDecrement: false }
    //   const listType = 'to';
    //   const scoreType = 'inc'
    //   const scoreList = getScore({ listType, scoreType })
    //   expect(scoreList).toEqual([
    //     { _id: 'USER1', score: 14 },
    //     { _id: 'USER2', score: 9 },
    //     { _id: 'USER3', score: 13 },
    //     { _id: 'USER4', score: 10 }
    //   ]);
    // });


    // it('Should calculate scoreboard => to & inc => { enableOverDraw: false, enableDecrement: true }', async () => {
    //   config.default.slack = { enableOverDraw: false, enableDecrement: true }
    //   const listType = 'to';
    //   const scoreType = 'inc'
    //   const scoreList = getScore({ listType, scoreType })
    //     expect(scoreList).toEqual([
    //     { _id: 'USER1', score: 11 },
    //     { _id: 'USER2', score: 5 },
    //     { _id: 'USER3', score: 9 },
    //     { _id: 'USER4', score: 9 }
    //   ]);
    // });


    // it('Should calculate scoreboard => to & inc => { enableOverDraw: true, enableDecrement: false }', async () => {
    //   config.default.slack = { enableOverDraw: true, enableDecrement: false }
    //   const listType = 'to';
    //   const scoreType = 'inc'
    //   const scoreList = getScore({ listType, scoreType })
    //   expect(scoreList).toEqual([
    //     { _id: 'USER1', score: 14 },
    //     { _id: 'USER2', score: 12 },
    //     { _id: 'USER3', score: 12 },
    //     { _id: 'USER4', score: 8 }
    //   ]);
    // });


    // it('Should calculate scoreboard => to & inc => { enableOverDraw: true, enableDecrement: true }', async () => {
    //   config.default.slack = { enableOverDraw: true, enableDecrement: true }
    //   const listType = 'to';
    //   const scoreType = 'inc'
    //   const scoreList = getScore({ listType, scoreType })
    //   expect(scoreList).toEqual([
    //     { _id: 'USER1', score: 11 },
    //     { _id: 'USER2', score: 8 },
    //     { _id: 'USER3', score: 8 },
    //     { _id: 'USER4', score: 7 }
    //   ]);
    // });

  });

});
