var mFact = JMVP.Model(),
    vFact = JMVP.View(),
    pFact = JMVP.Presenter(),
    model1 = mFact({list: []}),
    view1 = vFact(`<div>
        <button nid="add-button">Create a random number</button>
        <span nid="num"></span>
        <table nid="table"></table>
    </div>`),
    presenter1 = pFact(model1, view1);

view1.setModel(model1);

view1.defineMethod('setAddHandler', function (f) {
    view1.setHandler(view1.getNode('add-button'), 'click', f)
});
view1.defineMethod('removeNode', function ($n, n) {
    var newList = model1.getList().filter(function (el) {
            return el !== n
        }),
        $num = view1.getNode('num');
    model1.setList(newList)

    // view1.renderList()
    // or better
    $n.parentNode.removeChild($n)
    $num.innerHTML = newList.length
});
view1.defineMethod('renderList', function () {
    var $table = view1.getNode('table'),
        $num = view1.getNode('num'),
        list = model1.getList();
    $table.innerHTML = '';
    list.forEach(function (n) {
        var model = mFact({number: n}),
            view = vFact(`<tr nid="line">
                <td>$[number]</td>
                <td><button nid="remove">-</button></td>
            </tr>`),
            presenter = pFact(model, view);
        view.setModel(model);
        view.setHandler(view.getNode('remove'), 'click', function () {
            view1.removeNode(view.node, n)
        })   
        presenter.render($table)
    })
    $num.innerHTML = list.length;
});


presenter1.init = function () {
    var self = this,
        view = self.view,
        model = self.model;

    view.setAddHandler(function () {
        var list = model.getList();
        list.push(Math.random().toFixed(3))
        model.setList(list);
        view.renderList()
    })

};

presenter1.render(document.getElementById('trg'));

console.log(presenter1)
