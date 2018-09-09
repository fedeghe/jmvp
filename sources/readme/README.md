## JMVP : javascript model view presenter  

Is a playground project to explore MPV architectural approach. JMVP object can be found on the global scope and offers basically three functions that returns an objectFactory.

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
    email: 'donald.knuth@gmail.com'
});
console.log(model1.summarize()) // -> F.G. <federico.ghedina@gmail.com>
console.log(model2.summarize()) // -> D.K. <donald.knuth@gmail.com>
```
If we would create an instance calling `mFact2` then the `summarize` method will not be available on the that object.  
That's all about _models_.

---

## Views  
... todo

---

## Presenters 
... todo
