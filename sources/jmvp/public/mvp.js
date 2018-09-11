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





