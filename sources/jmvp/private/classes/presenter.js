function Presenter(model, view) {
    this.model = model;
    this.view = view;
};

Presenter.prototype.init = function () {};

Presenter.prototype.setModel = function (model) {
    this.model = model;
};
Presenter.prototype.setView = function (view) {
    this.model = view;
};

Presenter.prototype.setHandler = function () {
    this.view.setHandler.apply(this.view, arguments);
};

Presenter.prototype.getNode = function () {
    return this.view.node;
};

Presenter.prototype.defineMethod = function (name, func) {
    this[name] = func.bind(this);
};

Presenter.prototype.render = function (trg) {
    this.init();
    trg.appendChild(this.view.node);
};

