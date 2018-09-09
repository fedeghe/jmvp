function Presenter(view, model) {
    this.view = view;
    this.model = model;
};

Presenter.prototype.init = function () {
    throw 'Please define the init';
};

Presenter.prototype.setModel = function (model) {
    this.model = model;
};

Presenter.prototype.setHandler = function () {
    this.view.setHandler.apply(this.view, arguments);
};

Presenter.prototype.getNode = function () {
    return this.view.node;
};

Presenter.prototype.render = function (trg) {
    this.init();
    trg.appendChild(this.view.node);
};

