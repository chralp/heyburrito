const users = document.getElementById("users");
const filter = document.getElementById("filter");
let store = [];

const setLocalStorage = (key, value) => {
    return localStorage.setItem(key, value);
};

const getLocalStorage = (key) => {
    return localStorage.getItem(key);
};

const burritoHost = window.location.hostname;

let listType = getLocalStorage("listType") || "to";
let scoreType = getLocalStorage("scoreType") || "inc";

const filterSwitch = document.getElementById("switchToFromInput");

filterSwitch.checked = listType === "to" ? true : false;

async function fetcher(type, { username, listType, scoreType }) {
    switch (type) {
        case "scoreboard":
            const res = await fetch(`/api/scoreboard/${listType}/${scoreType}`);
            const json = await res.json();
            return json.data;
            break;
        case "userStats":
            const res1 = await fetch(`/api/userstats/${username}`);
            const json1 = await res1.json();
            return json1.data;
            break;
        case "userScore":
            const res2 = await fetch(
                `/api/userscore/${username}/${listType}/${scoreType}`
            );
            const json2 = await res2.json();
            const { data } = json2;
            return json2;
            break;
    }
}

const getScoreBoard = async () => {
    store = await fetcher("scoreboard", { listType, scoreType });
    sortUsers();
    render();
};

getScoreBoard();

filterSwitch.addEventListener("click", async (ev) => {
    const list = listType === "to" ? "from" : "to";
    listType = list;
    setLocalStorage("listType", list);

    store = await fetcher("scoreboard", { listType, scoreType });
    sortUsers();
    render();
});

function sortUsers(sort = false) {
    let data = store;

    if (sort) data.sort((a, b) => Math.sign(b.score - a.score));

    store = data.map((item, i) => {
        const mappedItem = Object.assign({}, item);
        const position = i + 1;

        mappedItem.last_position =
            "position" in mappedItem ? mappedItem.position : 0;
        mappedItem.position = position;

        return mappedItem;
    });
}

function displayItem(element, wait, rerender) {
    setTimeout(() => {
        element.classList.add("display");

        setTimeout(() => {
            element.classList.add("displayed");

            if (rerender) {
                setTimeout(() => {
                    sortUsers();
                    render(true);
                }, 1000);
            }
        }, 300);
    }, wait);
}

async function displayStats(data, element) {
    const statsEl = element.querySelector(".scoreboard__user__stats");

    if (statsEl.classList.contains("display")) {
        statsEl.style.cssText = "height: 0px";
        statsEl.classList.remove("display");
    } else {
        const res = await fetcher("userStats", { username: data.username });
        addStats(res);
    }
}

function addStatsRow(user, container) {
    const html = `
        <li>
            <img class="avatar" width="30" height="30" src="${user.avatar}">
            <strong>${user.name}</strong>
            <span class="score mini good">${user.scoreinc}&nbsp;&nbsp;&nbsp;</span>
            <span class="score mini bad">${user.scoredec}&nbsp;&nbsp;&nbsp;</span>
        </li>
    `;

    container.appendChild(
        document.createRange().createContextualFragment(html)
    );
}

function addUserInfo(user, container) {
    const html = `
<div class="scoreboard__user__stats__column" >

<div class="scoreboard__user__stats__title"><strong>전체</strong></div>
  <ol class="scoreboard__user__stats__list">
    <li>
      <strong>받은 덕</strong>
      <span class="score mini">${user.received}</span>
    </li>
    <li>
      <strong>준 덕</strong>
      <span class="score mini">${user.given}</span>
    </li>
  </ol>
</div>

<div class="scoreboard__user__stats__column">
  <div class="scoreboard__user__stats__title"><strong>오늘</strong></div>

  <ol class="scoreboard__user__stats__list">
    <li>
      <strong>받은 덕</strong>
      <span class="score mini">${user.receivedToday}</span>
    </li>
    <li>
      <strong>준 덕</strong>
      <span class="score mini">${user.givenToday}</span>
    </li>
  </ol>
</div>`;

    container.innerHTML = html;
}
function addStats(data) {
    const element = document.getElementById(`user:${data.user.username}`);
    const statsEl = element.querySelector("[data-stats]");
    const infoEl = element.querySelector("[data-info]");
    const todayFromEl = element.querySelector("[data-today-from]");
    const todayToEl = element.querySelector("[data-today-to]");

    const fromEl = element.querySelector("[data-from]");
    const toEl = element.querySelector("[data-to]");

    fromEl.innerHTML = "";
    toEl.innerHTML = "";
    todayFromEl.innerHTML = "";
    todayToEl.innerHTML = "";

    addUserInfo(data.user, infoEl);
    if (data.givenToday) {
        data.givenToday.forEach((user) => addStatsRow(user, todayToEl));
    }

    if (data.receivedToday) {
        data.receivedToday.forEach((user) => addStatsRow(user, todayFromEl));
    }

    if (data.given) {
        data.given.forEach((user) => addStatsRow(user, toEl));
    }

    if (data.received) {
        data.received.forEach((user) => addStatsRow(user, fromEl));
    }

    requestAnimationFrame(() => {
        statsEl.classList.add("display");
        statsEl.style.cssText = `
            position: absolute;
            left: 0;
            right: 0;
            height: auto;
            transition: none;
        `;

        requestAnimationFrame(() => {
            const height = statsEl.getBoundingClientRect().height;

            statsEl.style.cssText = "";

            requestAnimationFrame(() => {
                statsEl.style.cssText = `height: ${height}px`;
            });
        });
    });
}

const level = (l) => Array(l).fill(burrito).join(" ");

function createElement(data, display) {
    const element = document.createElement("article");
    element.className = "scoreboard__user";
    element.id = `user:${data.username}`;

    if (display) {
        element.className += " display";
    }

    element.setAttribute("data-uuid", data.username);
    element.setAttribute("data-score", data.score);

    element.innerHTML = `
 <div class="scoreboard__user__row scoreboard__user__summary">
<div><span class="score position mini">${data.position}.</span></div>

  <div>
    <img class="avatar" width="48" height="48" src="${data.avatar}" alt="">
  </div>
  <div class="displayname">${data.name}
<span data-element="level" class="level">${
        data.level ? level(data.level) : ""
    }</span>
</div>
  <div><span data-element="score" class="score">${data.score}</span></div>
</div>


<div class="scoreboard__user__stats" data-stats>


  <div class="scoreboard__user__stats__info" data-info>
  </div>


  <div class="scoreboard__user__stats__today">

    <div class="scoreboard__user__stats__column">
<div class="scoreboard__user__stats__title"><strong>오늘 받은 덕</strong></div>
      <ol class="scoreboard__user__stats__list" data-today-from>
      </ol>
    </div>

    <div class="scoreboard__user__stats__column">
      <strong class="scoreboard__user__stats__title">오늘 준 덕</strong>
      <ol class="scoreboard__user__stats__list" data-today-to>
      </ol>
    </div>

  </div>


  <div class="scoreboard__user__stats__column">
    <strong class="scoreboard__user__stats__title">전체 받은 덕</strong>
    <ol class="scoreboard__user__stats__list" data-from>
    </ol>
  </div>

  <div class="scoreboard__user__stats__column">
    <strong class="scoreboard__user__stats__title">전체 준 덕</strong>
    <ol class="scoreboard__user__stats__list" data-to>
    </ol>
  </div>

</div>
    `;

    element
        .querySelector(".scoreboard__user__summary")
        .addEventListener("click", () => displayStats(data, element), false);
    return element;
}

function newPosition(element) {
    const newClass = " pulse animated";
    element.className += newClass;

    setTimeout(() => {
        element.className = element.className.replace(newClass, "").trim();
    }, 1000);
}

function render(refresh) {
    const wait = 200;
    let currentWait = 0;

    users.innerHTML = "";
    const top20 = store.slice(0, 20);
    store.forEach((item) => {
        currentWait += wait;

        const element = createElement(item, refresh);
        users.appendChild(element);

        if (refresh) {
            if (item.last_position !== item.position) {
                newPosition(element);
            }
        } else {
            displayItem(element, currentWait);
        }
    });
}

function appendUser(data) {
    store.push(data);

    const element = createElement(data);

    users.appendChild(element);

    displayItem(element, 200, true);
}

function updateUser(data, direction, item, burritoType) {
    const score = data.score;
    const scoreEl = item.querySelector('[data-element="score"]');
    const className =
        direction === "up" ? " tada animated good" : " shake animated bad";

    item.setAttribute("data-score", score);
    scoreEl.innerHTML = score;

    let scoreUpdated = false;

    store = store.slice().map((user) => {
        let uppdatedUser = Object.assign({}, user);

        if (user.username === data.username && user.score !== data.score) {
            uppdatedUser.score = data.score;
            scoreUpdated = true;
        }
        return uppdatedUser;
    });

    if (scoreUpdated) {
        scoreEl.className += className;

        setTimeout(() => {
            scoreEl.className = scoreEl.className.replace(className, "").trim();
            setTimeout(() => {
                sortUsers(true);
                render(true);
            }, 1500);
        }, 1000);
    }
}

function updateScore(data, direction, burritoType) {
    const item = document.querySelector(`[data-uuid="${data.username}"]`);

    if (item) {
        updateUser(data, direction, item, burritoType);
    } else {
        appendUser(data, burritoType);
    }
}

hey.on("GIVE", async (input) => {
    const username = input[listType];
    const { data } = await fetcher("userScore", {
        username,
        listType,
        scoreType,
    });
    const direction = data.scoreType === "inc" ? "up" : "down";
    const burritoType = data.scoreType === "inc" ? "burrito" : "rottenburrito";
    updateScore(data, direction, burritoType);
});

hey.on("TAKE_AWAY", async (input) => {
    const username = input[listType];
    const { data } = await fetcher("userScore", {
        username,
        listType,
        scoreType,
    });
    const direction = data.scoreType === "inc" ? "up" : "down";
    const burritoType = data.scoreType === "inc" ? "burrito" : "rottenburrito";
    updateScore(data, direction, burritoType);
});
