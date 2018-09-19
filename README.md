# JMVP : javascript model view presenter  

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
the only method available (excluding shipped setters & getters) is `defineMethod` that allow to add a method to **all** models created calling `mFact1` :
``` js
model1.defineMethod('summarize', function () {
    // here use model1 for the context
    return `${model1.getName()[0]}.${model1.getSurame()[0]}. <${model1.getEmail()}>`;
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
            <p>$[name] please ...</p>
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
    this.getNode(0).appendChild(newNode); // ? wtf ? ... wait
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
    <ul>                            <!-- getNode(0) -->
        <li>3.141592653589793</li>  <!-- getNode(0, 0) -->
    </ul>                           
    <p>An empty list there</p>      <!-- getNode(1) -->
    <p>Donald please ...</p>        <!-- getNode(2) -->
    <button>add one</button>        <!-- getNode(3) -->
</div>
```
before looking at how to set the handling function let's get back to the `getNode` _view_ function, it returns the view root if no parameters are passed, but if integers are passed then it digs the view tree, e.g. the first `<li>` tag can be reached passing `0,0`, the second passing `0,1` , ... and so on.

Now we need to set the actual handling function, using another method available in the _view_, the first argument is exactly the same as for `getNode` but passed as array:
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

All good, but there is one important thing to remember, the _presenter_ is responsible to pass a handler to the view which will offer for example the `onButtonClickSetHandler` on his interface; when the user clicks the button the view will call the handler and  the _presenter will update the _model_ adding an item to the numbers array and then will tell the view to update the list through a method that have to be defined in the view... to do that, remembering that the _presenter_ has two references to the _view_ and the _model_, it allows to define an `init` method that will be called right after rendering.  
Then we could do better as follows:  

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
        <p>A list of numbers</p>
        <ul></ul>
        <p>{name} $[surname] please ...</p>
        <button>add random</button>
    </div>
`);

// bind'em
view.setModel(model);

// define add Random 
view.defineMethod('onButtonClickSetHandler', function (handler) {
    this.setHandler([3], 'click', handler);
})
view.defineMethod('addRandom', function (number) {
    var newNode = document.createElement('li');
    newNode.appendChild(document.createTextNode(number));
    this.getNode([0]).appendChild(newNode);
});

// Presenter
//
var pFact1 = JMVP.Presenter(),
    presenter = pFact1(model, view);

presenter.defineMethod('add', function () {
    var elements = this.model.getList(),
        newValue = Math.random().toFixed(3);
    elements.push(newValue);
    //update model
    this.model.setList(elements);
    //and view
    this.view.addRandom(newValue);
})

presenter.init = function () {
    this.view.onButtonClickSetHandler(this.add);
};

// finally render
//
presenter.render(trg);
```
---
## App

A single _Presenter_ can manage dynamically the _view_ and the _model_ , so a presenter instance offers a `getSetupsManager` method that allows to setup completely one or more MVP setting, reusing the Presenter, but still allowing to rerun the _init_ function:

``` js
var modelF = JMVP.Model(),
    viewF = JMVP.View(),
    presenterF = JMVP.Presenter();

var model1 = modelF({
    title: 'The Cat',
    description: 'The cat jumps in the lake'
}),
    model2 = modelF({ author: 'Federico Ghedina' }),
    view1 = viewF(`<div>
            <h1>$[title]</h1>
            <p>$[description]</p>
            <a href="#">scramble</a>
        </div>`, model1), /// oh, sure u can also pass it there as second param
    view2 = viewF(`<div><span>$[author]</span>&nbsp;<button>back</button></div>`, model2),
    presenter = presenterF();



var App = presenter.getSetupsManager({
    initialize: function () {
        console.log('Called anyway (context the presenter)')
    },
    firstSection: {
        view: view1,
        // model: model1,
        // first define some methods if needed in the presenter
        defs: function (params) {
            presenter.defineMethod('scramble', function () {
                presenter.model.scramble();
                presenter.view.setDescription(presenter.model.getDescription())
            });
            presenter.view.defineMethod('setClickHandler', function (cb) {
                presenter.view.setHandler([2], 'click', cb);
            });
            presenter.view.defineMethod('replaceDescription', function (txt) {
                presenter.view.getNode([1]).innerHTML = txt;
            })
            presenter.model.defineMethod('scramble', function () {
                var desc = presenter.model.getDescription();
                presenter.model.setDescription(desc.split('').sort(function () { return Math.random() > 0.5 ? 1 : -1 }).join(''));
            });
        },

        init: function (params) {
            presenter.view.setClickHandler(function () {
                presenter.model.scramble();
                presenter.view.replaceDescription(
                    presenter.model.getDescription()
                );
            });
        }
    },
    secondSection: {
        view: view2,
        defs: function () {

        },
        init: function () {

        },
    }
});
App.firstSection({ trg: trg, other: 'params', that: 'You', may: 'need' });
```

Here we can define as many section as needed and the cool thing is that the presenter can also call `App.secondSection` from one of the others section handlers.  
To see exactly in action it makes sense to do a final almost real-life example.  
The App consists in a widget that can be loaded into a container which at the very beginning shows:
- a container with in the middle two buttons, one to login, one to skip
- if the user press login then:
    - a form opens to allow the user to login in a github account
    - if the login does not succeed a warning message appears and the form resets
    - if the login succeed, then is shown:
        - a dropdown, with no initial selection, where the user can filter per language
        - a list of the 30 most ranked repos
        - a filter to allow the user to see only those repos he starred
        - a button to logout/login if he is logged in/out
        - in case the login is shown and pressed, the login modal must be shown
        - each item shoud show:
            - the name of the repos (with a link to gh)
            - a small (in case truncated) description of the repo
            - the number of stars
            - a button to star/unstar the repo
        - the list is dynamic thanks to a 5sec polling
        - during the whole `mayupdate` request flow the UI is disabled, and a small spinner is shown somewhere


- the non github authenticated version, simply let only the user to star repos locally, using the localstorage, there will be anyway a button to login