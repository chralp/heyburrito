const config = (key, fallback = null) => {
    return (key in process.env) ? process.env[key] : fallback;
};

module.exports = config;
