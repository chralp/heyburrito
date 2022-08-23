import log from 'loglevel';
import { WebClient } from '@slack/web-api';
import { RTMClient } from '@slack/rtm-api';
import { RTMMock, WEBMock } from '../../test/lib/slack/slack-mock';
import config from '../config';

const { slackMock } = config.slack;
log.info('Slack mockApi loaded', slackMock);

export default {
  rtm: slackMock ? new RTMMock() : new RTMClient(config.slack.api_token),
  wbc: slackMock ? new WEBMock() : new WebClient(config.slack.api_token),
};
