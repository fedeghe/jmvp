var mFact = JMVP.Model(),
    vFact = JMVP.View(),
    pFact = JMVP.Presenter(),
    model1 = mFact({list: []}),
    view1 = vFact(`<div>
        <button>Create a random number</button>
        <ul></ul>
    </div>`),
    presenter1 = pFact(model1, view1);

view1.setModel(model1);
view1.defineMethod('addRandom', function (number) {
    var model2 = mFact({number: number}),
        view2 = vFact(`<li>
            <span>$[number]</span>
            <p>
                <strong>$[number]</strong>
            </p>
            <div><button nid="x">-</button></div>
        </li>`),
        pres2 = pFact(model2, view2);
    
    view2.setModel(model2);

    /**
     * here view could do it directly as 
     */
     // view2.setHandler([1], 'click', function () {view2.remove()})

    /**
     * instead the view must only allow the presenter
     * to add a handler dynamically
     */
    view2.defineMethod('setClickHandler', function (cb){
        view2.setHandler([2, 0], 'click', cb)
    });
    pres2.init = function () {
        var view = this.view;
        view.setClickHandler(function () {
            console.log(view.getNodeByNid('x'))
            console.log(view.getNode(0))
            console.log(view.getNode(1))
            console.log(view.getNode(2))
            console.log(view.getNode(2, 0))
            view.remove()
        });
        // or 
        // view.setClickHandler(view.remove.bind(view));
    };
    pres2.render(this.getNode(1));
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

console.log(presenter1)
