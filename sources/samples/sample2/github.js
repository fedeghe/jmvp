var GH = (function () {
    var _user = null,
        _pwd = null,
        _loggedIn = false,
        _userData = null,
        headers = function (method) {
            method = method || 'GET';
            return {
                method: method,
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": "Basic ".concat(btoa(_user + ":" + _pwd))
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
        };
    return {
        
        isLoggedIn: function () {return _loggedIn;},

        login: function (user, pwd) {
            _user = user;
            _pwd = pwd;
            return fetch('https://api.github.com/user', headers())
            .then(getResponse)
            .then(function(json) {
                _userData = json;
                _loggedIn = true;
                _user = user;
                _pwd = pwd;
            })
            .catch(function (error) {
                _loggedIn = false;
                throw error;
            });
        },

        getMyRepos: function () {
            return fetch('https://api.github.com/users/' + _user + '/repos?per_page=100&type=owner', headers())
                .then(getResponse)
                .catch(err);
        },

        getMyStarred: function () {
            return fetch('https://api.github.com/users/' + _user + '/starred', headers())
                .then(getResponse)
                .catch(err);
        },
        getMostStarred: function (lang) {
            return fetch('https://api.github.com/search/repositories?q=language:' + lang + '&sort=stars&page=1', headers())
                .then(getResponse)
                .catch(err);
        },
        

        check: function () {
            console.log(_user);
            console.log(_pwd);
            console.log(_loggedIn);
            console.log(_userData);
        }

    }
})();

/**
 * curl -i https://api.github.com/user -u fedeghe:'mypwd'
 */
