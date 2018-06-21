
function renderList(data){
    data.sort((a, b) => Math.sign(b.score - a.score));
    for (const a of data) {
        if (!$('.row').hasClass(a.username)) {
            $('#content').append(`<tr data-uuid="${a.username}" class="row"><td class="avatar"><img src="${a.avatar}"></img></td><td class="name"> <p>${a.name}</p></td><td class="score">${a.score}</td></tr>`);
        }
    }
}

socket.on('getUsers', (data) => {
    renderList(data)
});


socket.on('GIVE', (data) => {
    const $item = $('#content').find(`[data-uuid="${data[0].username}"]`);
    if ($item.length) {
        var burritos = parseInt($item.find('td.score').html(), 10);
        $item.find('td.score').html(data[0].score);
    }else{
        renderList(data)
    }
});

socket.on('TAKE_AWAY', (data) => {
    const $item = $('#content').find(`[data-uuid="${data[0].username}"]`);
    if ($item.length) {
        var burritos = parseInt($item.find('td.score').html(), 10);

        $item.find('td.score').html(data[0].score);
    }
});
