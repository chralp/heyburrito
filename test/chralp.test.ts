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

    describe('Should calculate userscore for USER1', () => {
      const user = 'USER1';


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
      describe('with args { listType: to, scoreType: inc }', () => {
        const listType = 'to';
        const scoreType = 'inc';
        it('with ENVS: { enableOverDraw: false, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const result = calculateScore(user1ScoreData, [], { listType, scoreType, user })
          expect(result).toEqual(14)
        });

        it('with ENVS: { enableOverDraw: false, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: true }
          const result = calculateScore(user1ScoreData, [], { listType, scoreType, user })
          expect(result).toEqual(11)
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: false }
          const result = calculateScore(user1ScoreData, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(14)
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: true }
          const result = calculateScore(user1ScoreData, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(11)
        });
      });




      describe('with args { listType: from, scoreType: inc }', () => {
        const listType = 'from';
        const scoreType = 'inc';

        it('with ENVS: { enableOverDraw: false, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(14)
        });

        it('with ENVS: { enableOverDraw: false, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: true }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(14)
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: false }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(18)
        });


        it('with ENVS: { enableOverDraw: true, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: true }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(18)
        });

      });
      describe('with args { listType: to, scoreType: dec }', () => {
        const listType = 'to';
        const scoreType = 'dec';

        it('with ENVS: { enableOverDraw: false, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(3)
        });

        it('with ENVS: { enableOverDraw: false, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: true }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(3)
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: false }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(3)
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: true }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(3)
        });


      });
      describe('with args { listType: from, scoreType: dec }', () => {
        const listType = 'from';
        const scoreType = 'dec';
        it('Should calculate userscore for USER1 => from & dec => { enableOverDraw: false, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(6)
        });

        it('with ENVS: { enableOverDraw: false, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: true }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(6)
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: false }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(6)
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: true }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(6)
        });
      });
    });

    describe('Should calculate userscore for USER2', () => {

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
      const user = 'USER2';
      describe('with args { listType: to, scoreType: inc }', () => {
        const listType = 'to';
        const scoreType = 'inc';

        it('with ENVS: { enableOverDraw: false, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(9)
        });

        it('with ENVS: { enableOverDraw: false, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: true }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(5)
        });
        it('with ENVS: { enableOverDraw: true, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: false }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(12)
        });
        it('with ENVS: { enableOverDraw: true, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: true }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(8)
        });
      });

      describe('with args { listType: from, scoreType: inc }', () => {
        const listType = 'from';
        const scoreType = 'inc';
        it('with ENVS: { enableOverDraw: false, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(14)
        });

        it('with ENVS: { enableOverDraw: false, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: true }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(14)
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: false }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(14)
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: true }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(14)
        });
      });

      describe('with args { listType: to, scoreType: dec }', () => {
        const listType = 'to';
        const scoreType = 'dec';
        it('with ENVS: { enableOverDraw: false, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const result = calculateScore(user2ScoreData, [],{ listType, scoreType, user })
          expect(result).toEqual(4)
        });

        it('with ENVS: { enableOverDraw: false, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: true }
          const result = calculateScore(user2ScoreData, [],{ listType, scoreType, user })
          expect(result).toEqual(4)
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: false }
          const result = calculateScore(user2ScoreData, scoreBoard,{ listType, scoreType, user })
          expect(result).toEqual(4)
        });


        it('with ENVS: { enableOverDraw: true, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: true }
          const result = calculateScore(user2ScoreData, scoreBoard,{ listType, scoreType, user })
          expect(result).toEqual(4)
        });
      });

      describe('with args { listType: from, scoreType: dec }', () => {
        const listType = 'from';
        const scoreType = 'dec';

        it('with ENVS: { enableOverDraw: false, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const result = calculateScore(scoreBoard, [],{ listType, scoreType, user })
          expect(result).toEqual(2)
        });

        it('with ENVS: { enableOverDraw: false, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: true }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(2)
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: false }
          const result = calculateScore(scoreBoard, scoreBoard,{ listType, scoreType, user })
          expect(result).toEqual(2)
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: true }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(2)
        });
      });
    });



    describe('Should calculate userscore for USER3', () => {
      const user = 'USER3';
   /*

         [
       { to: 'USER3', from: 'USER2', value: 1 },
       { to: 'USER3', from: 'USER1', value: 1 },
       { to: 'USER3', from: 'USER1', value: 1 },
       { to: 'USER3', from: 'USER2', value: 1 },
       { to: 'USER3', from: 'USER1', value: -1 },
       { to: 'USER3', from: 'USER2', value: -1 },
       { to: 'USER3', from: 'USER1', value: 1 },
       { to: 'USER3', from: 'USER2', value: 1 },
       { to: 'USER3', from: 'USER1', value: 1 },
       { to: 'USER3', from: 'USER2', value: 1 },
       { to: 'USER3', from: 'USER4', value: -1 },
       { to: 'USER3', from: 'USER4', value: -1 },
       { to: 'USER3', from: 'USER1', value: 1, overdrawn: false },
       { to: 'USER3', from: 'USER1', value: 1, overdrawn: true },
       { to: 'USER3', from: 'USER1', value: 1, overdrawn: true },
       { to: 'USER3', from: 'USER4', value: 1, overdrawn: true },
       { to: 'USER3', from: 'USER2', value: 1, overdrawn: false },
       { to: 'USER3', from: 'USER4', value: 1, overdrawn: false },
       { to: 'USER3', from: 'USER4', value: 1, overdrawn: false },
       { to: 'USER3', from: 'USER4', value: 1, overdrawn: false }
       ]


         [
       { to: 'USER1', from: 'USER3', value: -1 },
       { to: 'USER1', from: 'USER3', value: -1 },
       { to: 'USER1', from: 'USER3', value: 1, overdrawn: false },
       { to: 'USER1', from: 'USER3', value: 1, overdrawn: false },
       { to: 'USER1', from: 'USER3', value: 1, overdrawn: true },
       { to: 'USER1', from: 'USER3', value: 1, overdrawn: true },
       { to: 'USER1', from: 'USER3', value: 1, overdrawn: true },
       { to: 'USER1', from: 'USER3', value: 1, overdrawn: false },
       { to: 'USER2', from: 'USER3', value: 1, overdrawn: true },
       { to: 'USER2', from: 'USER3', value: 1, overdrawn: false },
       { to: 'USER4', from: 'USER3', value: 1 },
       { to: 'USER4', from: 'USER3', value: 1, overdrawn: false },
       { to: 'USER4', from: 'USER3', value: 1, overdrawn: false }
     ]
   */
      describe('with args { listType: to, scoreType: inc }', () => {
        const listType = 'to';
        const scoreType = 'inc';
        it('with ENVS: { enableOverDraw: false, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(13)
        });

        it('with ENVS: { enableOverDraw: false, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: true }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(9);
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: false }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(12);
        });


        it('with ENVS: { enableOverDraw: true, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: true }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(8);
        });
      });

      describe('with args { listType: from, scoreType: inc }', () => {

        const listType = 'from';
        const scoreType = 'inc';

        it('with ENVS: { enableOverDraw: false, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(7)
        });

        it('with ENVS: { enableOverDraw: false, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: true }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(7);
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: false }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(11);
        });


        it('with ENVS: { enableOverDraw: true, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: true }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(11);
        });
      });


      describe('wtih args { listType: to, scoreType: dec }', () => {

        const listType = 'to';
        const scoreType = 'dec';

        it('with ENVS: { enableOverDraw: false, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(4)
        });

        it('with ENVS: { enableOverDraw: false, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: true }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(4);
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: false }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(4);
        });


        it('with ENVS: { enableOverDraw: true, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: true }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(4);
        });
      });

      describe('with args { listType: from, scoreType: dec }', () => {

        const listType = 'from';
        const scoreType = 'dec';

        it('with ENVS: { enableOverDraw: false, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(2)
        });

        it('with ENVS: { enableOverDraw: false, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: true }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(2);
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: false }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(2);
        });


        it('with ENVS: { enableOverDraw: true, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: true }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(2);
        });
      });
    });


    describe('Should calculate userscore for USER4', () => {
    /*
  [
      { to: 'USER4', from: 'USER2', value: 1 },
      { to: 'USER4', from: 'USER2', value: 1 },
      { to: 'USER4', from: 'USER3', value: 1 },
      { to: 'USER4', from: 'USER1', value: 1 },
      { to: 'USER4', from: 'USER1', value: 1 },
      { to: 'USER4', from: 'USER1', value: -1 },
      { to: 'USER4', from: 'USER1', value: 1 },
      { to: 'USER4', from: 'USER3', value: 1, overdrawn: false },
      { to: 'USER4', from: 'USER3', value: 1, overdrawn: false },
      { to: 'USER4', from: 'USER1', value: 1, overdrawn: false },
      { to: 'USER4', from: 'USER2', value: 1, overdrawn: false }
      ]

          [
      { to: 'USER1', from: 'USER4', value: 1 },
      { to: 'USER1', from: 'USER4', value: 1 },
      { to: 'USER1', from: 'USER4', value: 1, overdrawn: false },
      { to: 'USER1', from: 'USER4', value: 1, overdrawn: false },
      { to: 'USER1', from: 'USER4', value: 1, overdrawn: false },
      { to: 'USER1', from: 'USER4', value: 1, overdrawn: true },
      { to: 'USER2', from: 'USER4', value: 1, overdrawn: false },
      { to: 'USER2', from: 'USER4', value: 1, overdrawn: false },
      { to: 'USER2', from: 'USER4', value: 1, overdrawn: false },
      { to: 'USER3', from: 'USER4', value: -1 },
      { to: 'USER3', from: 'USER4', value: -1 },
      { to: 'USER3', from: 'USER4', value: 1, overdrawn: true },
      { to: 'USER3', from: 'USER4', value: 1, overdrawn: false },
      { to: 'USER3', from: 'USER4', value: 1, overdrawn: false },
      { to: 'USER3', from: 'USER4', value: 1, overdrawn: false }
    ]
    */
      const user = 'USER4';

      describe('with args { listType: to, scoreType: inc }', () => {
        const listType = 'to';
        const scoreType = 'inc';
        it('with ENVS: { enableOverDraw: false, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(10)
        });

        it('with ENVS: { enableOverDraw: false, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: true }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(9)
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: false }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(8)
        });


        it('with ENVS: { enableOverDraw: true, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: true }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(7)
        });
      });

      describe('with args { listType: from, scoreType: inc }', () => {
        const listType = 'from';
        const scoreType = 'inc';
        it('with ENVS: { enableOverDraw: false, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(11)
        });

        it('with ENVS: { enableOverDraw: false, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: true }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(11)
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: false }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(13)
        });


        it('with ENVS: { enableOverDraw: true, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: true }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(13)
        });

      });
      describe('with args { listType: to, scoreType: dec }', () => {
        const listType = 'to';
        const scoreType = 'dec';
        it('with ENVS: { enableOverDraw: false, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(1)
        });

        it('with ENVS: { enableOverDraw: false, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: true }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(1)
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: false }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(1)
        });


        it('with ENVS: { enableOverDraw: true, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: true }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(1)
        });
      });

      describe('with args { listType: from, scoreType: dec }', () => {

        const listType = 'from';
        const scoreType = 'dec';

        it('with ENVS: { enableOverDraw: false, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: false }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(2)
        });

        it('with ENVS: { enableOverDraw: false, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: false, enableDecrement: true }
          const result = calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user })
          expect(result).toEqual(2)
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: false }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: false }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(2)
        });

        it('with ENVS: { enableOverDraw: true, enableDecrement: true }', () => {
          config.default.slack = { enableOverDraw: true, enableDecrement: true }
          const result = calculateScore(scoreBoard, [], { listType, scoreType, user })
          expect(result).toEqual(2)
        });
      });
    });
  });

  describe('scoreboard', () => {

    describe('with args { listType: to, scoreType: from }', () => {
      const listType = 'to';
      const scoreType = 'inc';
      it('with ENVS: { enableOverDraw: false, enableDecrement: false }', async () => {
        config.default.slack = { enableOverDraw: false, enableDecrement: false }
        const scoreList = getScore({ listType, scoreType })
        expect(scoreList).toEqual([
          { _id: 'USER1', score: 14 },
          { _id: 'USER2', score: 9 },
          { _id: 'USER3', score: 13 },
          { _id: 'USER4', score: 10 }
        ]);
      });


      it('with ENVS: { enableOverDraw: false, enableDecrement: true }', async () => {
        config.default.slack = { enableOverDraw: false, enableDecrement: true }
        const scoreList = getScore({ listType, scoreType })
        expect(scoreList).toEqual([
          { _id: 'USER1', score: 11 },
          { _id: 'USER2', score: 5 },
          { _id: 'USER3', score: 9 },
          { _id: 'USER4', score: 9 }
        ]);
      });


      it('with ENVS: { enableOverDraw: true, enableDecrement: false }', async () => {
        config.default.slack = { enableOverDraw: true, enableDecrement: false }
        const scoreList = getScore({ listType, scoreType })
        expect(scoreList).toEqual([
          { _id: 'USER1', score: 14 },
          { _id: 'USER2', score: 12 },
          { _id: 'USER3', score: 12 },
          { _id: 'USER4', score: 8 }
        ]);
      });


      it('with ENVS: { enableOverDraw: true, enableDecrement: true }', async () => {
        config.default.slack = { enableOverDraw: true, enableDecrement: true }
        const scoreList = getScore({ listType, scoreType })
        expect(scoreList).toEqual([
          { _id: 'USER1', score: 11 },
          { _id: 'USER2', score: 8 },
          { _id: 'USER3', score: 8 },
          { _id: 'USER4', score: 7 }
        ]);
      });


    });
    // describe('with args { listType: from, scoreType: dec }', () => {});
    // describe('with args { listType: from, scoreType: dec }', () => {});
    // describe('with args { listType: from, scoreType: dec }', () => {});



  });

});
