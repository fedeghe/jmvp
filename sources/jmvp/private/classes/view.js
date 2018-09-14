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
    this.constructor.prototype[name] = func; // no bind!!!
};

// what about memoization?
View.prototype.getNode = function () {
    var a = [].slice.call(arguments),
        ret = this,
        childs = this.childs,
        i = 0, l = a.length;
        
    for (null; i < l; i++) {
        ret = childs[a[i]]; 
        if (!ret) {
            throw a + ' not found, handler not settable';
        }
        childs = ret.childs;
    }
    return ret && ret.node;
};
