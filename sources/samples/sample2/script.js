var App = (function () {
    var trg = document.getElementById('trg');
    var viewF = JMVP.View(),
        modelF = JMVP.Model(),
        presenterF = JMVP.Presenter();
        presenterI = JMVP.Presenter();
    
    var modelLogin = {
            skipMessage: '... or run it anonymously!',
            message: 'Enter Your Github credentials and login'
        },
        viewLogin = `
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
        `,
        
        modelList = {
            list: [],
            languages: $LANGUAGES.SET$,
            defaultLang: $LANGUAGES.DEFAULT$
        },
        viewList = `<div class="panel">
                <div class="panel__header">
                    <label>Language</label>
                    <select>
                    </select>
                    <span>Total stars: </span>
                    <span></span>
                </div>
                <div class="panel__body">
                    <ul class="panel__list">
                        <li class="spinner"></li>
                    </ul>
                </div>
                <div class="panel__footer">
                    <span class="panel__logout"></span>
                </div>
        </div>`;

        presenter = presenterF();

    var App =  presenter.getSetupsManager({
        initialize: function () {
            console.log('Initialize')
        },

        /**
         * The login
         */
        login: {
            view: function () {return viewF(viewLogin);},
            model: function () {return modelF(modelLogin);},
            defs: function () {
                var p = this;

                function enter(s) {
                    window.setTimeout(function () {
                        App.list();
                    }, s || 1000);
                }

                /**
                 * define the view interface
                 */
  
                p.view.defineMethod('toggleButtonsFunc', function(val) {
                    var bSub = p.view.getNode(0, 3, 0),
                        bSkip = p.view.getNode(0, 3, 2);
                    if (val) {
                        bSub.removeAttribute('disabled');
                        bSkip.removeAttribute('disabled');
                    } else {
                        bSub.setAttribute('disabled', 'disabled');
                        bSkip.setAttribute('disabled', 'disabled');
                    }
                });
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
                // end of view interface definition

                p.defineMethod('updateMessage', function (m){
                    p.model.setMessage(m);
                    p.view.updateMessage(p.model.getMessage());
                });
                p.defineMethod('attemptLogin', function () {
                    var usr = p.view.getNode(0, 1, 1).value,
                        pwd = p.view.getNode(0, 2, 1).value;
                    p.view.toggleButtonsFunc(false);
                    GH.login(usr, pwd).then(() => {
                        p.updateMessage('Logged in correctly');
                        enter();
                    }).catch(function (e) {
                        console.log('ERROR');
                        console.log(e);
                        p.view.toggleButtonsFunc(true);
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

        /**
         * the list
         */
        list: {
            view: function () {return viewF(viewList);},
            model: function () {return modelF(modelList);},
            defs: function () {
                var p = this;

                /**
                 * define view interface
                 */
                p.view.defineMethod('loadLanguagesList', function (list) {
                    var trg = p.view.getNode(0, 1);
                    list.forEach(function (lang) {
                        var item = document.createElement('option');
                        item.innerHTML = lang;
                        trg.appendChild(item);
                    });
                });
                p.view.defineMethod('setLogoutHandler', function (handler) {
                    p.view.setHandler([2, 0], 'click', handler);
                });
                p.view.defineMethod('setTotStars', function (n) {
                    p.view.getNode(0, 3).innerHTML = n;
                });
                p.view.defineMethod('loadList', function (list) {
                    var trg = p.view.getNode(1, 0),
                        totStars = 0;
                    trg.innerHTML = '';
                    
                    list.forEach(function(item) {
                        totStars += item.stargazers_count;
                        var modelItem = modelF({
                                name: item.name,
                                description: item.description || '<i>no description</i>',
                                link: item.html_url,
                                stars: item.stargazers_count
                            }),
                            viewItem = viewF(`<li class="item">
                                <a href="$[link]" target="_blank" class="item__name">$[name]</a>
                                <p class="item__description">$[description]</p>
                                <span>$[stars]</span>
                            </li>`, modelItem),
                            pres = presenterI(modelItem, viewItem);
                        pres.render(trg);
                    });
                    p.view.setTotStars(totStars);
                });

                p.defineMethod('logout', function () {
                    GH.logout();
                    App.login();
                });
            },
            init: function () {
                var p = this;
                var spinner = p.view.getNode(1, 0, 0),
                    imgUrl = GH.getData().userData.avatar_url;
                spinner.style.backgroundImage = 'url(' + imgUrl + ')';
                p.view.setLogoutHandler(p.logout);
                p.view.loadLanguagesList(p.model.getLanguages());
                GH.getMyRepos().then((list) => {
                    p.view.loadList(list);
                });
            }
        }
    });

    return App;
})();