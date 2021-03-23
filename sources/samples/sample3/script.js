var mFact = JMVP.Model(),
    vFact = JMVP.View(),
    pFact = JMVP.Presenter(),
    model1 = mFact({list: []}),
    view1 = vFact(`<div>
        <button nid="add-button">Create a random number</button>
        <table></table>
    </div>`),
    presenter1 = pFact(model1, view1);

view1.setModel(model1);
view1.defineMethod('addRandom', function (number) {
    var model2 = mFact({number: number}),
        view2 = vFact(`<tr>
            <td>$[number]</td>
            <td><button nid="x">-</button></td>
        </tr>`),
        pres2 = pFact(model2, view2);
    
    view2.setModel(model2);
    view2.defineMethod('setClickHandler', function (cb){
        view2.setHandler('x', 'click', cb)
    });
    pres2.init = function () {
        var view = this.view;
        view.setClickHandler(function () {
            view.remove()
        });
        // or 
        // view.setClickHandler(view.remove.bind(view));
    };
    pres2.render(this.getNode(1));
});

view1.defineMethod('setAddRandomHandler', function (cb) {
    view1.setHandler('add-button', 'click', cb);
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

console.log(presenter1)
