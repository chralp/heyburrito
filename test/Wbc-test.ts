import { expect } from 'chai';
import { WebMock } from './lib/slackMock'
import WBCHandler from '../src/slack/Wbc';
import { wbcListParsed } from './data/slackUsers';
let wbc: any

beforeEach(() => {
    wbc = new WebMock();
    WBCHandler.register(wbc);
})

describe('Wbc-test', async () => {
    it('fetchSlackUsers, should return object of users and bots', async () => {
        const result = await WBCHandler.fetchSlackUsers();
        expect(result).to.deep.equal(wbcListParsed);
    });
});
