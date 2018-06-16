
socket.on('getUsers', (data) => {
    data.sort((a, b) => Math.sign(b.score - a.score))
    for (let a of data){
        if(!$('.row').hasClass(a.username)){
            $( "#content" ).append("<tr class=\"row " + a.username+"\"><td class=\"avatar\"><img src=\"" + a.avatar + "\"></img></td><td class=\"name\"> <p>"+ a.name + "</p></td><td class=\"score\"><p>" + a.score+ "</p></td></tr>");
        }
    }

    socket.emit('getRecivedLog', {username:"USLACKBOT"})
});




socket.on('given', (data) => {
    console.log(data)

});
