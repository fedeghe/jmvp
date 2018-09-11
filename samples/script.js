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
            title: 'Some examples',
            examples: [{
                label: 'first more example',
                link: 'sample3/'
            }, {
                label: 'second more example',
                link: 'sample4/'
            }]
        }),
        listView2 = viewListF(`<div>
            <h2>$[title] xxx</h2>
            <ul></ul>
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
        a.innerHTML = el.label;
        item.appendChild(a);
        this.getNode([1]).appendChild(item);
    });

    listView.defineMethod('setTitle', function (title) {
        this.getNode([0]).innerHTML = title;
    });


    var App = listPresenter.getSetupsManager({
        init: {
            view: listView,
            model: listModel,
            defs: function () {
                this.defineMethod('loadList', function () {
                    this.view.resetList();
                    var examples = this.model.getExamples();
                    for (var i = 0, l = examples.length; i < l; i++) {
                        this.view.addLink(examples[i]);
                    }
                });
            },
            init: function () {
                this.init = function () {
                    console.log('INIT')
                    console.log('---')
                    var self = this;
                    
                    this.loadList();

                    this.setHandler([1], 'mouseout', function (e) {
                        self.model.setTitle(self.model.getDefaultTitle());
                        self.view.setTitle(self.model.getTitle());
                    });
                    this.setHandler([2], 'click', function (e) {
                        App('second');
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
            view: listView2,
            model: listModel2,
            init: function () {
                this.init = function () {
                    console.log('INIT2')
                    console.log('---')
                    this.loadList();
                    this.setHandler([2], 'click', function (e) {
                        App('init');
                    });
                }
            }
        }
    })

    App('init', document.getElementById('trg'));
    
})();