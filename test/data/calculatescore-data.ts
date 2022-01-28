

/**
 * --------------------------
 * listType: to, scoreType: inc, enableOverDraw: false, enableDecrement: false
 * Res = 14
 * --------------------------
 * listType: to, scoreType: inc, enableOverDraw: false, enableDecrement: true
 * Res = 11
 * --------------------------
 * listType: to, scoreType: inc, enableOverDraw: true, enableDecrement: false
 * Res = 10
 * --------------------------
 * listType: to, scoreType: inc, enableOverDraw: true, enableDecrement: true
 * Res = 7
 * --------------------------
 * listType: to, scoreType: dec, enableOverDraw: false, enableDecrement: false
 * Res = 3
 * --------------------------
 */

// 18 ALL INC
// 14 overdrawn: false
// 3 decrement
// 4 overDrwan
// 11 = ALL ENABLED
export const user1ScoreData = [
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
  { to: 'USER1', from: 'USER4', value: 1, overdrawn: true },
]

/**
 * --------------------------
 * listType: to, scoreType: inc, enableOverDraw: false, enableDecrement: false
 * Res = 9
 * --------------------------
 * listType: to, scoreType: inc, enableOverDraw: false, enableDecrement: true
 * Res = 5
 * --------------------------
 * listType: to, scoreType: inc, enableOverDraw: true, enableDecrement: false
 * Res = 9
  * --------------------------
 * listType: to, scoreType: inc, enableOverDraw: true, enableDecrement: true
 * Res = 5
 * --------------------------
  * listType: to, scoreType: dec, enableOverDraw: false, enableDecrement: false
 * Res = 4
 * --------------------------
 */

// 12 ALL INC
// 9 overdrawn: false
// 4 decrement
// 0 overDrwan
// 8 = ALL ENABLED
export const user2ScoreData = [
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
  { to: 'USER2', from: 'USER4', value: 1, overdrawn: false },
]


/**
 * --------------------------
 * listType: to, scoreType: inc, enableOverDraw: false, enableDecrement: false
 * Res = 13
 * --------------------------
 * listType: to, scoreType: inc, enableOverDraw: false, enableDecrement: true
 * Res = 9
 * --------------------------
 * listType: to, scoreType: inc, enableOverDraw: true, enableDecrement: false
 * Res = 9
 * --------------------------
 * listType: to, scoreType: inc, enableOverDraw: true, enableDecrement: true
 * Res = 9
 * --------------------------
 * listType: to, scoreType: dec, enableOverDraw: false, enableDecrement: false
 * Res = 4
 * --------------------------
 */

// 16 ALL INC
// 13 overdrawn: false
// 4 decrement
// 4 overDrwan
// 8 = ALL ENABLED
export const user3ScoreData = [
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
  { to: 'USER3', from: 'USER4', value: 1, overdrawn: false },
]

/**
 * --------------------------
 * listType: to, scoreType: inc, enableOverDraw: false, enableDecrement: false
 * Res = 10
 * --------------------------
 * listType: to, scoreType: inc, enableOverDraw: false, enableDecrement: true
 * Res = 9
 * --------------------------
 * listType: to, scoreType: inc, enableOverDraw: true, enableDecrement: false
 * Res = 8
 * --------------------------
 * listType: to, scoreType: inc, enableOverDraw: true, enableDecrement: true
 * Res = 7
 * --------------------------
 * listType: to, scoreType: dec, enableOverDraw: false, enableDecrement: false
 * Res = 1
 * --------------------------
 */
// 10 ALL INC
// 10 overdrawn: false
// 1 decrement
// 2 overDrwan
// 7 = ALL ENABLED
export const user4ScoreData = [
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
  { to: 'USER4', from: 'USER2', value: 1, overdrawn: false },
]

export const scoreBoard = [
  ...user1ScoreData,
  ...user2ScoreData,
  ...user3ScoreData,
  ...user4ScoreData
]
