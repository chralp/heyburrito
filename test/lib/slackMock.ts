import { wbcList } from '../data/slackUsers'
class RTMMock {

    start() { }
    on() { }
}

class WebMock {
    users = {
        list: function() {
            return Promise.resolve(wbcList)
        }
    }
}

export {
    RTMMock,
    WebMock
}
