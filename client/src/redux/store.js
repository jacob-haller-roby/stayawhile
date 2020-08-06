import {createStore, applyMiddleware} from 'redux';
import {createLogger} from "redux-logger/src";
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';

const loggerMiddleware = createLogger();

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, loggerMiddleware));

export default store;