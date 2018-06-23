module.exports = ((slack, redis) => {
    const res = [];

    if (slack.length === 0) {
        return false;
    }

    redis.forEach((x) => {
        slack.forEach((u) => {
            if ((u.id) && (u.id.match(x.user))) {
                const obj = {
                    username: x.user,
                    name: u.name,
                    score: x.score,
                    avatar: u.avatar,
                };
                res.push(obj);
            }
        });
    });

    return res;
});
