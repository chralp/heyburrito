import * as log from 'bog';
import { WebClient, RTMClient } from '@slack/web-api';
import { RTMMock, WebMock } from '../../test/lib/slackMock';
import config from '../config';

const { slackMock } = config.misc;

log.debug('Slack mockApi loaded', slackMock);

export default {
  rtm: slackMock ? new RTMMock() : new RTMClient(config.slack.api_token),
  wbc: slackMock ? new WebMock() : new WebClient(config.slack.api_token),
};
