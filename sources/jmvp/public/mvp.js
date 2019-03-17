/**
 * Model
 */
NS.Model = function (data) {
    function Tmodel (d) { this._data = d || data; };
    jmvp.extends(Tmodel, Model);
    return function (d) {
        var ret = new Tmodel(d || data);
        Tmodel.super(ret, d || data);
        return ret;
    };
};

/**
 * View
 */
NS.View = function (tpl, model) {
    function Tview (t) {
        this.tpl = t || tpl;
    };
    jmvp.extends(Tview, View);
    return function (t, m) {
        var ret = new Tview(t || tpl, m);
        Tview.super(ret, t || tpl, m);
        return ret;
    };
};

/**
 * Presenter
 */
NS.Presenter = function (modelObj, viewObj) {
    function Tpresenter (m, v) {
        this.model = m;
        this.view = v;
    };
    jmvp.extends(Tpresenter, Presenter);
    return function (m, v) {
        m = m || modelObj;
        v = v || viewObj;
        var ret = new Tpresenter(m, v);
        Tpresenter.super(ret, m, v);
        return ret;
    };
};
