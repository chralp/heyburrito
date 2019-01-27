import drivers from './drivers';
import configInterface from '../types/Config.interface'

function driver(config: configInterface.doc) {
    const driverName = config.DATABASE_DRIVER;
    return drivers[driverName](config);

}

export default driver;
