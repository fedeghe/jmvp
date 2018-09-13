(function () {
    var modelListF = JMVP.Model(),
        viewListF = JMVP.View(),
        presenterListF = JMVP.Presenter();
    
    var listModel = modelListF({
            defaultTitle: 'Some examples',
            title: 'Some examples',
            examples: [{
                label: 'first example',
                link: 'sample1/'
            }, {
                label: 'second example',
                link: 'sample2/'
            }]
        }),
        listView = viewListF(`<div>
            <h2>$[title]</h2>
            <ul></ul>
            <button>press me</button>
        </div>`),

        listModel2 = modelListF({
            defaultTitle: 'Some more examples',
            title: 'Some more examples',
            examples: [{
                label: 'first more example',
                link: 'sample3/'
            }, {
                label: 'second more example',
                link: 'sample4/'
            }, {
                label: 'third more example',
                link: 'sample5/'
            }, {
                label: 'fourth more example',
                link: 'sample6/'
            }, {
                label: 'fifth more example',
                link: 'sample7/'
            }]
        }),
        listView2 = viewListF(`<div>
            <h2 class="red">$[title]</h2>
            <ul class="nolist"></ul>
            <span>back</span>
        </div>`),

        listPresenter = presenterListF();


    listView.defineMethod('resetList', function (el) {
        this.getNode([1]).innerHTML = '';
    });
    listView.defineMethod('addLink', function (el) {
        var item = document.createElement('li'),
            a = document.createElement('a');
        a.setAttribute('href', el.link);
        a.setAttribute('target', '_blank');
        a.innerHTML = el.label;
        item.appendChild(a);
        this.getNode([1]).appendChild(item);
    });

    listView.defineMethod('setTitle', function (title) {
        this.getNode([0]).innerHTML = title;
    });


    var App = listPresenter.getSetupsManager('init', {
        init: function () {
            
        },
        first: {
            route: '/',
            view: listView,
            model: listModel,
            defs: function (params) {
                console.log('first App defs');
                console.log(params);
                this.defineMethod('loadList', function () {
                    this.view.resetList();
                    var examples = this.model.getExamples();
                    for (var i = 0, l = examples.length; i < l; i++) {
                        this.view.addLink(examples[i]);
                    }
                });
            },
            init: function (params) {
                this.init = function () {
                    console.log('first App init');
                    console.log(params);
                    
                    var self = this;
                    
                    this.loadList();
                    
                    this.setHandler([1], 'mouseout', function () {
                        self.model.setTitle(self.model.getDefaultTitle());
                        self.view.setTitle(self.model.getTitle());
                    });

                    this.setHandler([2], 'click', function () {
                        App.second({number:1, name:'fede'});
                    });

                    this.setHandler([1], 'mouseover', function (e) {
                        var trg = e.target,
                            name = trg.nodeName;
                        switch (name) {
                            case 'A':
                                self.model.setTitle('Open `' + trg.innerHTML + '`');
                                self.view.setTitle(self.model.getTitle());
                                break;
                            default: break;
                        }
                    });

                };
            }
            
        },
        second: {
            route: '/second',
            view: listView2,
            model: listModel2,
            init: function (params) {
                this.init = function () {
                    console.log('second App init');
                    console.log(params);
                    this.loadList();
                    this.setHandler([2], 'click', function () {
                        App.first({int: 4, surname:'ghedina', address: 'kudam 74'});
                    });
                }
            }
        }
    });

    App.first({
        trg: document.getElementById('trg'),
        name: 'Federico'
    });
    
})();