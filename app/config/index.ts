import defaults from './defaults';

// Check if key exist as processEnv
const inEnv = (key: string) => ((key in process.env) ? process.env[key] : null);

export default ((key: string, required: boolean = false) => {

    // Check first if in defaults
    if (defaults[key]) return defaults[key];


    let envKey: string = inEnv(key);

    if (!envKey && required) throw new Error(`Missing ENV key => ${key}`);

    return envKey;
});
