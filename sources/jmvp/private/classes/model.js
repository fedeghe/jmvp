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
    this.constructor.prototype[name] = func; // no bind!!!
};

function notValidModel(n, type){
    if (n.match(/_setter|_getter|_data|_auto|defineMethod/)) {
        throw 'Forbidden ' + type + ' "' + n + '"';
    }
}
