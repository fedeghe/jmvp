(function (W) {
    "use strict";

    var jmvp = {};
    /**
     * PRIVATE SECTION
     */
    jmvp.utils = {};
    
    jmvp.utils.ucfirst = function(a) {
        return a.slice(0, 1).toUpperCase() + a.slice(1);
    };
    
    jmvp.extends = function (Child, Parent) {
        function T() { }
        T.prototype = Parent.prototype;
        Child.prototype = new T();
        Child.prototype.constructor = Child;
        Child.superClass = Parent.prototype;
        Child.baseConstructor = Parent;
        // anyway ...
        Child.super = function (inst) {
            var args = [].slice.call(arguments, 1);
            Parent.apply(inst, args);
        }
    };
    function Model(d) {
        this._data = d;
        this._auto();
    }
    
    Model.prototype._get = function (name) {
        return this._data[name] || null;
    };
    
    Model.prototype._has = function (name) {
        return name && name in this._data;
    };
    
    Model.prototype._auto = function () {
        var data = this._data,
            self = this;
        for (var i in data)
            if (data.hasOwnProperty(i) && typeof i === 'string') {
                self._getter(i);
                self._setter(i);
            }
    };
    
    Model.prototype._setter = function(name){
        notValidModel(name, 'setter');
        var self = this;
        self['set' + jmvp.utils.ucfirst(name)] = function (value, done) {
            var cb = done
                ? done.bind(self)
                : function () {};
            self._data[name] = value;
            cb && cb(name, value);
        };
    };
    
    Model.prototype._getter = function(name){
        var self = this;
        notValidModel(name, 'getter');
        self['get' + jmvp.utils.ucfirst(name)] = function () {
            return self._data[name];
        }
    };
    
    Model.prototype.getData = function(){ return this._data;};
    
    Model.prototype.defineMethod = function (name, func){
        notValidModel(name, 'method');
        
        this.constructor.prototype[name] = func;
    };
    
    function notValidModel(n, type){
        if (n.match(/_setter|_getter|_data|_auto|defineMethod/)) {
            throw 'Forbidden ' + type + ' `' + n + '`';
        }
    }
    
    function View(tpl) {
        this.cnt = document.createElement('div');
        this.tpl = tpl.replace(/\r?\n|\r|\t|\s\s/gm, '');
        this.cnt.innerHTML  = this.tpl;
        this.node = this.cnt.childNodes[0];
        this.childs = [];
        this.model = null;
    };
    
    View.prototype._refs = function () {
        (function dig(node, acc) {
            var i = 0,
                childs = node.childNodes,
                l = childs.length,
                tmp;
            for (null; i < l; i++) {
                tmp = { node: childs[i], childs: [] };
                acc.push(tmp);
                dig(childs[i], tmp.childs);
            }
        })(this.node, this.childs);
    };
    
    View.prototype.setModel = function (model) {
        this.model = model;
        this.tpl = this.tpl.replace(/\$\[([^\]]*)\]/mg, function (a, b) {
            return model._data[b];
        }).replace(/\{([^\}]*)\}/mg, function (a, b) {
            return (new Function('return ' + b))();
        });
        this.cnt.innerHTML = this.tpl;
        this.node = this.cnt.childNodes[0]; 
        this._refs();
    
    };
    
    View.prototype.setHandler = function(nodePath, ev, handler) {
        try{
            var n = this.getNode.apply(this, nodePath);
        } catch(e){
            console.log(e)
        }
        if (n){
            n.addEventListener(ev, handler);
            return function () {
                n.removeEventListener(ev, handler);
            }
        } else {
            return false;
        }
    };
    
    View.prototype.defineMethod = function (name, func) {
        // this[name] = func.bind(this);
        this.constructor.prototype[name] = func;
    };
    
    // what about memoization?
    View.prototype.getNode = function () {
        var a = [].slice.call(arguments),
            ret = this,
            childs = this.childs,
            i = 0, l = a.length;
            
        for (null; i < l; i++) {
            ret = childs[a[i]]; 
            if (!ret) throw a + ' not found, handler not settable';
            childs = ret.childs;
        }
        return ret && ret.node;
    };
    
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
        // this.init = function (){};
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
        return this.view.node;
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
    
    
    

    /**
     * PUBLIC through JMVP
     */
    var NS = {};
    /**
     * Model
     */
    
    NS.Model = function (data) {
        function model(d) { this._data = d || data; };
        jmvp.extends(model, Model);
        return function (d){
            var ret = new model(d || data);
            model.super(ret, d || data);
            return ret;
        };
    };
    
    /**
     * View
     */
    NS.View = function (tpl) {
        function view(t) { this.tpl = t || tpl; };
        jmvp.extends(view, View);
        return function _view(t) {
            var ret = new view(t || tpl);
            view.super(ret, t || tpl);
            return ret;
        };
    };
    
    /**
     * Presenter
     */
    NS.Presenter = function (modelObj, viewObj) {
        function presenter(m, v) {
            this.model = m;
            this.view = v;
        };
        jmvp.extends(presenter, Presenter);
        return function _presenter(m, v) {
            m = m || modelObj;
            v = v || viewObj;
            var ret = new presenter(m, v);
            presenter.super(ret, m, v);
            return ret;
        };
    };
    
    
    
    
    
    
    
    // publish
    W.JMVP = NS;
})(window);
