var App = (function () {
    var CONSTANTS = {
            WIP: 'Sorry this feature is not yet implemented! ...come back to check, or simply watch the repo!!! :D',
            MODES : {
                USER: 'USER',
                GITHUB: 'GITHUB'
            }
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
                        <label class="login__label">access token</label>
                        <input class="login__input" type="text"/>
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
            defaultLang: "$LANGUAGES.DEFAULT$",
            totStarred: 0,
            username: null,
            loggedIn: false,
            mode: CONSTANTS.MODES.$STARTING_MODE$
        },

        viewList = `<div class="panel">
                <div class="panel__header">
                    <div class="hfMargin">
                        <p>
                            <strong>$[username] </strong><i class="iconBefore panel__fame"></i>
                        </p>
                        <p>
                            <strong>#Repos: </strong>
                            <span></span>
                        </p>
                        <p>
                            <input id="only_owned" type="checkbox" />
                            <label for="only_owned">Only owned</label>
                        </p>
                        <div class="panel__header__switch" data-tooltip="switch to public">
                            <span class="icon panel__header__switch__user"></span>
                            <span class="icon panel__header__switch__arrowdown"></span>
                            <span class="icon panel__header__switch__github"></span>
                        </div>
                    </div>
                </div>
                <div class="panel__body">
                    <ul class="panel__list">
                        <li class="spinner"></li>
                    </ul>
                </div>
                <div class="panel__footer">
                    <span class="iconBefore panel__logout" data-tooltip="... where are you going?">EXIT</span>
                </div>
        </div>`,

        viewList2 = `<div class="panel">
                <div class="panel__header">
                    <div class="hfMargin">
                        <p><strong>$[username] </strong></p>
                        <p>
                            <label>Language: </label>
                            <select></select>
                        </p>
                        <p><!--
                            <label>User</label>
                            <input type="text"/><i class="fa fa-close"></i>
                        --></p>
                        <div class="panel__header__switch" data-tooltip="switch to Your user">
                            <span class="icon panel__header__switch__user"></span>
                            <span class="icon panel__header__switch__arrowup"></span>
                            <span class="icon panel__header__switch__github"></span>
                        </div>
                    </div>
                </div>
                <div class="panel__body">
                    <ul class="panel__list">
                        <li class="spinner"></li>
                    </ul>
                </div>
                <div class="panel__footer">
                    <span class="iconBefore panel__logout" data-tooltip="... where are you going?">EXIT</span>
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
            owner: null,
            isEmpty: null
        },

        viewItem = `<li class="item{$[isFork] ? ' fork': ''}{$[isEmpty] ? ' emptyRepo': ''}" {$[isEmpty] ? 'data-tooltip="this repository is empty"': ''}>
            <a href="$[link]" target="_blank" class="item__name">$[name]</a>
            <p class="item__description">$[description]</p>
            <span class="iconAfter {$[starredByMe] ? 'item_starredByMe' : 'item_notStarredByMe'}" {$[isEmpty] ? 'data-tooltip="really want to star a empty repo???"': ''}></span>
            <div>
                {$[stars] ? '<span data-tooltip="stars" class="icon iconAfter item_stars">$[stars]</span>' : ''}
                {$[watchers] ? '<span data-tooltip="watchers" class="icon iconAfter item_watchers">$[watchers]</span>' : ''}
                {$[forks] ? '<span data-tooltip="forks" class="icon iconAfter item_forks">$[forks]</span>' : ''}
                {$[issues] ? '<span data-tooltip="issues" class="icon iconAfter item_issues">$[issues]</span>' : ''}
            </div>
            <hr>
            <details class="item__details">
                <summary class="item__details_summary" data-tooltip="$[detailsTooltipMessage]">$[detailsLabel]</summary>
                <ul class="item__details_summary_list">
                    <li class="item__details_summary_list__item">
                        <strong>Size:</strong> $[size]
                    </li>
                    <li class="item__details_summary_list__item">
                        <strong>Language:</strong> $[language]
                    </li>
                    <li class="item__details_summary_list__item">
                        <strong>Created:</strong> $[created]
                    </li>
                    <li class="item__details_summary_list__item">
                        <strong>Last push:</strong> $[pushed]
                        </li>
                    <li class="item__details_summary_list__item">
                        <strong>License:</strong> $[license]
                        </li>
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

                    function enter(mode, s) {
                        window.setTimeout(function () {
                            p.stop();
                            MyApp.list({mode: mode, trg: trg});
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
                        var usr = p.view.getNode(0, 1, 1).value.replace(/@.*/, ''),
                            token = p.view.getNode(0, 2, 1).value;
                        p.view.toggleButtonsFunc(false);

                        GH.login(usr, token).then(() => {
                            p.updateMessage('Logged in correctly');
                            enter('USER');
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
                        //enter('skip');
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
                        MyApp.list({trg: trg}); // pass trg in case of refresh
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
                view: function (p) {
                    console.log('in the VIEW init');
                    console.log(p);
                    return viewF(p.mode === CONSTANTS.MODES.GITHUB ? viewList2 : viewList);
                },
                model: function (p) {
                    console.log('in the MODEL init');
                    console.log(p);
                    var userData = GH.getData();
                    modelList.username = userData.usr;
                    return modelF(modelList);
                },
                defs: function (params) {
                    var p = this,
                        mode = params.mode || p.model.getMode();
                    console.log('Mode is >>> ' + mode)
                    p.model.setMode(mode);
                    p.model.setLoggedIn(true);
                    

                    p.view.defineMethod('setSwitchModeHandler', function (func) {
                        p.view.setHandler([0, 0, 3], 'click', func);
                    });
                    switch (mode) {
                        case CONSTANTS.MODES.USER: 
                            /**
                             * define view interface
                             */

                            p.view.defineMethod('setOnlyOwnedFilterHandler', function (handler) {
                                p.view.setHandler([0, 0, 2, 0], 'change', handler);
                            })
                            p.view.defineMethod('setLogoutHandler', function (handler) {
                                p.view.setHandler([2, 0], 'click', handler);
                            });
                            p.view.defineMethod('setTotStars', function (n) {
                                p.view.getNode(0, 0, 0, 1).innerHTML = n;
                            });
                            p.view.defineMethod('loadList', function (list, starred) {
                                var trg = p.view.getNode(1, 0),
                                    $counter = p.view.getNode(0, 0, 1, 1),
                                    totStars = 0,
                                    counter = {
                                        own: 0,
                                        fork: 0
                                    };
                                trg.innerHTML = '';

                                list.forEach(function (item) {
                                    totStars += item.stargazers_count;
                                    counter[item.fork ? 'fork' : 'own']++;
                                    MyApp.item({
                                        append: true,
                                        trg: trg,
                                        item: item,
                                        starred: starred.indexOf(item.id) >= 0
                                    });
                                });
                                $counter.innerHTML = list.length + (counter.fork ? (' (' + counter.fork) + ' forks)' : '');
                                p.model.setTotStarred(totStars);
                                p.view.setTotStars(totStars);
                            });
                            break;
                        case CONSTANTS.MODES.GITHUB:
                            console.log('defs github mode');

                            p.view.defineMethod('setLogoutHandler', function (handler) {
                                p.view.setHandler([2, 0], 'click', handler);
                            });
                            p.view.defineMethod('loadLanguagesList', function (list) {
                                var trg = p.view.getNode(0, 0, 1, 1);
                                list.forEach(function (lang) {
                                    var item = document.createElement('option');
                                    item.innerHTML = lang;
                                    if (lang == p.model.getDefaultLang()) item.setAttribute('selected', 'selected');
                                    trg.appendChild(item);
                                });
                            });
                            p.view.defineMethod('showSpinner', function (func) {
                                var trg = this.getNode(1, 0),
                                    imgUrl = GH.getData().userData.avatar_url,
                                    spinner = document.createElement('li');
                                spinner.className = 'spinner';
                                spinner.style.backgroundImage = 'url(' + imgUrl + ')';
                                trg.innerHTML = '';
                                trg.appendChild(spinner);
                            });
                            p.view.defineMethod('setChangeLanguageHandler', function (func) {
                                this.setHandler([0, 0, 1, 1], 'change', func);
                            });
                            p.view.defineMethod('loadList', function (list, starred) {
                                var trg = p.view.getNode(1, 0),
                                    
                                    counter = {
                                        own: 0,
                                        fork: 0
                                    };
                                trg.innerHTML = '';

                                list.items.forEach(function (item) {
                                    counter[item.fork ? 'fork' : 'own']++;
                                    MyApp.item({
                                        append: true,
                                        trg: trg,
                                        item: item,
                                        starred: starred.indexOf(item.id) >= 0
                                    });
                                });
                                
                            });
                            break;
                        default: 
                            alert('Wrong mode')
                            break;
                    }
                    


                    //common
                    p.defineMethod('logout', function () {
                        GH.logout();
                        MyApp.login({trg: trg});
                    });
                },
                init: function () {
                    var p = this,
                        model = this.model,
                        view = this.view,
                        vRoot = view.getNode(),
                        mode = p.model.getMode();
                    
                    var spinner = view.getNode(1, 0, 0),
                        imgUrl = GH.getData().userData.avatar_url;
                    spinner.style.backgroundImage = 'url(' + imgUrl + ')';

                    switch (mode) {
                        case CONSTANTS.MODES.USER: 

                            // view.setHandler([0, 1], 'change', function () {
                            //     alert(CONSTANTS.WIP);
                            // });

                            view.setLogoutHandler(p.logout);
                            
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
                            break;

                        case CONSTANTS.MODES.GITHUB:
                            console.log('init github mode');
                            view.loadLanguagesList(model.getLanguages());
                            
                            view.setLogoutHandler(p.logout);

                            view.setChangeLanguageHandler(function (e) {
                                var lang = e.target.value;
                                if (!lang) return;
                                model.setDefaultLang(lang);
                                view.showSpinner();
                                GH.getMostStarred(lang).then((values) => {
                                    model.setList(values);
                                    view.loadList(model.getList(), model.getStarredIds());    
                                })
                            })

                            Promise.all([GH.getMostStarred('javascript'), GH.getMyStarred()]).then((values) => {
                                model.setList(values[0]);
                                model.setStarredIds(values[1].map(i => i.id));
                                view.loadList(model.getList(), model.getStarredIds());
                            });

                            break;
                        default:
                            alert('Wrong mode')
                            break;
                    }

                    view.setSwitchModeHandler(function () {
                        var currentMode = model.getMode(),
                            newMode = currentMode === CONSTANTS.MODES.GITHUB
                                ? CONSTANTS.MODES.USER
                                : CONSTANTS.MODES.GITHUB;
                        model.setMode(newMode);
                        MyApp.list({trg: trg, mode : newMode});
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
                        MyApp.tooltip({ append: true });
                        MyApp.dialog({ trg: vRoot, append: true });
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
                    m.setOwner(item.owner.login);
                    m.setLanguage(item.language || 'unknown');
                    m.setLicense(item.license ? '<a href="' + (item.license.url || 'javascript:;') + '" target="_blank">' + item.license.name + '</a>' : '<i>unset</i>');
                    m.setCreated(JMVP.util.dateFormat(item.created_at));
                    m.setPushed(JMVP.util.dateFormat(item.pushed_at));

                    m.setIsEmpty(item.size == 0)
                    m.setSize(JMVP.util.toMemFormat(item.size * 1024, 'B'));
                    m.setStarredByMe(params.starred);
                    return m;
                },
                defs: function () {
                    var pres = this;
                    pres.view.defineMethod('updateDetailsLabels', function (label, tooltip) {
                        var node = this.getNode(5, 0);
                        node.innerHTML = label;
                        node.dataset.tooltip = tooltip;
                        MyApp.tooltip.presenter.updateMessage(tooltip);
                    });
                    pres.view.defineMethod('toggleStar', function (starred) {
                        this.getNode(2).className = starred ? 'item_starredByMe' : 'item_notStarredByMe';
                    });
                    pres.view.defineMethod('setStarHandler', function (handler) {
                        pres.setHandler([2], 'click', handler);
                    });
                },
                init: function () {
                    var pres = this,
                        userData = GH.getData();
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
                    });
                    pres.view.setStarHandler(function () {

                        var dialog = MyApp.dialog.presenter,
                            view = this,
                            status = pres.model.getStarredByMe(),
                            askStartConfirmation = $SETTINGS.ASK_STARRING_CONFIRM$,
                            askUnstartConfirmation = $SETTINGS.ASK_UNSTARRING_CONFIRM$,
                            itsYourRepo = userData.usr === pres.model.getOwner();
                        
                        (   itsYourRepo
                            &&
                            (askStartConfirmation && !status)
                            ||
                            (askUnstartConfirmation && status)
                        ) ? dialog.show(
                            proceed,
                            'Really You want to '+ (status ? '<b>un</b>' : '') + 'star <u>Your own</u> repo?'
                        ) : proceed();

                        function proceed() {
                            var newStatus = !status;
                                name = pres.model.getName(),
                                owner = pres.model.getOwner();
                            Toggle(false);
                            GH[newStatus ? 'starRepo' : 'unstarRepo'](name, owner).then(r => {

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
                                dialog.hide();
                                Toggle(true);
                            }).catch((err) => {
                                console.log(err)
                            });

                        }
                        
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
                        listTrg = MyApp.list.presenter.view.getNode(),  //
                        content = MyApp.list.presenter.view.getNode(1); // only 2 external ref to the panel container

                    content.addEventListener('scroll', function () {
                        p.hide();
                    });
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
            },

            dialog: {
                view: function () { return viewF(`
                    <div class="dialog">
                        <div class="dialog--box">
                            <p class="dialog__message">$[message]</p>
                            <div>
                                <button class="dialog__button dialog--confirm">$[confirmLabel]</button>
                                <button class="dialog__button dialog--abort">$[abortLabel]</button>
                            </div>
                        </div>
                    </div>
                `) },
                model: function () {
                    return modelF({
                        message: 'no message',
                        confirmLabel: 'Confirm',
                        abortLabel: 'Discard'
                    })
                },
                defs: function () {
                    var p = this,
                        node = p.view.getNode();
                    p.view.defineMethod('show', function () {
                        node.style.display = 'block';
                    });
                    p.view.defineMethod('hide', function () {
                        node.style.display = 'none';
                    });
                    
                    p.view.defineMethod('setup', function (func, msg, confirm, abort) {
                        p.model.setMessage(msg || 'no message');
                        confirm && p.model.setConfirmLabel(confirm);
                        abort && p.model.setAbortLabel(abort);
                        var $message = this.getNode(0, 0),
                            $confirm = this.getNode(0, 1, 0),
                            $abort = this.getNode(0, 1, 1);
                        $message.innerHTML = p.model.getMessage();
                        $confirm.innerHTML = p.model.getConfirmLabel();
                        $abort.innerHTML = p.model.getAbortLabel();
                        $confirm.addEventListener('click', func);
                        $abort.addEventListener('click', this.hide);
                        this.show();
                    });
                },
                init: function () {
                    var p = this;
                    p.defineMethod('show', function (func, msg, confirm, abort) {
                        p.refresh();
                        p.view.setup(func, msg, confirm, abort);
                    });
                    p.defineMethod('hide', function (func, msg, confirm, abort) {
                        p.view.hide();
                    });
                }
            }
        });
    
    return MyApp;
})();