const route = [ 'burritoapi', 'scoreboard' ];
const req = [ 'burritoapi','scoreboard','aa' ];


console.log(route);
console.log(req);



let routeUrl = '';
route.map(x => routeUrl += `${x}/`);


let reqUrl = '';
req.map(x => reqUrl += `${x}/`);


console.log(routeUrl);
console.log(reqUrl);

if(reqUrl.startsWith(routeUrl)){
    console.log("jaha");
}
