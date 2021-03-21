var mFact1 = JMVP.Model(),
    model1 = mFact1({
        name: 'Federico',
        surname: 'Ghedina',
        email: 'federico.ghedina@gmail.c', // not a typo :D
        list: []
    });
model1.setEmail('federico.ghedina@gmail.com');// use the setter to fix
model1.defineMethod('summarize', function () {
    return `${this.getName()[0]}.${this.getSurame()[0]}. <${this.getEmail()}>`;
});

var vFact1 = JMVP.View(),
    view1 = vFact1(`
        <div>
            <p>An empty list there</p>
            <ul></ul>
            <p>$[name] please ...</p>
            <button>add a ramdon number</button>
        </div>
    `);

view1.setModel(model1);
view1.defineMethod('addRandom', function (number) {
    var newNode = document.createElement('li'),
        removeButton = document.createElement('button');
    removeButton.innerText = '-';

    newNode.appendChild(document.createTextNode(number));
    newNode.appendChild(removeButton);
    this.getNode(1).appendChild(newNode); // ? wtf ? ... wait
});
view1.defineMethod('setAddRandomHandler', function (cb) {
    view1.setHandler([3], 'click', cb);
});
view1.defineMethod('changeNumber', function (l) {
    view1.getNode(0).innerHTML = `The list contains ${l} number${l > 1 ? 's' : ''}`;
})

var pFact1 = JMVP.Presenter(),
    presenter1 = pFact1(model1, view1);
presenter1.init = function () {
    var self = this;
    this.defineMethod('addNumber', function (n) {
        var list = self.model.getList();
        list.push(n);
        self.model.setList(list);
        self.view.addRandom(n);
        self.view.changeNumber(list.length);
    });
    this.view.setAddRandomHandler(function () {
        self.addNumber(Math.random().toFixed(3));
    });
};
presenter1.render(document.getElementById('trg'));