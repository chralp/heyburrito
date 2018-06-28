const config = (key, fallback = null) => ((key in process.env) ? process.env[key] : fallback);

module.exports = config;
