import defaults from './app/config/defaults';

// Check if key exist as processEnv
const inEnv = (key: string) => ((key in process.env) ? process.env[key] : null);

export default ((key) => {

    if (defaults[key]) return defaults[key];

    let envKey: string = inEnv(key);

    if (!envKey) throw new Error(`Missing ENV key => ${key}`)
});
