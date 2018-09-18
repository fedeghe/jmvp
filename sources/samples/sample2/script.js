var App = (function () {
    var trg = document.getElementById('trg');
    var viewF = JMVP.View(),
        modelF = JMVP.Model(),
        presenterF = JMVP.Presenter();
    
    var modelLogin = modelF({
            skipMessage: '... or run it anonymously!',
            message: 'Enter Your Github credentials and login'
        }),
        viewLogin = viewF(`
            <div>
                <fieldset class="login">
                    <legend class="login__legend">Login</legend>
                    <div class="login__line">
                        <label class="login__label">Username</label>
                        <input class="login__input"type="text"/>
                    </div>
                    <div class="login__line">
                        <label class="login__label">Password</label>
                        <input class="login__input" type="password"/>
                    </div>
                    <div class="login__line">
                        <button class="login__submit">login</button>
                        <span> or </span>
                        <button class="login__skip">skip</button> 
                    </div>
                    <hr class="separator"/>
                    <p class="login__message">$[message]</p>
                </fieldset>
            </div>
        `, modelLogin),
        
        modelList = modelF({
            list: [],
            languages: $LANGUAGES$
        }),
        viewList = viewF(`<div>
                <div class="panel__header">
                    Logged in
                </div>
                <div class="panel__body">
                    BODY
                </div>
                <div class="panel__footer">
                    logout
                </div>
        </div>`, modelList),

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

                function enter(s) {
                    window.setTimeout(function () {
                        App.list();
                    }, s || 1000);
                }

                p.view.defineMethod('updateMessage', function(m) {
                    p.view.getNode(0, 5).innerHTML = m;
                });
                p.view.defineMethod('setSubmitHandler', function (handler) {
                    p.view.setHandler([0, 3, 0], 'click', handler);
                });
                p.view.defineMethod('setSkipHandler', function (handler) {
                    p.view.setHandler([0, 3, 2], 'click', handler);
                });
                p.view.defineMethod('setOverOutSkipHandler', function (handlerOver, handlerOut) {
                    p.view.setHandler([0, 3, 2], 'mouseover', handlerOver);
                    p.view.setHandler([0, 3, 2], 'mouseout', handlerOut);
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
                        enter();
                    }).catch(function (e) {
                        console.log('ERROR');
                        console.log(e);
                        p.updateMessage('User or password incorrect.please try again');
                    });
                });
                p.defineMethod('skip', function () {
                    p.updateMessage('Skipping');
                    GH.logout();
                    enter();
                });
            },
            init: function () {
                var p = this;
                p.view.setSubmitHandler(p.attemptLogin);              
                p.view.setSkipHandler(p.skip);   
                p.view.setOverOutSkipHandler(function () {
                    p.view.updateMessage(p.model.getSkipMessage());
                }, function () {
                    p.view.updateMessage(p.model.getMessage());
                }); 
                GH.isLoggedIn() && App.list();
            }
        },
        list: {
            view: viewList,
            model: modelList,
            defs: function () {
                var p = this;
                p.view.defineMethod('setLogoutHandler', function (handler) {
                    p.view.setHandler([2], 'click', handler);
                });
                p.defineMethod('logout', function () {
                    GH.logout();
                    App.login();
                });
            },
            init: function () {
                var p = this;
                p.view.setLogoutHandler(p.logout);
            }
        }
    });

    return App;
})();