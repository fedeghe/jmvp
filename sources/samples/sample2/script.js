var App = (function () {
    var CONSTANTS = {
            WIP: 'Sorry this feature is not yet implemented! ...come back to check, or simply watch the repo!!! :D'
        },
        trg = document.getElementById('trg'),
        viewF = JMVP.View(),
        modelF = JMVP.Model(),
        presenterF = JMVP.Presenter();
        presenterI = JMVP.Presenter(),

        Toggle = function (active) {
            if (active) {
                trg.style.opacity = 1;
                trg.style.pointerEvents = 'initial';
            } else {
                trg.style.opacity = 0.5;
                trg.style.pointerEvents = 'none';
            }
        },

        modelLogin = {
            skipMessage: '... or run it anonymously!',
            message: 'Enter Your Github credentials and login',
            onLine: navigator.onLine
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
            starredIds: [],
            languages: $LANGUAGES.SET$,
            defaultLang: $LANGUAGES.DEFAULT$,
            totStarred: 0,
            loggedIn: false
        },

        viewList = `<div class="panel">
                <div class="panel__header">
                    <label>Language</label>
                    <select></select>
                    <span><span>Total stars: </span><i></i></span>
                    <br/>
                    <input id="only_owned" type="checkbox" /><label data-tooltip="use it to filter" for="only_owned">Only owned</label>
                </div>
                <div class="panel__body">
                    <ul class="panel__list">
                        <li class="spinner"></li>
                    </ul>
                </div>
                <div class="panel__footer">
                    <span class="panel__logout">EXIT</span>
                </div>
        </div>`,

        modelItem = {
            detailsLabel: 'show more details',
            detailsTooltipMessage: 'show more details about the repo',
            detailsLabelClose: 'show less details',
            detailsTooltipMessageClose: 'hide details about the repo',
            detailsVisible: false,
            name: null,
            description: null,
            link: null,
            stars: null,
            watchers: null,
            forks: null,
            issues: null,
            starredByMe: null,
            isFork: null,
            size: null,
            language: null,
            license: null,
            created: null,
            pushed: null,
            isEmpty: null
        },

        viewItem = `<li class="item{$[isFork] ? ' fork': ''}{$[isEmpty] ? ' emptyRepo': ''}" title="{$[isEmpty] ? ' this repository is empty': ''}">
            <a href="$[link]" target="_blank" class="item__name">$[name]</a>
            <p class="item__description">$[description]</p>
            <span class="{$[starredByMe] ? 'item_starredByMe' : 'item_notStarredByMe'}"></span>
            <div>
                {$[stars] ? '<span data-tooltip="stars" class="item_stars">$[stars]</span>' : ''}
                {$[watchers] ? '<span data-tooltip="watchers" class="item_watchers">$[watchers]</span>' : ''}
                {$[forks] ? '<span data-tooltip="forks" class="item_forks">$[forks]</span>' : ''}
                {$[issues] ? '<span data-tooltip="issues" class="item_issues">$[issues]</span>' : ''}
            </div>
            <hr>
            <details class="item__details">
                <summary class="item__details_summary" data-tooltip="$[detailsTooltipMessage]">$[detailsLabel]</summary>
                <ul class="item__details_summary_list">
                    <li>Size: $[size]</li>
                    <li>Language: $[language]</li>
                    <li>Created: $[created]</li>
                    <li>Last push: $[pushed]</li>
                    <li>License: $[license]</li>
                </ul>
            </details>
        </li>`,

        presenter = presenterF(),

        MyApp =  presenter.getSetupsManager({
            initialize: function () {
                console.log('Initialize');
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
                            p.stop();
                            MyApp.list({trg: trg});
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
                        // p.updateMessage('Skipping');
                        GH.logout();
                        alert(CONSTANTS.WIP)
                        //enter();
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
                    if (GH.isLoggedIn()){
                        MyApp.list({trg: trg});
                        p.stop();
                    }

                    // offline?
                    (function () {
                        function goXLine(status){
                            p.view.toggleButtonsFunc(status);
                            p.model.setOnLine(status);
                            p.view.updateMessage(status
                                ? p.model.getMessage()
                                : ' ~~~ <span class="offline">O F F L I N E</span> ~~~'
                            );
                        }
                        window.onoffline = function () {goXLine(false)};
                        window.ononline = function () {goXLine(true);};
                        p.model.getOnLine() && navigator.onLine || goXLine(false);
                    })();
                }
            },

            /**
             * the auth list
             */
            list: {
                view: function () {return viewF(viewList);},
                model: function () {return modelF(modelList);},
                defs: function () {
                    var p = this;
                    p.model.setLoggedIn(true);
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
                    p.view.defineMethod('setOnlyOwnedFilterHandler', function (handler) {
                        p.view.setHandler([0, 4], 'change', handler);
                    })
                    p.view.defineMethod('setLogoutHandler', function (handler) {
                        p.view.setHandler([2, 0], 'click', handler);
                    });
                    p.view.defineMethod('setTotStars', function (n) {
                        p.view.getNode(0, 2, 1).innerHTML = n;
                    });
                    p.view.defineMethod('loadList', function (list ,starred) {
                        var trg = p.view.getNode(1, 0),
                            totStars = 0;
                        
                        trg.innerHTML = '';

                        list.forEach(function(item) {
                            totStars += item.stargazers_count;
                            MyApp.item({
                                append: true,
                                trg: trg,
                                item: item,
                                starred: starred.indexOf(item.id) >= 0
                            });
                        });
                        p.model.setTotStarred(totStars);
                        p.view.setTotStars(totStars);
                    });

                    p.defineMethod('logout', function () {
                        GH.logout();
                        MyApp.login({trg: trg});
                    });
                },
                init: function () {
                    var p = this,
                        model = this.model,
                        view = this.view;
                    var spinner =view.getNode(1, 0, 0),
                        imgUrl = GH.getData().userData.avatar_url;

                    spinner.style.backgroundImage = 'url(' + imgUrl + ')';

                    view.setHandler([0, 1], 'change', function () {
                        alert(CONSTANTS.WIP);
                    });

                    view.setLogoutHandler(p.logout);
                    view.loadLanguagesList(model.getLanguages());
                    view.setOnlyOwnedFilterHandler(function (e) {
                        var onlyOwned = e.target.checked,
                            list = model.getList().filter(repo => onlyOwned ? repo.fork == 0 : true);
                        view.loadList(list, model.getStarredIds());
                    });

                    Promise.all([GH.getMyRepos(), GH.getMyStarred()]).then((values) => {
                        model.setList(values[0]);
                        model.setStarredIds(values[1].map(i => i.id));
                        view.loadList(model.getList(), model.getStarredIds());
                    });

                    JMVP.events.ready(function () {
                        window.onoffline = function () {
                            Toggle(false);
                            setTimeout(function () {
                                GH.logout();
                                MyApp.login({ trg: trg });
                                Toggle(true);
                            }, 3000);
                        };
                        //and reset the one from login
                        window.ononline = function () { };
                        App.tooltip({ trg: trg, append: true });
                    });
                }
            },

            item : {
                view: function () { return viewF(viewItem); },
                model: function (params) {
                    var m  = modelF(modelItem),
                        item = params.item;

                    m.setName(item.name);
                    m.setDescription(item.description || '<i>no description</i>'),
                    m.setLink(item.html_url);
                    m.setStars(item.stargazers_count);
                    m.setWatchers(item.watchers);
                    m.setForks(item.forks_count);
                    m.setIssues(item.open_issues_count);
                    m.setIsFork(item.fork);
                    m.setLanguage(item.language || 'unknown');
                    m.setLicense(item.license ? '<a href="' + (item.license.url || 'javascript:;') + '" target="_blank">' + item.license.name + '</a>' : '<i>unset</i>');
                    m.setCreated(JMVP.util.dateFormat(item.created_at));
                    m.setPushed(JMVP.util.dateFormat(item.pushed_at));

                    m.setIsEmpty(item.size == 0)
                    m.setSize(JMVP.util.toMemFormat(item.size));                
                    m.setStarredByMe(params.starred);
                    return m;
                },
                defs: function () {
                    var pres = this,
                        tooltipApp = MyApp.tooltip.presenter;
                    pres.view.defineMethod('updateDetailsLabels', function (label, tooltip) {
                        var node = this.getNode(5, 0);
                        console.log(node);
                        node.innerHTML = label;
                        node.dataset.tooltip = tooltip;
                        tooltipApp.updateMessage(tooltip);
                    });
                    pres.view.defineMethod('toggleStar', function (starred) {
                        this.getNode(2).className = starred ? 'item_starredByMe' : 'item_notStarredByMe';
                    });
                    pres.view.defineMethod('setStarHandler', function (handler) {
                        pres.setHandler([2], 'click', handler);
                    });
                },
                init: function () {
                    var pres = this;
                    pres.view.setHandler([5, 0], 'click', function () {
                        var detailsVisible = pres.model.getDetailsVisible();
                        if (detailsVisible) {
                            pres.view.updateDetailsLabels(
                                pres.model.getDetailsLabel(),
                                pres.model.getDetailsTooltipMessage()
                            );
                        } else {
                            pres.view.updateDetailsLabels(
                                pres.model.getDetailsLabelClose(),
                                pres.model.getDetailsTooltipMessageClose()
                            );
                        }
                        pres.model.setDetailsVisible(!detailsVisible);
                        /*
                        detailsLabel: 'show more details',
                        detailsTooltipMessage: 'show more details about the repo',
                        detailsLabelClose: 'show less details',
                        detailsTooltipMessageClose: 'hide details about the repo',
                        */
                    })
                    pres.view.setStarHandler(function () {
                        var status = pres.model.getStarredByMe(),
                            newStatus = !status;
                            name = pres.model.getName();
                        Toggle(false);
                        GH[newStatus ? 'starRepo' : 'unstarRepo'](name).then(r => {

                            /**
                             * here I try to use the reference to the list presenter
                             * to manage the total stars count
                             */
                            var listPresenter = MyApp.list.presenter,
                                currentTot = listPresenter.model.getTotStarred();
                            listPresenter.model.setTotStarred(currentTot + (newStatus || -1));
                            listPresenter.view.setTotStars(listPresenter.model.getTotStarred());
                            //

                            pres.model.setStars(pres.model.getStars() + (newStatus || -1));
                            pres.model.setStarredByMe(newStatus);
                            pres.model.setWatchers(pres.model.getWatchers() + (newStatus || -1));

                            pres.view.toggleStar(pres.model.getStarredByMe());
                            pres.refresh();
                            Toggle(true);
                        }).catch((err) => {
                            console.log(err)
                        });
                        
                    });
                },
            },

            tooltip : {
                view: function () {return viewF(`<div class="tooltip">$[message]</div>`)},
                model: function () {return modelF({message: 'nothing', offset: [20, 10]})},
                defs: function () {
                    var p = this,
                        node = p.view.getNode();
                    p.view.defineMethod('showTooltip', function (m) {
                        node.innerHTML = m;
                        node.style.display = 'block';
                    });
                    p.view.defineMethod('hideTooltip', function () {
                        node.style.display = 'none';
                    });
                    p.view.defineMethod('updateMessage', function (message) {
                        node.innerHTML = message;
                    });
                },
                init: function () {
                    var p = this,
                        node = p.view.getNode(),
                        toolTipOffset = p.model.getOffset(),
                        listTrg = MyApp.list.presenter.view.getNode(); // only external ref to the panel container
                    listTrg.addEventListener('mousemove', function (e) {
                        var target = e.target,
                            offset = null;
                        if ('tooltip' in target.dataset){
                            offset = JMVP.events.getOffset(e, trg);
                            node.style.left = (offset[0] + toolTipOffset[0]) + 'px';
                            node.style.top = (offset[1] + toolTipOffset[1]) + 'px';
                            p.show(target.dataset.tooltip);
                        } else {
                            p.hide();
                        }
                    })
                    p.defineMethod('show', function (m) {
                        p.view.showTooltip(m);
                    });
                    p.defineMethod('hide', function () {
                        p.view.hideTooltip();
                    });
                    p.defineMethod('updateMessage', function (message) {
                        p.model.setMessage(message);
                        p.view.updateMessage(p.model.getMessage());
                    })
                }
            }
        });
    
    return MyApp;
})();