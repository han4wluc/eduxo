import { combineReducers, createStore, Store, applyMiddleware } from 'redux';
import { connect } from 'react-redux';

// declare module 'redux-logic'
// import { createLogicMiddleware, createLogic } from 'redux-logic';
let reduxLogic = require('redux-logic') 
const { createLogicMiddleware, createLogic } = reduxLogic;

export interface IAction {
  type: string;
  payload?: object | string;
}

export type reducerType<T> = (state: T, action: IAction) => T;
export interface IReducers<T> {
  [s: string]: reducerType<T>;
}

export interface IModel<T, D> {
  namespace: string;
  initialState: T;
  reducers: IReducers<T>;
  generateDispatchers: (dispatch: (action: IAction) => void, deps?: object) => D;
  logics?: Array<any>;
}

interface A {
  [key: string]: any;
}

// export interface ISomeObject {
//   home: any,
//   [index: number]: any;
//   [index: string]: any;
//   // [key: number]: any;
//   // [key: string]: any;
//   // [key: any]: any;
// }

// const asdf : ISomeObject = {}

export interface IClassInterface<D> {
  store: Store<any>;
  models: Array<IModel<any, any>>;
  dispatchers: D ; 
  require: (model: any) => void;
  applyLogicMiddleware: (middleware: any, deps: any) => void;
  init: (reducers: any, deps: any) => void;
  getDispatcher: () => D;
}

export default class Eduxora<D> implements IClassInterface<D> {
  public dispatchers!: any;
  public store!: Store<any>;
  public models: Array<IModel<any, any>>;
  // public dispatchers!: D;
  private hasStore: boolean;
  private logics: Array<any>;

  constructor() {
    // this.store = {};
    this.hasStore = false;
    this.models = [];
    this.dispatchers = {}
    // this.dispatchers['asdf'] = 'asdf'
    // this.dispatchers = dispatchers;
    this.logics = [];
  }

  public getDispatcher () {
    return this.dispatchers as D;
  }

  applyLogicMiddleware(logics:any, deps:any) {
    let modelLogics: any[] = [];
    this.models.forEach(model => {
      if(model.logics && Array.isArray(model.logics)){
        modelLogics = modelLogics.concat(model.logics)
      }
    });
    this.logics = modelLogics.concat(logics);
  }

  public init = (reducers?: any, deps?: object, middlewares?: Array<any>) => {
    const reducerObject: IReducers<any> = {};

    this.models.forEach(model => {
      const reducerFunction: reducerType<any> = (state = model.initialState, action) => {
        if (Object.keys(model.reducers).includes(action.type)) {
          return model.reducers[action.type](state, action);
        }
        return state;
      };
      reducerObject[model.namespace] = reducerFunction;
    });

    const logicMiddleware = createLogicMiddleware(this.logics, deps);
    const middleware = applyMiddleware(
      logicMiddleware
    );

    // this.store = createStore(combineReducers({ ...reducerObject, ...reducers }), middleware);
    this.store = createStore(combineReducers(Object.assign({}, reducerObject, reducers)), middleware)
    this.hasStore = true;
    // if(!this.dispatchers){
    //   this.dispatchers = {}
    // }
    this.models.forEach(model => {
      // this.dispatchers = {
      //   [model.namespace]: 2
      // }
      this.dispatchers[model.namespace] = model.generateDispatchers(this.store.dispatch, deps);
    });
  };

  public getStore = () => {
    return this.store;
  };

  public getState = () => {
    return this.store.getState();
  };

  public require = (model: IModel<any, any>) => {
    this.models.push(model);
  };
}

export type InterfaceA<T,D> = (
  stateMappers: T,
  dispatchers: D,
) => any;

// waiting no typescript to implement feature on generic type spread
const eduxoConnect = <T,D>(stateMappers: (state: any) => T, dispatchers: D) => {
  return connect(stateMappers, null, (stateProps: T, dispatchProps : any, ownProps: D) => {
    return Object.assign({}, stateProps, dispatchers, ownProps)
    // return {
    //   ...stateProps,
    //   ...dispatchers,
    //   ...ownProps,
    // };
  });
};

export { eduxoConnect, createLogic };
