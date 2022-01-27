import { calculateScore } from '../src/store/calc'
import * as config from '../src/config';
import { scoreBoard } from './data/calculatescore-data';


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

  // describe('userscore', () => {
  //   it('User1 score should be 3 { enableOverDraw: false, enableDecrement: false }', () => {
  //     config.default.slack = { enableOverDraw: false, enableDecrement: false }
  //     const result = calculateScore(data, [], { listType: 'to', scoreType: 'inc', user: 'USER1' })
  //     expect(result).toEqual(3)
  //   });

  //   it('User1 score should be 4 { enableOverDraw: true, enableDecrement: false }', () => {
  //     config.default.slack = { enableOverDraw: true, enableDecrement: false }
  //     const result = calculateScore(data, [], { listType: 'to', scoreType: 'inc', user: 'USER1' })
  //     expect(result).toEqual(4)
  //   });

  //   it('User1 score should be 3 with overdrawn data { enableOverDraw: true, enableDecrement: false }', () => {
  //     config.default.slack = { enableOverDraw: true, enableDecrement: false }
  //     const overdrawn = [
  //       {
  //         to: 'USER2',
  //         from: 'USER1',
  //         value: 1,
  //         overdrawn: true
  //       },
  //       {
  //         to: 'USER2',
  //         from: 'USER3',
  //         value: 1,
  //         overdrawn: true
  //       },
  //     ]
  //     const result = calculateScore(data, overdrawn, { listType: 'to', scoreType: 'inc', user: 'USER1' })
  //     expect(result).toEqual(3)
  //   });

  //   it('User1 score should be 2 with overdrawn data { enableOverDraw: true, enableDecrement: false }', () => {
  //     config.default.slack = { enableOverDraw: true, enableDecrement: false }
  //     const overdrawn = [
  //       {
  //         to: 'USER2',
  //         from: 'USER1',
  //         value: 1,
  //         overdrawn: true
  //       },
  //       {
  //         to: 'USER2',
  //         from: 'USER1',
  //         value: 1,
  //         overdrawn: true
  //       },
  //       {
  //         to: 'USER2',
  //         from: 'USER3',
  //         value: 1,
  //         overdrawn: true
  //       },
  //     ]
  //     const result = calculateScore(data, overdrawn, { listType: 'to', scoreType: 'inc', user: 'USER1' })
  //     expect(result).toEqual(2)
  //   });

  //   it('User1 score should be 2 { enableOverDraw: false, enableDecrement: true }', async () => {
  //     config.default.slack = { enableOverDraw: false, enableDecrement: true }
  //     const result = calculateScore(data, [], { listType: 'to', scoreType: 'inc', user: 'USER1' })
  //     expect(result).toEqual(2)
  //   });

  // });

  describe('scoreboard', () => {

    it('Should calc scoreboard => to & inc => { enableOverDraw: false, enableDecrement: false }', async () => {
      config.default.slack = { enableOverDraw: false, enableDecrement: false }
      const listType = 'to';
      const scoreType = 'inc'
      const scoreList = getScore({ listType, scoreType })
      expect(scoreList).toEqual([{ _id: 'USER1', score: 9 }, { _id: 'USER2', score: 5 }])
    });


    it('Should calc scoreboard => to & inc => { enableOverDraw: true, enableDecrement: false }', async () => {
      config.default.slack = { enableOverDraw: true, enableDecrement: false }
      const listType = 'to';
      const scoreType = 'inc'
      const scoreList = getScore({ listType, scoreType })
      expect(scoreList).toEqual([{ _id: 'USER1', score: 4 }, { _id: 'USER2', score: 10 }])
    });


    it('Should calc scoreboard => to & inc => { enableOverDraw: false, enableDecrement: true }', async () => {
      config.default.slack = { enableOverDraw: false, enableDecrement: true }
      const listType = 'to';
      const scoreType = 'inc'
      const scoreList = getScore({ listType, scoreType })
      expect(scoreList).toEqual([{ _id: 'USER1', score: 8 }, { _id: 'USER2', score: 8 }])
    });


    it('Should calc scoreboard => to & dec => { enableOverDraw: false, enableDecrement: false }', async () => {
      config.default.slack = { enableOverDraw: false, enableDecrement: false }
      const listType = 'to';
      const scoreType = 'dec'

      const scoreList = getScore({ listType, scoreType })
      expect(scoreList).toEqual([{ _id: 'USER1', score: 1 }, { _id: 'USER2', score: 2 }])
    });


    it('Should calc scoreboard => to & dec => { enableOverDraw: true, enableDecrement: false }', async () => {
      config.default.slack = { enableOverDraw: false, enableDecrement: false }
      const listType = 'to';
      const scoreType = 'dec'
      const scoreList = getScore({ listType, scoreType })
      console.log("scoreBoard", scoreBoard)
      console.log("List", scoreList)
      expect(scoreList).toEqual([{ _id: 'USER1', score: 1 }, { _id: 'USER2', score: 2 }])
    });



    // test listType from
    // test scoreType dec

  //   it('Should calc scoreboard => from & inc => { enableOverDraw: false, enableDecrement: false }', async () => {
  //     config.default.slack = { enableOverDraw: false, enableDecrement: false }
  //     const listType = 'from';
  //     const scoreType = 'inc'
  //     const uniqueUsername: string[] = [...new Set(scoreBoard.map((x) => x[listType]))];

  //     const scoreList = uniqueUsername
  //       .map((user) => ({ _id: user, score: calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user }) }))
  //       .map((entry) => (entry.score !== 0) ? entry : null).filter(y => y);

  //     expect(scoreList).toEqual([{ _id: 'USER2', score: 9 }, { _id: 'USER1', score: 5 }])
  //   });

  //   it('Should calc scoreboard => from & inc => { enableOverDraw: true, enableDecrement: false }', async () => {
  //     config.default.slack = { enableOverDraw: true, enableDecrement: false }
  //     const listType = 'from';
  //     const scoreType = 'inc'
  //     const uniqueUsername: string[] = [...new Set(scoreBoard.map((x) => x[listType]))];

  //     const scoreList = uniqueUsername
  //       .map((user) => ({ _id: user, score: calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user }) }))
  //       .map((entry) => (entry.score !== 0) ? entry : null).filter(y => y);
  //     expect(scoreList).toEqual([{ _id: 'USER2', score: 9 }, { _id: 'USER1', score: 10 }])
  //   });


  //   it('Should calc scoreboard => from & inc => { enableOverDraw: false, enableDecrement: true }', async () => {
  //     config.default.slack = { enableOverDraw: false, enableDecrement: true }
  //     const listType = 'from';
  //     const scoreType = 'inc'
  //     const uniqueUsername: string[] = [...new Set(scoreBoard.map((x) => x[listType]))];

  //     const scoreList = uniqueUsername
  //       .map((user) => ({ _id: user, score: calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user }) }))
  //       .map((entry) => (entry.score !== 0) ? entry : null).filter(y => y);

  //     console.log("scoreBoard", scoreBoard)
  //     console.log("scoreList", scoreList)
  //     expect(scoreList).toEqual([{ _id: 'USER2', score: 9 }, { _id: 'USER1', score: 10 }])
  //   });


  //   it('Should calc scoreboard => from & dec => { enableOverDraw: false, enableDecrement: false }', async () => {
  //     config.default.slack = { enableOverDraw: true, enableDecrement: false }
  //     const listType = 'from';
  //     const scoreType = 'inc'
  //     const uniqueUsername: string[] = [...new Set(scoreBoard.map((x) => x[listType]))];

  //     const scoreList = uniqueUsername
  //       .map((user) => ({ _id: user, score: calculateScore(scoreBoard, scoreBoard, { listType, scoreType, user }) }))
  //       .map((entry) => (entry.score !== 0) ? entry : null).filter(y => y);
  //     console.log("scoreBoard", scoreBoard)
  //     console.log("scoreList", scoreList)
  //     expect(scoreList).toEqual([{ _id: 'USER2', score: 9 }, { _id: 'USER1', score: 10 }])
  //   });


  });

});
