function View (tpl, model) {
    this.cnt = document.createElement('template');
    this.tpl = tpl.replace(/\r?\n|\r|\t|\s\s/gm, '');
    this.cnt.innerHTML = this.tpl;
    this.node = this.cnt.content.firstChild;
    // debugger;
    this.childs = [];
    this.model = model ? Object.assign({}, model) : null;
    this.handlers = [];
    this.model && this.setModel(this.model);
    this.cache = {};
};

View.prototype._refs = function () {
    // debugger;
    (function dig (node, acc) {
        var i = 0,
            childs = node.children,
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
    this.reset();
    this.model = model;
    var tpl = this.tpl.replace(/\$\[([^\]]*)\]/mg, function (a, b) {
        return model._data[b];
    }).replace(/\{([^}]*)\}/mg, function (a, b) {
        // return (new Function('return ' + b))();
        return eval('(' + b + ')');
    });
    this.cnt.innerHTML = tpl;
    this.node = this.cnt.content.firstChild;
    this._refs();
};

View.prototype.reset = function () {
    for (var i = 0, l = this.handlers.length; i < l; i++) {
        this.handlers[i].call(this);
    }
    this.handlers = [];
    this.childs = [];
};

View.prototype.setHandler = function (nodePath, ev, handler) {
    var resetHandler,
        n;
    try {
        n = this.getNode.apply(this, nodePath);
    } catch (e) {
        console.log(e);
    }
    if (n) {
        n.addEventListener(ev, handler);
        resetHandler = function () {
            n.removeEventListener(ev, handler);
        };
        this.handlers.push(resetHandler);
        return resetHandler;
    } else {
        return false;
    }
};

View.prototype.remove = function () {
    this.node.parentNode.removeChild(this.node);
};
View.prototype.defineMethod = function (name, func) {
    this.constructor.prototype[name] = func; // no bind!!!
};

// what about memoization?

// View.prototype.getNode = function () {
//     var a = [].slice.call(arguments),
//         key = a.join(':') || 'root',
//         ret = this,
//         i = 0, l = a.length,
//         childs;
//     if (!(key in this.cache)) {
//         childs = this.childs;
//         for (null; i < l; i++) {
//             ret = childs[a[i]];
//             if (!ret) {
//                 throw a + ' not found, handler not settable';
//             }
//             childs = ret.childs;
//         }
//         this.cache[key] = ret && ret.node;
//         // console.log("CACHED");
//         // console.log(key, this.cache[key]);
//     } else {
//         // console.log("GOT IT");
//         // console.log(key, this.cache[key]);
//     }
//     return this.cache[key];
// };
View.prototype.getNode = function () {
    var a = [].slice.call(arguments),
        ret = this,
        i = 0, l = a.length,
        childs = this.childs;

    for (null; i < l; i++) {
        ret = childs[a[i]];
        if (!ret) {
            throw new Error(a + ' not found, handler not settable');
        }
        childs = ret.childs;
    }
    return ret && ret.node;
};

View.prototype.getNodeByNid = function (nid) {
    return this.node.querySelector('[nid="' + nid + '"]');
};
