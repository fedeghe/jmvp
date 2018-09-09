/**
 * MODEL
 */
var mod = JMVP.Model(),
    m1 = mod({
        name: 'Federico',
        surname: 'Ghedina',
        number: 0
    });

var v = JMVP.View(),
    v1 = v(`
<div>
    <div>
        <button>click here</button>
        <button>reset</button>
    </div>
    <span>{name}:</span>
    <span> {number}</span>
    <span> clicks</span>
    <hr>
    <span>{name} - {surname}</span>
    <hr>
    <span>{surname}</span>
    <ul></ul>
</div>
`);

v1.setModel(m1);
v1.defineMethod('setNumber', function (n) {
    this.getNode([2]).innerHTML = ' ' + n;
})

var p = JMVP.Presenter(),
    p1 = p(v1, m1);

p1.init = function () {
    var elements = [
            {itemName: 'aaa'},
            {itemName: 'bbb'}
        ];

    elements.forEach((el) => {
        var m2 = mod(el),
            v2 = v(`<li>{itemName}</li>`);
        
        v2.defineMethod('setItemName', function(n) {
            v2.getNode().innerHTML = n;
        });
        v2.setModel(m2);

        var p2 = p(v2, m2);
        p2.setHandler(null, 'click', function (e) {
            p2.model.setItemName(+new Date, function () {
                p2.view.setItemName(p2.model.getItemName());
            });
        })
        p1.view.getNode([8]).appendChild(p2.getNode());
    });
};

p1.setHandler([0, 0], 'click', function () {
    p1.model.setNumber(p1.model.getNumber() + 1);
    p1.view.setNumber(p1.model.getNumber());
})
p1.setHandler([0, 1], 'click', function () {
    p1.model.setNumber(0);
    p1.view.setNumber(p1.model.getNumber());
})

p1.render(document.getElementById('trg'));


(function () {

    var mFact1 = JMVP.Model();

    var mFact2 = JMVP.Model({ name: '', surname: '' });

    var model1 = mFact1({
        name: 'Federico',
        surname: 'Ghedina',
        email: 'federico.ghedina@gmail.c' // not a typo :D
    });


    model1.setEmail('federico.ghedina@gmail.com'); // fixed 

    model1.defineMethod('summarize', function () {
        // here the context is the model
        return `${this.getName()[0]}.${this.getSurname()[0]}. <${this.getEmail()}>`;
    });

    var model2 = mFact1({
        name: 'Donald',
        surname: 'Knuth',
        email: 'donald.knuth@gmail.com'
    });
    var model3 = mFact2({
        name: 'Gerry',
        surname: 'Lewis',
        email: 'gerry.lewis@gmail.com'
    });
    
    console.log(model1.summarize()); // -> F.G. <federico.ghedina@gmail.com>
    console.log(model2.summarize()); // -> D.K. <donald.knuth@gmail.com>
    try{
        model3.summarize(); // NEIN!
    } catch(e) {
        console.log(e);
    }
})();