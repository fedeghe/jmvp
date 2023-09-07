var mFact = JMVP.Model(),
    vFact = JMVP.View(),
    pFact = JMVP.Presenter(),
    model1 = mFact({list: []}),
    view1 = vFact(`<div>
        <button data-nid="add-button">Create a random number</button>
        <p>Numbers in list: <span data-nid="num"></span></p>
        <table data-nid="table"></table>
    </div>`),
    presenter1 = pFact(model1, view1);

view1.setModel(model1);

view1.defineMethod('setAddHandler', function (f) {
    view1.setHandler(view1.getNode('add-button'), 'click', f)
});

view1.defineMethod('addNode', function () {
    var list = model1.getList(),
        rnd = Math.random().toFixed(3),
        $table = view1.getNode('table'),
        $num = view1.getNode('num'),
        model = mFact({number: rnd}),
        view = vFact(`<tr data-nid="line">
            <td>$[number]</td>
            <td><button data-nid="remove">-</button></td>
        </tr>`),
        presenter = pFact(model, view);

    list.push(rnd);
    model1.setList(list);
    $num.innerHTML = list.length;

    view.setModel(model);
    view.setHandler(view.getNode('remove'), 'click', function () {
        view1.removeNode(view.node, rnd)
    })   
    presenter.render($table)
});

view1.defineMethod('removeNode', function ($n, n) {
    var newList = model1.getList().filter(function (el) {
            return el !== n
        }),
        $num = view1.getNode('num');
    model1.setList(newList);
    $n.parentNode.removeChild($n);
    $num.innerHTML = newList.length;
});

presenter1.init = function () {
    var self = this,
        view = self.view;
    view.setAddHandler(view.addNode)
};

presenter1.render(document.getElementById('trg'));

console.log(presenter1)
