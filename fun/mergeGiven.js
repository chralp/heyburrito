module.exports = ((slackUsers, given) => {
    const counts = {};

    for (let i = 0; i < given.length; i += 1) {
        counts[given[i]] = 1 + (counts[given[i]] || 0);
    }

    const res = [];

    slackUsers.forEach((x) => {
        if (counts[x.id]) {
            const obj = {
                id: x.id,
                name: x.name,
                score: counts[x.id],
            };

            res.push(obj);
        }
    });

    return res;
});
