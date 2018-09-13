function Presenter(model, view) {
    this.model = model || null;
    this.view = view || null;
    this.trg = null;
    this._definedMethods = {};
    this._setups= {};
    this._handlersResetFuncs = [];
};

Presenter.prototype.init = function () {};
Presenter.prototype.setView = function (view) {this.view = view;};
Presenter.prototype.setModel = function (model) {this.model = model;};

Presenter.prototype.reset = function (resetDefined) {
    try {
        if (resetDefined) {
            this._resetDefineMethod();
        }
        this._resetHandlers();
        this.model = null;
        this.view = null;
        this.trg.innerHTML = '';
    } catch (e) {
        return false;
    }
    return true
};

Presenter.prototype._resetHandlers = function () {
    for (var i = 0, l = this._handlersResetFuncs.length; i < l; i++){
        this._handlersResetFuncs[i]();
    }
};
Presenter.prototype.setHandler = function () {
    var t = this.view.setHandler.apply(this.view, arguments);
    t && this._handlersResetFuncs.push(t);
};

Presenter.prototype.getNode = function () {
    return this.view.getNode.apply(this.view, arguments);
};

Presenter.prototype._resetDefineMethod = function () {
    for (var k in this._definedMethods) {
        delete this._definedMethods[k];
    }
    this._definedMethods = {};
};
Presenter.prototype.defineMethod = function (name, func) {
    // this[name] = func.bind(this);
    this.constructor.prototype[name] = func;
    this._definedMethods[name] = true;
};

Presenter.prototype.render = function (trg) {
    if (trg) this.trg = trg;
    if (!this.view) {
        throw 'ERROR: presenter with no view'
    }
    if (!this.view.model) {
        throw 'ERROR: view with no model'
    }
    this.init();
    this.trg && this.trg.appendChild(this.getNode());
};

Presenter.prototype.getSetupsManager = function (setups) {
    this._setups = Object.assign(this._setups, setups);
    return new App(this, setups);
};

function getRouteApp(setups) {
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
}
