class ArrayDriver {
    data:Array<any>;
    constructor() {
        this.data = [];
    }

    async findFrom(user) {
        const filteredData = this.data.filter(item => item.from == user);
        return await(filteredData);
    }

    async findFromToday(user) {
        const start = new Date();
        const end = new Date();

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        const filteredData = this.data.filter(item => item.from == user && item.given_at.getTime() < end.getTime() && item.given_at.getTime() > start.getTime());

        return await(filteredData);
    }

    async give(to, from) {
        this.data.push({
            to,
            from,
            value: 1,
            given_at: new Date(),
        });

        return await(true);
    }

    async takeAway(to, from) {
        this.data.push({
            to,
            from,
            value: -1,
            given_at:
            new Date(),
        });

        return await(true);
    }

    async getScore(user = null) {
        let { data } = this;

        if (user) {
            data = this.data.filter(item => item.to === user);
        }

        const userScores = {};

        data.forEach((item) => {
            if (!(item.to in userScores)) {
                userScores[item.to] = { _id: item.to, score: 0 };
            }

            userScores[item.to].score += item.value;
        });

        return await((<any>Object).values(userScores));
    }

    async getGiven(user = null) {
        let { data } = this;

        if (user) {
            data = this.data.filter(item => item.from === user);
        }

        const userScores = {};

        data.forEach((item) => {
            if (!(item.from in userScores)) {
                userScores[item.from] = { _id: item.from, score: 0 };
            }

            userScores[item.from].score += item.value;
        });

        return await((<any>Object).values(userScores));
    }

    async getGivers(user) {
        let { data } = this;

        if (user) {
            data = this.data.filter(item => item.to === user);
        }

        const userScores = {};

        data.forEach((item) => {
            if (!(item.from in userScores)) {
                userScores[item.from] = { _id: item.from, score: 0 };
            }

            userScores[item.from].score += item.value;
        });

        return await((<any>Object).values(userScores));
    }
}

export default ArrayDriver
