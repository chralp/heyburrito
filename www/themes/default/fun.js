/*
* On start
*/

// Store where all users ?!
const store = []

// Get full list of received Burritos

hey.on('open', function () {
    hey.get('getReceivedList');
});

hey.on('receivedList', renderList);
//hey.on('givenList', givenList);
hey.on('userStats', userStats);

/*
* Special help functions
*/

function returnProcent(totalScore,user){

    a = totalScore
    b = user
    res = b / a
    return res *100
}

function openStats(user) {
    socket.send(JSON.stringify({event:'getUserStats', data:user}))
}

// Store First userList
function fullList(data) {
    console.log("FullList", data)
    data.forEach(element => {
        store.push(element)
    });
}

function LocalStore(data) {
    store.map(x => {
        if(x.username === data[0].username){
            return x.score = data[0].score
        }
    })
    renderList(store)
}

function renderList(data) {
    //data.sort((a, b) => Math.sign(b.score - a.score));
    $("#content").empty();
    for (const a of data) {
        if (!$('.row').hasClass(a.username)) {
            $('#content').append(`<tr data-uuid="${a.username}" onclick="openStats('${a.username}')" class="row"><td class="avatar"><img src="${a.avatar}"></img></td><td class="name"> <p>${a.name}</p></td><td class="score">${a.score}</td></tr>`);
        }
    }
}

//socket.on('GIVE', (data) => {
function give(data) {
    const $item = $('#content').find(`[data-uuid="${data[0].username}"]`);
    if ($item.length) {
        var burritos = parseInt($item.find('td.score').html(), 10);
        $item.find('td.score').html(data[0].score);
    }else{
        renderList(data)
    }
}

// Box, showUser stats
function userStats (data){
    console.log("data",data)
    var x = document.getElementById("hiddenBox");
    x.style.display = "block";
    $("#head").empty();
    $("#head").append(`<p><img src="${data.user.avatar}"></p>`)
    $("#head").append(`<p>${data.user.name}</p>`)

    $("#stats").empty();
    $("#stats").append(`<p>Total given: ${data.gived}</p>`)
    $("#stats").append(`<p>Total received: ${data.user.score}</p>`)
    $("#stats").append(`<br><br>`)

    if(data.givers.length){

        for (const a of data.givers) {
            tjeeena = returnProcent(data.score,a.score)
            $('#stats').append(`<div class="progress"><p>${a.name}</p><div class="bar"><div class="bar-progress" style="height:24px;width:${tjeeena}%"></div></div>`);
        }
    }
}




// Hax to fix box on startup
function close(){
    var x = document.getElementById("hiddenBox");
    if(x.style.display === "none"){
        x.style.display = "block";
    }else{
        x.style.display = "none";
    }

}
close()
