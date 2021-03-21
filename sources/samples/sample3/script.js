var mFact = JMVP.Model(),
    vFact = JMVP.View(),
    pFact = JMVP.Presenter(),
    model1 = mFact({list: []}),
    view1 = vFact(`<div><button>+</button><ul></ul></div>`),
    presenter1 = pFact(model1, view1);

view1.setModel(model1);
view1.defineMethod('addRandom', function (number) {
    var model2 = mFact({number: number}),
        view2 = vFact(`<li>
            <span>$[number]</span>
            <button>-</button>
        </li>`),
        pres2 = pFact(model2, view2);
    
    view2.setModel(model2);
    view2.setHandler([1], 'click', function () {
        view2.remove()
    });
    pres2.render(this.getNode(1))
});

view1.defineMethod('setAddRandomHandler', function (cb) {
    view1.setHandler([0], 'click', cb);
});

presenter1.init = function () {
    var self = this;
    this.defineMethod('addNumber', function (n) {
        var list = self.model.getList();
        list.push(n);
        self.model.setList(list);
        self.view.addRandom(n);
    });
    this.view.setAddRandomHandler(function () {
        self.addNumber(Math.random().toFixed(3));
    });
};

presenter1.render(document.getElementById('trg'));
