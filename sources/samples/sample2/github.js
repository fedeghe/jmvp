var GH = (function () {
    var ep = {

    }
})();



/**
 * curl -i https://api.github.com/user -u fedeghe:'mypwd'
 */


var res = fetch('https://api.github.com/user', {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, cors, *same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, same-origin, *omit
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic ".concat(btoa("fedeghe:mypwd"))
        // "Content-Type": "application/x-www-form-urlencoded",
    },
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer"
})
    .then(response => response.json());
console.log(res)