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
                presenter.view.getNode(1).innerHTML = txt;
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