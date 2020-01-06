import * as log from 'bog';
import { WebClient } from '@slack/web-api';
import { RTMClient } from '@slack/rtm-api';
import { RTMMock, WebMock } from '../../test/lib/slackMock';
import RTMHandler from './Rtm';
import WBCHandler from './Wbc';
import config from '../config';

const { slackMock } = config.misc;

log.debug('Slack mockApi loaded', slackMock);

export default () => {
    const slackConf = {
        rtm: slackMock ? new RTMMock() : new RTMClient(config.slack.api_token),
        wbc: slackMock ? new WebMock() : new WebClient(config.slack.api_token),
    };

    slackConf.rtm.start();
    RTMHandler.register(slackConf.rtm);
    WBCHandler.register(slackConf.wbc);
};
