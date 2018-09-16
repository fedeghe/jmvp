var App = (function () {

    var viewF = JMVP.View(),
        modelF = JMVP.Model(),
        presenterF = JMVP.Presenter();
    
    var modelLogin = modelF({
            message: 'Enter Your auth info and press login button',
            loggedIn: false
        }),
        viewLogin = viewF(`
            <div>
                <fieldset class="login">
                    <legend class="login-legend">Login</legend>
                    <div>
                        <label>Username:</label><input type="text"/>
                    </div>
                    <div>
                        <label>Password:</label><input type="password"/>
                    </div>
                    <button>login</button><span> or </span><button>skip</button> 
                    <hr>
                    <span>$[message]</span>
                </fieldset>
            </div>
        `, modelLogin),
        
        modelList = modelF({
            list: [],
            languages: $LANGUAGES$,
            loggedIn: false
        }),
        viewList = viewF(`<div>Logged in</div>`, modelList),

        presenter = presenterF();

    var App =  presenter.getSetupsManager({
        initialize: function () {
            console.log('Initialize')
        },
        login: {
            view: viewLogin,
            model: modelLogin,
            defs: function () {
                var p = this;
                p.view.defineMethod('updateMessage', function(m) {
                    p.view.getNode(0, 7).innerHTML = m;
                });
                p.view.defineMethod('setSubmitHandler', function (handler) {
                    p.view.setHandler([0, 3], 'click', handler);
                });
                p.view.defineMethod('setSkipHandler', function (handler) {
                    p.view.setHandler([0, 5], 'click', handler);
                });
                p.defineMethod('updateMessage', function (m){
                    p.model.setMessage(m);
                    p.view.updateMessage(p.model.getMessage());
                });
                p.defineMethod('attemptLogin', function () {
                    var usr = p.view.getNode(0, 1, 1).value,
                        pwd = p.view.getNode(0, 2, 1).value;
                    
                    GH.login(usr, pwd).then(() => {
                        p.updateMessage('Logged in correctly');

                        GH.check();
                        GH.getMyRepos().then(function (repos) {
                            console.log(repos);
                        });
                        GH.getMyStarred().then(function (repos) {
                            console.log(repos);
                            App.list({repos: repos});
                        });

                    }).catch(function (e) {
                        console.log('ERROR');
                        console.log(e);
                        p.updateMessage('User or password incorrect.please try again');
                    });
                });
                p.defineMethod('skip', function () {
                    // App.list();
                });
            },
            init: function () {
                var p = this;
                if (this.model.getLoggedIn()) {
                    App.list();
                }
                p.view.setSubmitHandler(p.attemptLogin);              
                p.view.setSkipHandler(p.skip);              
            }
        },
        list: {
            view: viewList,
            model: modelList,
            defs: function () {},
            init: function (params) {
                console.log('Params received: ')
                console.log(params)
            }
        }
    });

    return App;
})();