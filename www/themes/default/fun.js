const users = document.getElementById('users');
let store = [];

hey.on('open', function () {
    hey.get('getReceivedList', { type: 'burrito', sort: 'points', order: 'asc', take: 5, skip: 0 });
});

hey.on('receivedList', (data) => {
    store = data;

    sortUsers();
    render();
});

hey.on('userStats', addStats);

function sortUsers() {
    store.sort((a, b) => Math.sign(b.score - a.score));

    store = store.map((item, i) => {
        const mappedItem = Object.assign({}, item);
        const position = i + 1;

        mappedItem.last_position = ('position' in mappedItem) ? mappedItem.position : 0;
        mappedItem.position = position;

        return mappedItem;
    });
}

function displayItem(element, wait, rerender) {
    setTimeout(() => {
        element.classList.add('display');

        setTimeout(() => {
            element.classList.add('displayed');

            if (rerender) {
                setTimeout(() => {
                    sortUsers();
                    render(true);
                }, 1000);
            }
        }, 300);
    }, wait);
}

function displayStats(data, element) {
    const statsEl = element.querySelector('.scoreboard__user__stats');

    if (statsEl.classList.contains('display')) {
        statsEl.style.cssText = 'height: 0px';
        statsEl.classList.remove('display');
    } else {
        hey.get('getUserStats', data.username);
    }
}

function addStatsRow(user, container) {
    const html = `
        <li>
            <img width="30" height="30" src="${user.avatar}">
            <strong>${user.name}</strong>
            <span class="score">${user.score}</span>
        </li>
    `;

    container.appendChild(document.createRange().createContextualFragment(html));
}

function addStats(data) {
    console.log(data)
    const element = document.getElementById(`user:${data.user.username}`);
    const statsEl = element.querySelector('[data-stats]');
    const fromEl = element.querySelector('[data-from]');
    const toEl = element.querySelector('[data-to]');

    fromEl.innerHTML = '';
    toEl.innerHTML = '';




    if (data.gived) {
        console.log("hejsan")
        data.gived.sort((a, b) => Math.sign(b.score - a.score));
        data.gived.forEach((user) => addStatsRow(user, toEl));
    }

    if (data.givers) {
         data.givers.sort((a, b) => Math.sign(b.score - a.score));
        data.givers.forEach((user) => addStatsRow(user, fromEl));
    }

    requestAnimationFrame(() => {
        statsEl.classList.add('display');
        statsEl.style.cssText = `
            position: absolute;
            left: 0;
            right: 0;
            height: auto;
            transition: none;
        `;

        requestAnimationFrame(() => {
            const height = statsEl.getBoundingClientRect().height;

            statsEl.style.cssText = '';

            requestAnimationFrame(() => {
                statsEl.style.cssText = `height: ${height}px`;
            });
        });
    });
}

function createElement(data, display) {
    const element = document.createElement('article');

    element.className = 'scoreboard__user';
    element.id = `user:${data.username}`;

    if (display) {
        element.className += ' display';
    }

    element.setAttribute('data-uuid', data.username);
    element.setAttribute('data-score', data.score);

    element.innerHTML = `
        <div class="scoreboard__user__row scoreboard__user__summary">
            <div>
                <img width="48" height="48" src="${data.avatar}" alt="">
            </div>
            <div>${data.name}</div>
            <div><span data-element="score" class="score">${data.score}</span></div>
        </div>
        <div class="scoreboard__user__stats" data-stats>
            <div class="scoreboard__user__stats__column">
                <strong class="scoreboard__user__stats__title">From</strong>

                <ol class="scoreboard__user__stats__list" data-from>
                </ol>
            </div>
            <div class="scoreboard__user__stats__column">
                <strong class="scoreboard__user__stats__title">To</strong>

                <ol class="scoreboard__user__stats__list" data-to>
                </ol>
            </div>
        </div>
    `;

    element.querySelector('.scoreboard__user__summary').addEventListener('click', () => displayStats(data, element), false);

    return element;
}

function newPosition(element) {
    const newClass = ' pulse animated';
    element.className += newClass;

    setTimeout(() => {
        element.className = element.className.replace(newClass, '').trim();
    }, 1000);
}

function render(refresh) {
    const wait = 200;
    let currentWait = 0;

    users.innerHTML = '';
    const top20 = store.slice(0,20)
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

function updateUser(data, direction, item) {
    const score = data.score;
    const scoreEl = item.querySelector('[data-element="score"]');
    const className = (direction === 'up') ? ' tada animated good' : ' shake animated bad';

    item.setAttribute('data-score', score);
    scoreEl.innerHTML = score;
    scoreEl.className += className;

    store = store.slice().map((user) => {
        const uppdatedUser = Object.assign({}, user);

        if (user.username === data.username) {
            uppdatedUser.score = data.score;
        }

        return uppdatedUser;
    });

    setTimeout(() => {
        scoreEl.className = scoreEl.className.replace(className, '').trim();

        setTimeout(() => {
            sortUsers();
            render(true);
        }, 1500);
    }, 1000);
}

function updateScore(data, direction) {
    const item = document.querySelector(`[data-uuid="${data.username}"]`);

    if (item) {
        updateUser(data, direction, item);
    } else {
        appendUser(data);
    }
}

hey.on('GIVE', (data) => {
    updateScore(data, 'up');
    rainBurritos();
});

hey.on('TAKE_AWAY', (data) => {
    updateScore(data, 'down');
});

function rainBurritos(){
    for (i = 0; i < 50; i++) {
        document.getElementById("rain").innerHTML+= `<i class="rain burrito-rain">🌯</i>`
    }

    setTimeout(() => {
        var i, elements = document.getElementsByClassName('rain');
        for (i = elements.length; i--;) {
            elements[i].parentNode.removeChild(elements[i]);
        }
    }, 15000)
}
