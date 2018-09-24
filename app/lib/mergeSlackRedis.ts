export default ((slack, data) => {
    const res:Array<object> = [];
    if (slack.length === 0) {
        return [];
    }

    data.forEach((x) => {
        slack.forEach((u) => {
            if ((u.id) && (u.id.match(x._id))) {
                const obj:object = {
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
