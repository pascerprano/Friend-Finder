import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import store from './Controllers/Store/store'
import * as serviceWorker from './serviceWorker';
import Home from './Components/Home/Home';
import { Route, Router, Switch} from 'react-router-dom'
import NotFound from './NotFound'
import {createBrowserHistory} from 'history'
export const history=createBrowserHistory()

const Routing = (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={App}/>
        <Route path="/home" component={Home}/>
        <Route component={NotFound} />
      </Switch>
    </Router>
)

ReactDOM.render(
    <Provider store={store}>
        {Routing}
    </Provider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
