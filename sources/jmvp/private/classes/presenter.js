function Presenter() {
    this.model = null;
    this.view = null;
    this.trg = null;
    this._definedOnes = {};

    this._setups= {};
    this._handlersResetFuncs = [];
};

Presenter.prototype.init = function () {};
Presenter.prototype.setView = function (view) {this.view = view;};
Presenter.prototype.setModel = function (model) {this.model = model;};

Presenter.prototype.reset = function (resetDefined) {
    if (resetDefined) {
        this._resetDefineMethod();
    }
    this._resetHandlers();
    this.model = null;
    this.view = null;
    this.trg.innerHTML = '';
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
    for (var k in this._definedOnes) {
        delete this._definedOnes[k];
    }
    this._definedOnes = {};
};
Presenter.prototype.defineMethod = function (name, func) {
    // this[name] = func.bind(this);
    this.constructor.prototype[name] = func;
    this._definedOnes[name] = true;
};

Presenter.prototype.render = function (trg) {
    if (trg) this.trg = trg;
    if (!this.view.model) {
        throw 'ERROR: view with no model'
    }
    this.init();
    this.trg && this.trg.appendChild(this.getNode());
};

Presenter.prototype.getSetupsManager = function (setups) {
    var self = this,
        mode = null;
    this._setups = setups;
    return function(setupName, trg){
        self.trg = trg || self.trg;
        var mode, gotDefs, gotInit;
        if (setupName in self._setups) {
            
            mode = self._setups[setupName];
            gotDefs = 'defs' in mode;
            gotInit = 'init' in mode;
            
            self.reset(gotDefs);
            self.setModel(mode.model);
            self.setView(mode.view);
            
            mode.view.model == null && mode.view.setModel(mode.model);
            gotDefs && self._setups[setupName].defs.call(self);
            gotInit && self._setups[setupName].init.call(self);
            self.render();
            return true;
        }
        return false;
    }
};

