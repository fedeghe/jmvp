var GH = (function () {
    function getData() {
        return {
            usr: JMVP.storage.get('ghusr'),
            pwd: JMVP.storage.get('ghpwd'),
            loggedIn: JMVP.storage.get('ghlogged') || false,
            userData: JMVP.storage.get('ghuserdata') || {}
        };
    }
    var data = getData(),
        refreshData = function () {
            data = getData();
        },
        headers = function (method) {
            method = method || 'GET';
            return {
                method: method,
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": "Basic ".concat(btoa(data.usr + ":" + data.pwd))
                },
                redirect: "follow",
                referrer: "no-referrer"
            };
        },
        getResponse = function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.status + ' : ' + response.statusText);
        },
        err = function (error) {
            console.error('Error:', error);
        },
        saveAuth = function () {
            JMVP.storage.set('ghusr', data.usr);
            JMVP.storage.set('ghpwd', data.pwd);
            JMVP.storage.set('ghlogged', data.loggedIn);
            JMVP.storage.set('ghuserdata', data.userData);
        };
    return {
        getData : getData,

        isLoggedIn: function () { return data.loggedIn;},

        logout: function () {
            refreshData();
            JMVP.storage.clear();
        },

        login: function (usr, pwd) {
            data.usr = usr;
            data.pwd = pwd;
            return fetch('https://api.github.com/user', headers())
            .then(getResponse)
            .then(function(json) {
                data.userData = json;
                data.loggedIn = true;
                saveAuth();
            })
            .catch(function (error) {
                data.loggedIn = false;
                throw error;
            });
        },

        getMyRepos: function () {
            return fetch('https://api.github.com/users/' + data.usr + '/repos?per_page=100&type=owner', headers())
                .then(getResponse)
                .catch(err);
        },

        getMyStarred: function () {
            return fetch('https://api.github.com/users/' + data.usr + '/starred', headers())
                .then(getResponse)
                .catch(err);
        },

        getMostStarred: function (lang) {
            return fetch('https://api.github.com/search/repositories?q=language:' + lang + '&sort=stars&page=1', headers())
                .then(getResponse)
                .catch(err);
        },
        check: function () {
            console.log(getData());
        }
    }
})();

/**
 * curl -i https://api.github.com/user -u fedeghe:'mypwd'
 */
