
// a target node for the samples below
var trg = document.getElementById('trg');
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
    p1 = p(m1, v1);

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

        var p2 = p(m2, v2);
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

p1.render(trg);


(function () {


    /**
     * MODELS
     */
    var mFact1 = JMVP.Model();

    var mFact2 = JMVP.Model({ name: '', surname: '' });

    var model1 = mFact1({
            name: 'Federico',
            surname: 'Ghedina',
            email: 'federico.ghedina@gmail.c' // not a typo :D
        }),
        model2 = mFact1({
            name: 'Donald',
            surname: 'Knuth',
            email: 'donald.knuth@gmail.com',
            list: []
        }),
        model3 = mFact2({
            name: 'master',
            surname: 'theorem',
            email: 'master.theorem@gmail.com'
        });


    model1.setEmail('federico.ghedina@gmail.com'); // fixed 

    model1.defineMethod('summarize', function () {
        // here the context is the model
        return `${this.getName()[0]}.${this.getSurname()[0]}. <${this.getEmail()}>`;
    });

    
    
    console.log(model1.summarize()); // -> F.G. <federico.ghedina@gmail.com>
    console.log(model2.summarize()); // -> D.K. <donald.knuth@gmail.com>
    try{
        model3.summarize(); // NEIN!
    } catch(e) {
        console.log('AS expected a TypeError is thrown:');
        console.log(e);
    }


    var mFact1 = JMVP.Model(),
        model = mFact1({
            name: 'Donald',
            surname: 'Knuth',
            email: 'donald.knuth@gmail.com',
            list: []
        });





    // ----
    // View
    //
    var vFact1 = JMVP.View(),
        view = vFact1(`
        <div>
            <p>An empty list there</p>
            <ul></ul>
            <p>
                <span>{name} {surname} please ...</span>
                <a href="#"> add random number now</a>
            </p>
        </div>
    `);

    // bind'em
    view.setModel(model);

    // define addRandom 
    view.defineMethod('addRandom', function (number) {
        var newNode = document.createElement('li');
        newNode.appendChild(document.createTextNode(number));
        this.getNode([1]).appendChild(newNode); // ? wtf ? ... wait
    });
    // and also a method to update list title
    view.defineMethod('modifyTitle', function (number) {
        this.getNode([0]).innerHTML = `The list has ${number} element${number > 1 ? 's' : ''}`; 
    });

    // Presenter
    //
    var pFact1 = JMVP.Presenter(),
        presenter = pFact1(model, view);
    presenter.defineMethod('add', function () {
        var elements = this.model.getList(),
            newValue = Math.random().toFixed(2);
        elements.push(newValue);
        this.model.setList(elements);
        this.view.addRandom(newValue);
        this.view.modifyTitle(elements.length);
    })
    presenter.init = function () {
        this.view.setHandler([2, 1], 'click', this.add);
    };

    // finallly render
    //
    presenter.render(trg);

})();