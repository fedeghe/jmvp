function getRouteApp (setups) {
    var ret = {
            route: {},
            app: {}
        },
        app;
    for (app in setups) {
        if (setups.hasOwnProperty(app)) {
            ret.route[setups[app].route] = app;
            ret.app[app] = setups[app].route;
        }
    }
    return ret;
}

function App (presenter, _setups) {
    this.presenter = presenter;
    var i;
    for (i in _setups) {
        if (_setups.hasOwnProperty(i) && i !== 'init') {
            this._addSetup(i, _setups[i]);
        }
    }
    if ('init' in _setups) {
        _setups['init'].call(this.presenter);
    }
    this._setups = _setups;
    this._routesApp = getRouteApp(_setups);
    this.trg = null;
    this._initPopState();
}

App.prototype._initPopState = function () {
    var self = this;
    window.addEventListener('popstate', function (/* e */) {
        var currentPath = window.location.pathname;
        if (currentPath in self._routesApp.route) {
            self[self._routesApp.route[currentPath]]();
        }
    });
};

App.prototype._addSetup = function (_setupName, _setup) {
    App.prototype[_setupName] = function (params) {
        if (params && params.trg) this.trg = params.trg;
        var p = JMVP.Presenter(),
            gotDefs = 'defs' in _setup,
            gotInit = 'init' in _setup,
            model = typeof _setup.model === 'function' ? _setup.model(params) : _setup.model,
            view = typeof _setup.view === 'function' ? _setup.view(params) : _setup.view,
            presenter = p(model, view);

        App.prototype[_setupName].presenter = presenter;
        view.setModel(model);
        presenter.model || presenter.setModel(presenter.view.model);
        // gotDefs && _setup.defs.call(presenter, params);

        if (gotInit) {
            presenter.init = function () {
                _setup.init.call(presenter, params);
            };
        }
        if (gotDefs) {
            presenter.defs = function () {
                _setup.defs.call(presenter, params);
            };
        }
        if (!(params.append)) {
            this.trg.innerHTML = '';
        }
        presenter.render.call(presenter, this.trg);
        return presenter;
    };
};

App.getRouteApp = function (setups) {
    var ret = {
            route: {},
            app: {}
        },
        app;

    for (app in setups) {
        if (setups.hasOwnProperty(app)) {
            ret.route[setups[app].route] = app;
            ret.app[app] = setups[app].route;
        }
    }
    return ret;
};
