// Get full list of received Burritos
hey.on('open', function () {
    hey.get('getReceivedList', { type: 'burrito', sort: 'points', order: 'asc', take: 5, skip: 0 });
});

hey.on('receivedList', renderList);
hey.on('userStats', userStats);

hey.on('GIVE',GIVE)
function GIVE(data){
    console.log("data",data)
}
/*
* Special help functions
*/
function returnPercent(totalScore,user) {
    return (user / totalScore) * 100;
}

function openStats(user) {
    hey.get('getUserStats', user);
}

function renderList(data) {
    $("#content").empty();

    for (const a of data) {
        if (!$('.row').hasClass(a.username)) {
            $('#content').append(`<tr data-uuid="${a.username}" onclick="openStats('${a.username}')" class="row"><td class="avatar"><img src="${a.avatar}"></img></td><td class="name"> <p>${a.name}</p></td><td class="score">${a.score}</td></tr>`);
        }
    }
}

// Box, showUser stats
function userStats (data) {
    console.log('data', data);

    const x = document.getElementById('hiddenBox');
    x.style.display = 'block';

    $('#head').empty();
    $('#head').append(`<p><img src="${data.user.avatar}"></p>`);
    $('#head').append(`<p>${data.user.name}</p>`);

    $('#stats').empty();
    $('#stats').append(`<p>Total given: ${data.gived}</p>`);
    $('#stats').append(`<p>Total received: ${data.user.score}</p>`);
    $('#stats').append(`<br><br>`);

    if (data.givers.length) {
        for (const a of data.givers) {
            const tjeeena = returnPercent(data.score,a.score);
            $('#stats').append(`<div class="progress"><p>${a.name}</p><div class="bar"><div class="bar-progress" style="height:24px;width:${tjeeena}%"></div></div>`);
        }
    }
}

// Hax to fix box on startup
function close() {
    const x = document.getElementById('hiddenBox');

    if(x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}

close();
