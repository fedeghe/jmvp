function App(presenter, _setups) {
    this.presenter = presenter;
    var i;
    for (i in _setups) {
        if (_setups.hasOwnProperty(i) && i !== 'start') {
            this._addSetup(i, _setups[i]);
        }
    }
    if ('init' in _setups){
        _setups['init'].call(this.presenter);
    }
    this._setups = _setups;
    this._routesApp = getRouteApp(_setups);
    this._initPopState();
}
App.prototype._initPopState = function () {
    var self = this;
    window.addEventListener("popstate", function (e) {
        var currentPath = window.location.pathname;
        if (currentPath in self._routesApp.route) {
            self[self._routesApp.route[currentPath]]();
        }
    });
};

App.prototype._addSetup = function (_setupName, _setup) {
    console.log(`setting up ${_setupName}`, _setup);

    var presenter = this.presenter;

    App.prototype[_setupName] = function (params) {
        var gotDefs = 'defs' in _setup,
            gotInit = 'init' in _setup;

        presenter.trg = (params && params.trg) || presenter.trg;
        if (params) delete params.trg;
        _setup.route && window.history.pushState(params, null, _setup.route);

        presenter.reset(gotDefs);
        presenter.setModel(_setup.model);
        presenter.setView(_setup.view);

        _setup.view.model == null && _setup.view.setModel(_setup.model);
        gotDefs && _setup.defs.call(presenter, params);
        gotInit && _setup.init.call(presenter, params);
        presenter.render();
        return true;
    }
};

App.getRouteApp = function (setups) {
    var ret = {
        route: {},
        app: {},
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