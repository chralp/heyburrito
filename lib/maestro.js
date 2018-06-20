const { EventEmitter } = require('events');

class Store extends EventEmitter {}

const Maestro = new Store();

module.exports = Maestro;
