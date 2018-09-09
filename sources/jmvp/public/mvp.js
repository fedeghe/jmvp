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
NS.Presenter = function (viewObj, modelObj) {
    function presenter(v, m) {
        this.view = v;
        this.model = m;
    };
    jmvp.extends(presenter, Presenter);
    return function _presenter(v, m) {
        v = v || viewObj;
        m = m || modelObj;
        var ret = new presenter(v, m);
        presenter.super(ret, v, m);
        return ret;
    };
};


