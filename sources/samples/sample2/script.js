var App = (function () {

    var viewF = JMVP.View(),
        modelF = JMVP.Model(),
        presenterF = JMVP.Presenter();
    
    var modelLogin = modelF({
            message: 'Enter Your auth info and press login button'
        }),
        viewLogin = viewF(`
            <div>
                <fieldset class="login">
                    <legend class="login-legend">Login</legend>
                    <div>
                        <label>Username:</label><input type="text"/>
                    </div>
                    <div>
                        <label>Password:</label><input type="password"/>
                    </div>
                    <button>login</button><span> or </span><button>skip</button> 
                    <hr>
                    <span>$[message]</span>
                </fieldset>
            </div>
        `, modelLogin),
        
        modelList = modelF({
            list: [],
            loggedIn: false
        }),
        viewList = viewF(`<div>Logged in</div>`, modelList),

        presenter = presenterF();


    var App =  presenter.getSetupsManager({
        initialize: function () {
            console.log('Initialize')
        },
        login: {
            view: viewLogin,
            model: modelLogin,
            defs: function () {},
            init: function () {
                if (this.model.getLoggedIn) {
                    App.list();
                }    
            }
        },
        list: {
            view: viewList,
            model: modelList,
            defs: function () {},
            init: function () {}
        }
    });

    return App;
})();