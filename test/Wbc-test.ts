import { WebMock } from './lib/slackMock'
import { stub } from 'sinon';
import { expect } from 'chai';
import WBCHandler from '../src/slack/Wbc';
import { wbcListParsed } from './data/slackUsers';
let wbc
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
