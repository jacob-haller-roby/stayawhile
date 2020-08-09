import {createStore, applyMiddleware} from 'redux';
import {createLogger} from "redux-logger/src";
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';

const loggerMiddleware = createLogger();
//
// const asyncDispatchMiddleware = store => next => action => {
//     let syncActivityFinished = false;
//     let actionQueue = [];
//
//     function flushQueue() {
//         actionQueue.forEach(a => store.dispatch(a)); // flush queue
//         actionQueue = [];
//     }
//
//     function asyncDispatch(asyncAction) {
//         actionQueue = actionQueue.concat([asyncAction]);
//
//         if (syncActivityFinished) {
//             flushQueue();
//         }
//     }
//
//     const actionWithAsyncDispatch =
//         Object.assign({}, action, { asyncDispatch });
//
//     const res = next(actionWithAsyncDispatch);
//
//     syncActivityFinished = true;
//     flushQueue();
//
//     return res;
// };

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, loggerMiddleware));

export default store;