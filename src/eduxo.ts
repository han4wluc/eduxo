
import { createStore, combineReducers, Store, Middleware, Dispatch, AnyAction } from 'redux';

export type action = { type: string, payload?: object | string };

export type reducerType<T> = (state: T, action: action) => T;
export type reducersType<T> = { [s: string]: reducerType<T>; };

export type modelType<T, D> = {
  namespace: string,
  initialState: T,
  reducers: reducersType<T>,
  generateDispatchers: (dispatch: (action: action)=>void) => D
}

export default class Eduxora {

  store: Store;
  models: modelType<any,any>[];

  constructor (){
    this.store = {
      dispatch: (action) => { 
        console.warn('aaa')
        return action
      },
      getState: () => {},
      subscribe: () => { return () => {} },
      replaceReducer: () => {}
    };
    this.models = [];
  }

  init = (middleware?: any) => {

    const reducerObject: reducersType<any> = {};

    this.models.forEach((model)=>{
      const reducerFunction : reducerType<any> = (state, action) => {
        // console.warn('ccc')
        // console.warn(Object.keys(model.reducers), action.type);
        if(Object.keys(model.reducers).includes(action.type)){
          return model.reducers[action.type](state, action);
        }
        return model.initialState;
      }
      reducerObject[model.namespace] = reducerFunction;
    })

    this.store = createStore(combineReducers(reducerObject), middleware);
  }

  getStore = () => {
    return this.store;
  }

  getState = () => {
    return this.store.getState();
  }

  require = (model: modelType<any,any>) => {
    this.models.push(model)
  }
}

