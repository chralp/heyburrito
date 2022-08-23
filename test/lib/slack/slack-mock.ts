import { wbcList } from '../../data/slackUsers'
import { EventEmitter } from 'events';

export class RTMMock extends EventEmitter {

  start() {
    return Promise.resolve(true);
  }

  // Function to test emits
  async publish(message: any) {
    this.emit('message', message);
  }
}

export class WEBMock {
  users = {
    list: () => {
      return Promise.resolve(wbcList)
    }
  };

  chat = {
    postMessage: (data) => {
      return Promise.resolve(data)
    }
  }
  sendDM = {
    postMessage: (data) => {
      return Promise.resolve(data)
    }
  };

}
