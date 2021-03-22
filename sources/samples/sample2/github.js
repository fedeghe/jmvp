var GH = (function () {
    function getData() {
        var uData = JMVP.storage.get('ghuserdata'),
            userData = uData ? JSON.parse(uData) : {};
        return {
            usr: JMVP.storage.get('ghusr'),
            accessToken: JMVP.storage.get('ghaccessToken'),
            loggedIn: JMVP.storage.get('ghlogged') || false,
            userData: userData
        };
    }
    var apiBase = 'https://api.github.com',
        elsPerPage = $GH_RNUM$,
        data = getData(),
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
                    // "Authorization": "Basic ".concat(btoa(data.usr + ":" + data.pwd)),
                    "Authorization": "token " + data.accessToken
                },
                redirect: "follow",
                referrer: "no-referrer"
            };
        },
        getResponse = function (response) {
            if (checkResponse(response)) {
                return response.json();
            }
            throw new Error(response.status + ' : ' + response.statusText);
        },
        checkResponse = function (response) {
            return response.ok && response.status >= 200 && response.status < 300; // maybe add some relevant check of the statuscode like a rangecheck in [200,400[  ???
        },
        err = function (error) {
            console.error('Error:', error);
        },
        saveAuth = function () {
            JMVP.storage.set('ghusr', data.usr);
            JMVP.storage.set('ghaccessToken', data.accessToken);
            JMVP.storage.set('ghlogged', data.loggedIn);
            JMVP.storage.set('ghuserdata', JSON.stringify(data.userData));
        };
    return {
        getData: getData,

        isLoggedIn: function () { return data.loggedIn; },

        logout: function () {
            JMVP.storage.clear();
            refreshData();
        },

        login: function (usr, accessToken) {
            data.usr = usr;
            data.accessToken = accessToken;
            return fetch(`${apiBase}/user`, headers())
                .then(getResponse)
                .then(function (json) {
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
            return fetch(`${apiBase}/users/${data.usr}/repos?per_page=${elsPerPage}&type=owner`, headers())
                .then(getResponse)
                .catch(err);
        },

        getMyStarred: function () {
            return fetch(`${apiBase}/users/${data.usr}/starred`, headers())
                .then(getResponse)
                .catch(err);
        },

        getMostStarred: function (lang) {
            return fetch(`${apiBase}/search/repositories?q=language:${lang}&per_page=${elsPerPage}&sort=stars&page=1`, headers())
                .then(getResponse)
                .catch(err);
        },

        starRepo: function (repo, user) {
            user = user || data.usr;
            return fetch(`${apiBase}/starred/${user}/${repo}` , headers('PUT'))
                .then(checkResponse)
                .catch(err);
        },

        unstarRepo: function (repo, user) {
            user = user || data.usr;
            return fetch(`${apiBase}/user/starred/${user}/${repo}`, headers('DELETE'))
                .then(checkResponse)
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
