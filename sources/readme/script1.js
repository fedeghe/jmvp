var mFact1 = JMVP.Model(),
    model = mFact1({
        name: 'Donald',
        surname: 'Knuth',
        email: 'donald.knuth@gmail.com',
        list: []
    }),

    // View
    //
    vFact1 = JMVP.View(),
    view = vFact1(`
        <div>
            <p>A list of numbers</p>
            <ul></ul>
            <p>{name} $[surname] please ...</p>
            <button>add random</button>
        </div>
    `, model),
    pFact1,
    presenter;


// define add Random
view.defineMethod('onButtonClickSetHandler', function (handler) {
    this.setHandler([3], 'click', handler);
});
view.defineMethod('addRandom', function (number) {
    var newNode = document.createElement('li');
    newNode.appendChild(document.createTextNode(number));
    this.getNode(0).appendChild(newNode);
});

// Presenter
//
pFact1 = JMVP.Presenter();
presenter = pFact1(model, view);

presenter.defineMethod('add', function () {
    var elements = presenter.model.getList(),
        newValue = Math.random().toFixed(3);
    elements.push(newValue);
    // update model
    presenter.model.setList(elements);
    // and view
    presenter.view.addRandom(newValue);
});

presenter.init = function () {
    this.view.onButtonClickSetHandler(this.add);
};

// finally render
//
presenter.render(trg);
