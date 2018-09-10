## JMVP : javascript model view presenter  

Is a playground project to explore MVP architectural approach. JMVP object can be found on the global scope and offers basically three functions that returns an objectFactory.

## Install

`> npm i`

## Build & run  
`> npm start`

let the build watch for changes on the source folder; navigate to a basic _w.i.p._ sample on http://localhost:3001

---

## Models  

To create a _Model_ we should first get the right _objectFactory_ function for it, it could be done in two way, the more general one is the following:

``` js
var mFact1 = JMVP.Model();
```
but we could also get a more specific one:
``` js
var mFact2 = JMVP.Model({ name: '', surname: '' });
```

it`s not time to play cause we do not have a _model_ instance yet, the factory will return one :
``` js
var model1 = mFact1({
    name: 'Federico',
    surname: 'Ghedina',
    email: 'federico.ghedina@gmail.c' // not a typo :D
});

// use getters and setters, automatically available
// on all objects returned by the objectFactory function.
// this is es5 !!!
//
model1.setEmail('federico.ghedina@gmail.com'); // fixed 
```
the only method available (excluding shipped setters & getters) is `defineMethod` that allow to add a method to all models created calling `mFact1` :
``` js
model1.defineMethod('summarize', function () {
    // here the context is the model
    return `${this.getName()[0]}.${this.getSurame()[0]}. <${this.getEmail()}>`;
});
```
now let's try to call it in a different model we create from mFact1
``` js
var model2 = mFact1({
    name: 'Donald',
    surname: 'Knuth',
    email: 'donald.knuth@gmail.com',
    list: []
});
console.log(model1.summarize()) // -> F.G. <federico.ghedina@gmail.com>
console.log(model2.summarize()) // -> D.K. <donald.knuth@gmail.com>
```
If we would create an instance calling `mFact2` then the `summarize` method will not be available on the that object.  
That's all about _models_.

---

## Views  
As one might expect a _view_ is used to represent some piece of UI; even now first we need to get a factory for it:

``` js
var vFact1 = JMVP.View(),
    view1 = vFact1(`
        <div>
            <ul></ul>
            <p>An empty list there</p>
            <p>{name} please ...</p>
            <button>add a ramdon number</button>
        </div>
    `);
```
what we can do with it is the assignation of a model instance, so it will render as expected:
``` js
// reuse the previous obj
view1.setModel(model2);
console.log(view1.getNode());
//  <div>
//      <ul></ul>
//      <p>An empty list there</p>
//      <p>Donald please ...</p>
//      <button>add a ramdon number</button>
//  </div>
```

one of the most important principles about the _views_ in `MVP` is the definition of the interface methods of the view that will be used by the _presenter_ which plays a role or a mediator through the _model_ and the _view_.  
For example the _presenter_ using a method of that interface should be allowed to set an `handler` function for an even occurring somewhere within the _view_.  

Let's suppose we need to enable the user to add a random number to the list (initially empty); this needs to be managed by the view itself, the view needs to provide a method in his interface to accomplish that:
``` js  
view1.defineMethod('addRandom', function (number){
    var newNode = document.createElement('li');
    newNode.appendChild(document.createTextNode(number));
    this.getNode([0]).appendChild(newNode); // ? wtf ? ... wait
});
```
Please ignore for the moment the `getNode`, we'll get back to it really soon, what should be said is that it allows to get a reference to any node defined within the view.  
Time to try it out:
``` js
view1.addRandom(Math.PI);
console.log(view1.getNode());
```
which outputs
``` html
<div>
    <ul>                            <!-- [0] -->
        <li>3.141592653589793</li>  <!-- [0, 0] -->
    </ul>                           
    <p>An empty list there</p>      <!-- [1] -->
    <p>Donald please ...</p>        <!-- [2] -->
    <button>add one</button>        <!-- [3] -->
</div>
```
before looking at how to set the handling function let's get back to the `getNode` _view_ function, it returns the view root if no parameters are passed, but if an array of integers is passed then it digs the view tree, e.g. the first `<li>` tag can be reached passing `[0,0]`, the second passing `[0,1]` , ... and so on.

Now we need to set the actual handling function, using another method available in the _view_, the first argument is exactly the same as for `getNode`:
``` js
view1.setHandler([3], 'click', function () {
    view1.addRandom(Math.random());
});
```
and that's it about the _views_. ... for the moment.

---

## Presenters 
The _presenter_ is the first citizen here, the main actor that orchestrates _views_ and _models_. Let's create one (even now after getting a factory):

``` js
var pFact1 = JMVP.Presenter(),
    presenter1 = pFact1(model2, view1);
presenter1.render(trg);
```

All good but there is one important thing to remember, the _presenter_ is responsible to pass a handler to the view which will offer for example the onButtonClick on his interface; the _presenter will update the _model_ adding an item to the numbers array and then telling tha view to updated the list through a methoid that have to be defined in the view... to do that, remember that the _presenter_ has two references to the _view_ and the _model_ and also a `init` method to be implemented that will be calle right after rendering.  
Then seen that we could separate a bit as follows:  

``` js
// Model
//
var mFact1 = JMVP.Model(),
    model = mFact1({
        name: 'Donald',
        surname: 'Knuth',
        email: 'donald.knuth@gmail.com',
        list: []
    });

// View
//
var vFact1 = JMVP.View(),
    view = vFact1(`
    <div>
        <ul></ul>
        <p>An empty list there</p>
        <p>{name} {surname} please ...</p>
        <button>add random</button>
    </div>
`);

// bind'em
view.setModel(model);

// define add Random 
view.defineMethod('addRandom', function (number) {
    var newNode = document.createElement('li');
    newNode.appendChild(document.createTextNode(number));
    this.getNode([0]).appendChild(newNode); // ? wtf ? ... wait
});

// Presenter
//
var pFact1 = JMVP.Presenter(),
    presenter = pFact1(model, view);

presenter.defineMethod('add', function () {
    var elements = this.model.getList(),
        newValue = Math.random();
    elements.push(newValue);
    this.model.setList(elements);
    this.view.addRandom(newValue);
})

presenter.init = function () {
    this.view.setHandler([3], 'click', this.add);
};

// finally render
//
presenter.render(trg);
```
