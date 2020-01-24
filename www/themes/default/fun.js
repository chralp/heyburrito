const users = document.getElementById('users');
const filter = document.getElementById('filter');

let store = [];

const setLocalStorage = (key, value) => {
    return localStorage.setItem(key, value);
};

const getLocalStorage = (key) => {
    return localStorage.getItem(key);
};

let listType = getLocalStorage('listType') || 'to';
let scoreType = getLocalStorage('scoreType') || 'inc';
let userType = getLocalStorage('userType') || 'member';

const filteraSwitch = document.getElementById('switchToFromInput');
const filterbSwitch = document.getElementById('switchTypeInput');
const filtercSwitch = document.getElementById('switchUserTypesInput');

filteraSwitch.checked = (listType === 'to' ) ? true : false;;
filterbSwitch.checked = (scoreType === 'inc' ) ? true : false;
filtercSwitch.checked = (userType === 'member' ) ? true : false;

async function fetcher (type, {username,listType, scoreType}) {
    switch (type) {
    case 'scoreboard':
        const res = await fetch(`http://localhost:3333/api/scoreboard/${listType}/${scoreType}`);
        const json = await res.json();
        console.log(listType, scoreType,JSON);
        return json.data;
        break;
    case 'userStats':
        const res1 = await fetch(`http://localhost:3333/api/userstats/${username}`);
        const json1 = await res1.json();
        return json1.data;
        break;
    }
};

const getScoreBoard = async() => {
    store = await fetcher('scoreboard',{listType, scoreType});
    sortUsers();
    render();
};

getScoreBoard();



filteraSwitch.addEventListener('click', async (ev) => {
    const list = (listType === 'to') ? 'from' : 'to';
    listType = list;
    setLocalStorage('listType',list);

    store = await fetcher('scoreboard',{listType, scoreType});
    sortUsers();
    render();
});

filterbSwitch.addEventListener('click', async (ev) => {
    const score = (scoreType === 'inc') ? 'dec' : 'inc';
    scoreType = score;
    setLocalStorage('scoreType',score);
    store = await fetcher('scoreboard',{listType, scoreType});
    sortUsers();
    render();
});

filtercSwitch.addEventListener('click', async (ev) => {
    const memberType = (userType === 'member') ? 'all' : 'member';
    userType = memberType;
    setLocalStorage('userType',memberType);
    store = await fetcher('scoreboard',{listType, scoreType});
    sortUsers();
    render();
});



function sortUsers() {

    let data;

    if(userType === 'member'){
        data = store.filter(item => item.memberType === userType);
    }else{
        data = store;
    }

    store = data.map((item, i) => {
            const mappedItem = Object.assign({}, item);
            const position = i + 1;

            mappedItem.last_position = ('position' in mappedItem) ? mappedItem.position : 0;
            mappedItem.position = position;

            return mappedItem;
    })
    console.log("HEJ", store);
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

async function displayStats(data, element) {
    const statsEl = element.querySelector('.scoreboard__user__stats');

    if (statsEl.classList.contains('display')) {
        statsEl.style.cssText = 'height: 0px';
        statsEl.classList.remove('display');
    } else {
        const res = await fetcher("userStats", {username: data.username});
        addStats(res);
    }
}

function addStatsRow(user, container) {
    const html = `
        <li>
            <img class="avatar" width="30" height="30" src="${user.avatar}">
            <strong>${user.name}</strong>
            <span class="score mini good">${user.scoreinc}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span class="score mini bad">${user.scoredec}</span>
        </li>
    `;

    container.appendChild(document.createRange().createContextualFragment(html));
}

function addUserInfo(user, container) {

    const html = `
<div class="scoreboard__user__stats__column">
  <strong class="scoreboard__user__stats__title">Total</strong>

  <ol class="scoreboard__user__stats__list">
    <li>
      <strong>Received</strong>
      <span class="score mini">${user.received}</span>
    </li>
    <li>
      <strong>Given</strong>
      <span class="score mini">${user.given}</span>
    </li>
  </ol>
</div>

<div class="scoreboard__user__stats__column">
  <strong class="scoreboard__user__stats__title">Today</strong>

  <ol class="scoreboard__user__stats__list">
    <li>
      <strong>Received</strong>
      <span class="score mini">${user.receivedToday}</span>
    </li>
    <li>
      <strong>Given</strong>
      <span class="score mini">${user.givenToday}</span>
    </li>
  </ol>
</div>`;

    container.innerHTML = html;
}
function addStats(data) {
    console.log("addStatsaa", data)
    const element = document.getElementById(`user:${data.user.username}`);
    const statsEl = element.querySelector('[data-stats]');
    const infoEl = element.querySelector('[data-info]');
    const todayFromEl = element.querySelector('[data-today-from]');
    const todayToEl = element.querySelector('[data-today-to]');

    const fromEl = element.querySelector('[data-from]');
    const toEl = element.querySelector('[data-to]');

    fromEl.innerHTML = '';
    toEl.innerHTML = '';
    todayFromEl.innerHTML = '';
    todayToEl.innerHTML = '';

    addUserInfo(data.user,infoEl);
    if(data.givenToday){
        data.givenToday.forEach((user) => addStatsRow(user,todayToEl));
    }

    if(data.receivedToday){
        data.receivedToday.forEach((user) => addStatsRow(user,todayFromEl));
    }


    if (data.given) {
        data.given.forEach((user) => addStatsRow(user, toEl));
    }

    if (data.received) {
        data.received.forEach((user) => addStatsRow(user, fromEl));
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
    console.log("data",data)
    element.className = 'scoreboard__user';
    element.id = `user:${data.username}`;

    if (display) {
        element.className += ' display';
    }

    element.setAttribute('data-uuid', data.username);
    element.setAttribute('data-score', data.score);

    element.innerHTML = `
 <div class="scoreboard__user__row scoreboard__user__summary">
<div><span data-element="score" class="score position mini">${data.position}.</span></div>

  <div>
    <img class="avatar" width="48" height="48" src="${data.avatar}" alt="">
  </div>
  <div class="displayname">${data.name}</div>
  <div><span data-element="score" class="score">${data.score}</span></div>
</div>


<div class="scoreboard__user__stats" data-stats>


  <div class="scoreboard__user__stats__info" data-info>
  </div>


  <div class="scoreboard__user__stats__today">

    <div class="scoreboard__user__stats__column">
      <strong class="scoreboard__user__stats__title">From ( Today )</strong>
      <ol class="scoreboard__user__stats__list" data-today-from>
      </ol>
    </div>

    <div class="scoreboard__user__stats__column">
      <strong class="scoreboard__user__stats__title">To ( Today )</strong>
      <ol class="scoreboard__user__stats__list" data-today-to>
      </ol>
    </div>

  </div>


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
    const top20 = store.slice(0,20);
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
    const score = data.received;
    const scoreEl = item.querySelector('[data-element="score"]');
    const className = (direction === 'up') ? ' tada animated good' : ' shake animated bad';

    item.setAttribute('data-score', score);
    scoreEl.innerHTML = score;
    scoreEl.className += className;

    store = store.slice().map((user) => {
        const uppdatedUser = Object.assign({}, user);

        if (user.username === data.username) {
            uppdatedUser.score = data.received;
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
    console.log("HEJHEJ",data)
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
