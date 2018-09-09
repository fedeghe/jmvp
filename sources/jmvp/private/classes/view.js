function View(tpl) {
    var t = document.createElement('div'),
        self = this;
    this.tpl = tpl.replace(/\r?\n|\r|\t|\s\s/gm, '');;
    t.innerHTML = this.tpl;
    this.node = t.childNodes[0];
    this.childs = [];
    this._init();
};

View.prototype._init = function () {
    this._refs();
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
    (function dig(node) {
        var i = 0,
        childs = node.childNodes,
        l = childs.length,
        tmp, vname;
        if (node.nodeName === '#text') {
            while(tmp = node.textContent.match(/{([^}]*)}/)) {
                vname = tmp && tmp[1];
                node.textContent = node.textContent.replace(
                    tmp[0],
                    vname && model._has(vname)
                    ? model._data[vname]
                    : ''
                );
            }
        }
        for (null; i < l; i++) {            
            dig(childs[i]);
        }
    })(this.node);
};

View.prototype.setHandler = function(nodePath, ev, handler) {
    try{
        var n = this.getNode.apply(this, nodePath);
    } catch(e){
        console.log(e)
    }
    return n && n.addEventListener(ev, handler);
};

View.prototype.defineMethod = function (name, func) {
    this[name] = func.bind(this);
};

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
