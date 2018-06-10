socket.on('getUsers', function (data) {
    console.log(data)
    for (let a of data){
        $( "#content" ).append("<div class=\"row\"><div class=\"avatar\"><img src=\"" + a.avatar + "\"></img></div><div class=\"name\"> <p>"+ a.name + "</p></div><div class=\"score\"><p>" + a.score+ "</p></div></div>");
    }
});
