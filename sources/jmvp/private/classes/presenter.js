function Presenter(model, view) {
    this.model = model || null;
    this.view = view || null;
    this.trg = null;
    this._definedMethods = {};
    this._setups= {};
    this.active = true;
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
        this.view.reset();
        this.model = null;
        this.view = null;
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
    this.constructor.prototype[name] = func; //no bind
    this._definedMethods[name] = true;
};

Presenter.prototype.render = function (trg) {
    if (!this.view) {
        throw 'ERROR: presenter with no view'
    }
    if (!this.view.model) {
        throw 'ERROR: view with no model'
    }
    this.trg = trg;
    this.defs.call(this);
    this.init.call(this);

    this.active && trg.appendChild(this.getNode());
    
};
Presenter.prototype.stop = function () {
    this.active = false;
};

Presenter.prototype.refresh = function () {
    var n  = this.getNode();
    
    this.view.setModel(this.model);
    this.setModel(this.model);
    this.setView(this.view);
    this.view.reset();
    this.view._refs();
    this.trg.replaceChild(
        this.view.node,
        n
    );
    
    this.defs.call(this);
    this.init.call(this);
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
