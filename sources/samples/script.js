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
            <h2>{title}</h2>
            <ul></ul>
        </div>`),
        listPresenter = presenterListF(listModel, listView);
    
    listView.setModel(listModel);

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


    listPresenter.defineMethod('loadList', function () {
        var examples = this.model.getExamples();
        for (var i = 0, l = examples.length; i < l; i++) {
            this.view.addLink(examples[i]);
        }
    })


    listPresenter.init = function () {
        var self = this;
        this.loadList();

        this.setHandler([1], 'mouseout', function (e) {
            self.model.setTitle(self.model.getDefaultTitle());
            self.view.setTitle(self.model.getTitle());
        })
        
        this.setHandler([1], 'mouseover', function (e) {
            var trg = e.target,
                name = trg.nodeName;
            switch(name) {
                case 'A':
                    self.model.setTitle('Open `<i>' + trg.innerHTML + '</i>`');
                    self.view.setTitle(self.model.getTitle());
                    break;
                default: break;
            }
        });
    };
    
    listPresenter.render(document.getElementById('trg'));
})();