
import BurritoStore from '../app/store/BurritoStore';
import { default as log } from 'bog'
import redis from 'redis'


const conf = {
    "redis": {
        "host": "redis.host.tld",
        "port": 6379
    }
}


// Username prefix-fix
const receivedKey = (username: string) => `${username}:received`;
const receivedLogKey = (username: string) => `${username}:receivedLog`;
const givenKey = (username: string) => `${username}:given`;

function importFromRedis() {

    log.info("Staring redis flow")

    // Redis config
    const client = redis.createClient(conf.redis);

    function getter(key: string) {
        return new Promise((resolve, reject) => {
            client.get(key, (error, value) => {
                if (error) {
                    reject();
                }
                resolve(value);
            });
        });
    }

    function getUserScores(user: string) {
        return new Promise((rs) => {
            client.keys(user, (err, keys) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (keys) {
                    const waitFor = keys.map((key: string) => getter(key).then(score => ({
                        user: key.split(':')[0],
                        score,
                    })));

                    Promise.all(waitFor).then((res) => {
                        rs(res);
                    });
                }
            });
        });
    }

    // Get list of givers for user
    function getGivers(user) {
        return new Promise((rs) => {
            client.lrange(receivedLogKey(user), 0, -1, (err, keys) => {
                rs(keys);
            });
        });
    }

    // Retunerar siffra enbart
    function getGiven(user: string) {
        return getter(givenKey(user));
    }

    // Daily cap
    function getFullScore(user = "*") {
        return getUserScores(receivedKey(user));
    }

    function getUserScore(user) {
        return getUserScores(receivedKey(user));
    }

    function givePort(to: string, from: string) {
        return BurritoStore.giveBurrito(to, from)
    }


    getFullScore().then((data: any) => {
        for (const u of data) {

            getGivers(u.user).then((res: any) => {
                const total = u.score
                const resTot = res.length
                //res.forEach(x => {
                //    givePort(u.user, x)
                //})
                const diff = total - resTot
                console.log("================")
                console.log("Total", total)
                console.log("resTot", resTot)
                console.log("DIFF", diff)
                console.log("================")
                for (var i = 0; i < diff; i++) {
                    // "UB60B8FPG" = heyburritoBot
                    givePort(u.user, "UB60B8FPG")
                }
            })

        }
    })
}




export default importFromRedis;
