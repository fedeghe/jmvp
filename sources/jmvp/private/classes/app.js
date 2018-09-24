function App(presenter, _setups) {
    this.presenter = presenter;
    var i;
    for (i in _setups) {
        if (_setups.hasOwnProperty(i) && i !== 'initialize') {
            this._addSetup(i, _setups[i]);
        }
    }
    if ('initialize' in _setups){
        _setups['initialize'].call(this.presenter);
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

    App.prototype[_setupName] = function (params) {
        var p = JMVP.Presenter();
        console.log(_setupName);
        var self = this,
            gotDefs = 'defs' in _setup,
            gotInit = 'init' in _setup;

        // presenter.trg = (params && params.trg) || presenter.trg;
        // if (params) delete params.trg;
        // _setup.route && window.history.pushState(params, null, _setup.route);

        
        
        var model = _setup.model(params),
            view = _setup.view(params);
        var presenter = p(model, view);
        // presenter.reset(gotDefs);
        // presenter.setModel(model);
        // presenter.setView(view);

        view.setModel(model);
        presenter.model || presenter.setModel(presenter.view.model);
        gotDefs && _setup.defs.call(presenter, params);

        if (gotInit) presenter.init = function () {
            _setup.init.call(presenter, params);
        };
        if (gotDefs) presenter.defs = function () {
            _setup.defs.call(presenter, params);
        };
        if (!(params.append))params.trg.innerHTML = '';
        presenter.render.call(presenter, params.trg);
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
