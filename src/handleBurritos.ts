import log from 'loglevel';
import config from './config';
import BurritoStore from './store/BurritoStore';
import { notifyUser } from './bot';
import { Updates, Update } from './lib/parseMessage';

const {
  enableDecrement,
  enableOverDraw,
  dailyCap,
  dailyDecCap,
  overdrawCap,
} = config.slack;

const give = async (update: Updates) => {
  return await BurritoStore.give(update);
};

const giveBurritos = async (updates: Updates[]) => {
  const { enableDecrement } = config.slack;
  return updates.reduce(async (prev: any, { type, ...burrito }: Updates) => {
    return prev.then(async () => {
      if (type === 'inc' || type === 'dec' && !enableDecrement) return await give({ ...burrito, type });

      const receiverScore: number = await BurritoStore.getUserScore(burrito.to, 'to', 'inc');
      if (receiverScore > 0) return await give({ ...burrito, type });
    });
  }, Promise.resolve());
};

const handleUpdates = async (giver: string, updates: Updates[], scoreType: string) => {
  const { enableDecrement, enableOverDraw } = config.slack;
  log.debug("handleUpdates => scoreType => ", scoreType);
  log.debug("handleUpdates => enableOverDraw => ", enableOverDraw);
  log.debug("handleUpdates => enableDecrement => ", enableDecrement);
  log.debug("handleUpdates => dailyCap => ", dailyCap);
  log.debug("handleUpdates => dailyDecCap => ", dailyDecCap);
  log.debug("handleUpdates => overdrawCap => ", overdrawCap);
  log.debug("handleUpdates => args => giver => ", giver);
  log.debug("handleUpdates => args => updates => ", updates);
  log.debug("handleUpdates => args => scoreType: => ", scoreType);

  const burritoType = (scoreType === 'inc') ? 'burrito' : 'rottenburrito';
  const cap = (scoreType === 'inc') ? dailyCap : dailyDecCap;

  // GivenToday
  const GT = await BurritoStore.givenToday(giver, 'from', scoreType);
  // GivenToday Overdrawn
  const GTO = await BurritoStore.givenToday(giver, 'from', scoreType, true);
  // Total Given today
  const TGT = GT + GTO;
  const dailyDiff = cap - GT;
  const dailyDiffTotal = cap + overdrawCap - TGT;

  // Send right total in message, so we dont send -<amount> if overdrawn was disabled the same day.
  const messTotal = enableOverDraw ? dailyDiffTotal : dailyDiff;
  console.log(!(dailyDiffTotal >= updates.length))
  console.log("dailyDiffTotal", dailyDiffTotal)
  // Check if user can send all updates.
  if(!(dailyDiffTotal >= updates.length)) return notifyUser(giver, `You are trying to give away ${updates.length} ${burritoType}, but you only have ${messTotal} ${burritoType} left today!`);

  // Check if update.length exceeds dailyDiff
  if(!(dailyDiff >= updates.length)) {
    console.log("AHA?")
    /**
     * When overdraw we want to do a credit check of giver first.
     * Giver needs to be able to pay the bill.
     * ( Lowest userScore can be 0 ) */
    const giverScore = await BurritoStore.getUserScore(giver, 'to', scoreType);
    if (!(giverScore >= updates.length)) return notifyUser(giver, `Trying to give more ${burritoType}s then u have`);
    console.log("AHA?2")

  }

  /**
   * We want to first handle the all the updates that we can as daily given ( from dailyCap ).
   * So we need to slice out the entries that we want to count as daily. */
  const countAsDaily = updates.slice(0, dailyDiff);
  if (countAsDaily.length) await giveBurritos(countAsDaily);

  // Get the rest entries and count them as overDrawn
  const overDrawnUpdates = updates.slice(dailyDiff);
  console.log("overDrawnUpdates", overDrawnUpdates)
  // When overdraw we want to add type overdrawn
  const updatesOverDrawn = overDrawnUpdates.map(({ ...all }) => ({ ...all, overdrawn: true }));
  return await giveBurritos(updatesOverDrawn);
};

export const handleBurritos = async (giver: string, updates: Updates[]) => {
  const { enableDecrement } = config.slack;

  /**
   * We want to handle burritos differently depending on ENVs.
   * If enableDecrement is true we want to handle all types of updates ( inc / dec ) against dailyCap.
   * Else we want to handle them separately.
   * Type inc => dailyCap
   * Type dec => dailyDecCap */
  if (enableDecrement) {
    const givenToday = await BurritoStore.givenToday(giver, 'from');
    const diff = dailyCap - givenToday;
    if (updates.length > diff) return notifyUser(giver, `You are trying to give away ${updates.length} burritos, but you only have ${diff} burritos left today!`);
    if (givenToday >= dailyCap) return false;

    await giveBurritos(updates);
  } else {

    const incUpdates = updates.filter(({ type }) => type === 'inc');
    const decUpdates = updates.filter(({ type }) => type === 'dec');
    if (incUpdates.length) await handleUpdates(giver, incUpdates, 'inc');
    if (decUpdates.length) await handleUpdates(giver, decUpdates, 'dec');

  };
  return true;
};
