const users = document.getElementById('users');
const filter = document.getElementById('filter');

    const burrito = `          <svg xmlns="http://www.w3.org/2000/svg" width="0.85em" viewBox="0 0 93 189">
                  <g fill="none" fill-rule="evenodd" transform="translate(1.742188 -6.878615)">
                    <g transform="translate(2.894531)">
                      <path fill="#B9CD2B" stroke="#000" stroke-width="3" d="M60.22369452 14.09588889c.08769317.19496398.11059906.41289936.0653575.62183537l-2.04128505 9.42649376 9.74451043 3.13171892c.52581225.16893785.81511605.732144.6461782 1.25795625-.06381661.19862653-.18815797.37232022-.3556113.49675681l-5.26787819 3.91383974 3.35160946 3.6062058c.37604758.40448323.35299599 1.03722842-.05148724 1.413276-.16467872.1531015-.37615027.24623477-.60027187.26436304l-8.62102762.69660495.0996039 12.67690775c.00429525.55226806-.43992441 1.00345179-.99219247 1.00774705-.22542404.00175328-.44482731-.07271234-.62261436-.21131553l-6.86736387-5.35429845-1.7937028 3.23015067c-.26818185.4828012-.87697388.65678455-1.359775.38860277-.19063406-.1058917-.34142876-.27119575-.42941118-.47072897l-2.4174445-5.4836632-10.79453279 3.88038843c-.5197331.1868045-1.092495-.08308745-1.27929943-.60282063-.07529005-.20947412-.07853783-.43808058-.00922889-.64960902l3.3289515-10.15954227-6.60227544-1.37771669c-.54062407-.11288954-.88737133-.642667-.77448173-1.18329115.04457444-.21346543.15770525-.40650931.32215746-.54972201l5.155653-4.49150471-5.12128074-7.20910418c-.31985639-.45023362-.2141648-1.07451498.23606882-1.39437136.17159454-.12190484.37728032-.18655518.58776122-.18474288l8.00953648.0679663-.99334966-7.6792362c-.0708991-.54771506.31563654-1.04920096.86335153-1.12009998.22299314-.02886545.4492071.01826528.64211866.13378254l7.82556673 4.68570487 5.13464294-7.57888954c.30973535-.45725545.93150411-.5768441 1.38875956-.26710875.19251387.13040485.33356662.32382099.39889535.5469783l1.95549066 6.67876758 5.91610142-2.66006736c.50367962-.22655087 1.09564839-.00189366 1.32219931.50178598z"/>
                      <circle cx="58.8632812" cy="40.3786149" r="24.5" fill="#CC4530" stroke="#000" stroke-width="3"/>
                      <circle cx="58.3632812" cy="39.8786149" r="20" fill="#F2624B"/>
                      <circle cx="24.8632812" cy="39.3786149" r="24.5" fill="#CC4530" stroke="#000" stroke-width="3"/>
                      <circle cx="25.3632812" cy="38.8786149" r="20" fill="#F2624B"/>
                      <ellipse cx="50.3632812" cy="49.3786149" fill="#7F520C" stroke="#000" stroke-width="3" rx="26" ry="22.5"/>
                      <circle cx="59.8632812" cy="42.3786149" r="3.5" fill="#000" fill-opacity=".17"/>
                      <circle cx="53.8632812" cy="34.3786149" r="3.5" fill="#000" fill-opacity=".17"/>
                      <path fill="#B9CD2B" stroke="#000" stroke-width="3" d="M21.2244209 27.9821019c.1972126.0973302.3568401.2569577.4541703.4541703l2.7736901 5.6193427 5.8225886-2.3195405c.5130306-.2044947 1.0946998.045623 1.2991945.5586535.0814309.2042915.0932456.4297295.0336151.6414137l-1.2603982 4.4704733 4.5973718.6680155c.5465449.0794176.9252263.5868604.8458087 1.1334053-.0316245.217637-.1341117.4187794-.2915953.572288l-4.4895852 4.3752912 4.007683 4.8199507c.3530212.4247286.2948908 1.0552195-.1298378 1.4082407-.1691292.140575-.3798826.2214756-.5996331.2301776l-4.6412121.183631.7854005 4.5778999c.093361.5443364-.2722269 1.0612924-.8165633 1.1546534-.2167576.0371768-.4397257.0018621-.6343862-.1004769l-5.548451-2.9170764-3.3456596 5.3002461c-.2948514.4669916-.9124472.6065387-1.3794387.3116872-.1859585-.1174113-.3280259-.29285-.4042086-.4991561l-1.6096931-4.3577772-4.1103033 2.1620764c-.4888446.2570008-1.0934717.0690543-1.3504725-.4197903-.1023391-.1946605-.1376538-.4176286-.1004769-.6343862l1.0582527-6.1778999-6.07321318-1.544462c-.53524943-.1361121-.85881421-.6803581-.72270215-1.2156075.05420053-.2131392.17715138-.4024669.34981832-.538673l3.64609696-2.8772575-3.32543741-3.2412912c-.39548358-.3855012-.40357588-1.0186144-.01807467-1.414098.1535086-.1574837.35465101-.2599708.57228804-.2915953l6.20222409-.9010155-.4075295-6.2548364c-.0359509-.5511134.3816708-1.0270231.9327842-1.062974.2194563-.0143158.4375115.0441119.6204083.1662379l3.862337 2.5785725 2.0558378-4.1643427c.2444223-.4952536.8440481-.6985926 1.3393018-.4541703z"/>
                      <path fill="#B9CD2B" stroke="#000" stroke-width="3" d="M35.09975434 32.87902695c.21917295-.01814373.43821467.0364695.62321493.15538493l5.2716919 3.3881608 3.79628088-4.98708908c.3344305-.43951647.96183846-.52470554 1.40135487-.19027513.1750178.13317198.30125413.32032504.35916624.5324858l1.22209184 4.4810966 4.2847702-1.79522049c.5093835-.21341726 1.09532917.02651077 1.30874644.53589428.08498385.20283914.10073117.42803664.04480415.64072924l-1.59488407 6.06266387 5.91771295 2.0673948c.52134963.1822441.79624897.75261965.61400486 1.27396928-.07257054.20760427-.21155457.38549565-.39543566.5061346l-3.88371829 2.54780343 3.03101238 3.51951493c.36037997.4185029.313262 1.04991236-.1052409 1.41029233-.16665005.14350516-.37595943.22807161-.59552453.24060754l-6.25835618.35724101-.13796146 6.26633973c-.01221852.55214962-.46972938.98985019-1.02187897.97763152-.21986884-.00486541-.43200198-.08207561-.6035588-.21967746l-3.62419746-2.90629089-2.40966592 3.9702239c-.28665641.47206626-.9017226.62237064-1.37378886.33571423-.1879793-.11414808-.33308696-.28708063-.41285856-.49202568l-2.27475406-5.84053421-6.0012165 1.80407371c-.5289012.15900298-1.08655777-.1408587-1.24556075-.6697599-.06331591-.21061127-.0554374-.43622118.0224157-.64190263l1.64341796-4.34416982-4.51984467-1.0656019c-.53754332-.12674996-.87055717-.66526605-.74380726-1.20280946.05047245-.21405265.17010038-.40549724.34036387-.54469606l4.8522864-3.96670259-3.57079985-5.15154802c-.31466032-.4538803-.20180027-1.07690562.25208003-1.39156594.18073758-.12529938.39773986-.1875238.61741255-.1770402l4.638732.22101742-.3825981-4.62837314c-.04556367-.55040198.36368864-1.03352764.9140907-1.07909135z"/>
                    </g>
                    <path fill="#DEAE7E" stroke="#000" stroke-width="3" d="M72.304795 88.7622792l9.95844 61.0494558c3.3811197 20.727695-10.6810586 40.271752-31.4087544 43.652871-2.0239726.330153-4.0713355.49604-6.1220587.49604C20.0273875 193.960646 0 173.933259 0 149.228224V42.6822255c0-1.6568542 1.34314575-3 3-3a2.99999727 2.99999727 0 01.69894083.0825557l29.68973107 7.1128571C53.6147461 51.7232591 68.9563947 68.235167 72.304795 88.7622792z"/>
                    <path fill="#F4C99D" stroke="#000" stroke-width="3" d="M89.4648438 39.9846204V150.857131c0 23.805414-19.2981013 43.103515-43.1035157 43.103515h-1.544464c-20.9868202 0-37.99999953-17.01318-37.99999953-38a38.000004 38.000004 0 01.25826106-4.422798C11.4439418 114.25676 17.7535354 88.1952187 26.0039062 73.3532243c10.9552306-19.7078984 31.7408903-31.1622927 62.3569792-34.363183.5492801-.0574026 1.041111.3413214 1.0985376.8905991a.99996908.99996908 0 01.0054208.10398z"/>
                    <circle cx="73.7578125" cy="65.3786149" r="3.5" fill="#000" fill-opacity=".17"/>
                    <circle cx="35.2578125" cy="119.878615" r="3" fill="#000" fill-opacity=".17"/>
                    <circle cx="48.2578125" cy="85.8786149" r="2" fill="#000" fill-opacity=".17"/>
                    <circle cx="66.7578125" cy="173.378615" r="2.5" fill="#000" fill-opacity=".17"/>
                    <circle cx="60.2578125" cy="135.878615" r="2" fill="#000" fill-opacity=".17"/>
                    <circle cx="14.2578125" cy="63.8786149" r="2" fill="#000" fill-opacity=".17"/>
                    <circle cx="9.2578125" cy="83.8786149" r="1" fill="#000" fill-opacity=".17"/>
                    <circle cx="32.2578125" cy="100.878615" r="1" fill="#000" fill-opacity=".17"/>
                    <circle cx="19.2578125" cy="153.878615" r="1" fill="#000" fill-opacity=".17"/>
                    <circle cx="59.2578125" cy="73.8786149" r="1" fill="#000" fill-opacity=".17"/>
                    <circle cx="69.2578125" cy="113.878615" r="1" fill="#000" fill-opacity=".17"/>
                    <circle cx="39.2578125" cy="143.878615" r="1" fill="#000" fill-opacity=".17"/>
                  </g>
                </svg>`;

let store = [];

const setLocalStorage = (key, value) => {
    return localStorage.setItem(key, value);
};

const getLocalStorage = (key) => {
    return localStorage.getItem(key);
};

const burritoHost = window.location.hostname;

let listType = getLocalStorage('listType') || 'to';
let scoreType = 'inc';
let userType = getLocalStorage('userType') || 'member';

const filteraSwitch = document.getElementById('switchToFromInput');
const filtercSwitch = document.getElementById('switchUserTypesInput');

filteraSwitch.checked = (listType === 'to' ) ? true : false;;
filtercSwitch.checked = (userType === 'member' ) ? true : false;

async function fetcher (type, {username,listType, scoreType}) {
    switch (type) {
    case 'scoreboard':
        const res = await fetch(`/api/scoreboard/${listType}/${scoreType}`);
        const json = await res.json();
        return json.data;
        break;
    case 'userStats':
        const res1 = await fetch(`/api/userstats/${username}`);
        const json1 = await res1.json();
        return json1.data;
        break;
    case 'userScore':
        const res2 = await fetch(`/api/userscore/${username}/${listType}/${scoreType}`);
        const json2 = await res2.json();
        const {data} = json2;
        return json2;
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
    const score = 'inc';
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



function sortUsers(sort = false) {

    let data;

    if(userType === 'member'){
        data = store.filter(item => item.memberType === userType);
    }else{
        data = store;
    }

    if(sort) data.sort((a, b) => Math.sign(b.score - a.score));

    store = data.map((item, i) => {
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
<div class="scoreboard__user__stats__column" >

<div class="scoreboard__user__stats__title"><strong>Total</strong></div>
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
  <div class="scoreboard__user__stats__title"><strong>Today</strong></div>

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

const level = (l) => Array(l).fill(burrito).join(' ');

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
<div><span class="score position mini">${data.position}.</span></div>

  <div>
    <img class="avatar" width="48" height="48" src="${data.avatar}" alt="">
  </div>
  <div class="displayname">${data.name}
<span data-element="level" class="level">${data.level ? level(data.level) : ''}</span>
</div>
  <div><span data-element="score" class="score">${data.score}</span></div>
</div>


<div class="scoreboard__user__stats" data-stats>


  <div class="scoreboard__user__stats__info" data-info>
  </div>


  <div class="scoreboard__user__stats__today">

    <div class="scoreboard__user__stats__column">
<div class="scoreboard__user__stats__title"><strong>From ( Today )</strong></div>
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

function updateUser(data, direction, item,burritoType) {
    const score = data.score;
    const scoreEl = item.querySelector('[data-element="score"]');
    const className = (direction === 'up') ? ' tada animated good' : ' shake animated bad';

    item.setAttribute('data-score', score);
    scoreEl.innerHTML = score;

    let scoreUpdated = false;

    store = store.slice().map((user) => {
        let uppdatedUser = Object.assign({}, user);

        if (user.username === data.username && user.score !== data.score) {
            uppdatedUser.score = data.score;
            rainBurritos(burritoType);
            scoreUpdated = true;
        }
        return uppdatedUser;
    });

    if (scoreUpdated) {
        scoreEl.className += className;

        setTimeout(() => {
            scoreEl.className = scoreEl.className.replace(className, '').trim();
            setTimeout(() => {
                sortUsers(true);
                render(true);
            }, 1500);
        }, 1000);
    }

}

function updateScore(data, direction,burritoType) {
    const item = document.querySelector(`[data-uuid="${data.username}"]`);

    if (item) {
        updateUser(data, direction, item,burritoType);
    } else {
        appendUser(data,burritoType);
    }
}

hey.on('GIVE', async (input) => {
    const username = input[listType];
    const {data} = await fetcher('userScore', {username, listType, scoreType});
    const direction = (data.scoreType === 'inc') ? 'up' : 'down';
    const burritoType = (data.scoreType === 'inc') ? 'burrito': 'rottenburrito';
    updateScore(data, direction,burritoType);

});

hey.on('TAKE_AWAY', async (input) => {
    const username = input[listType];
    const {data} = await fetcher('userScore', {username, listType, scoreType});
    const direction = (data.scoreType === 'inc') ? 'up' : 'down';
    const burritoType = (data.scoreType === 'inc') ? 'burrito': 'rottenburrito';
    updateScore(data, direction,burritoType);
});



function rainBurritos(type){

    const burritoType = (type === 'burrito') ? `<i class="rain burrito-rain">${burrito}</i>`: `<i class="rain burrito-rain">${rottenburrito}</i>`;
    for (i = 0; i < 50; i++) {
        document.getElementById("rain").innerHTML+= burritoType;
    }

    setTimeout(() => {
        var i, elements = document.getElementsByClassName('rain');
        for (i = elements.length; i--;) {
            elements[i].parentNode.removeChild(elements[i]);
        }
    }, 15000);
}
