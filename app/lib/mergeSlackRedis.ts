export default ((slack, data) => {
    const res:Array<Object> = [];
    if (slack.length === 0) {
        return false;
    }

    data.forEach((x) => {
        slack.forEach((u) => {
            if ((u.id) && (u.id.match(x._id))) {
                const obj = {
                    username: x._id,
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
