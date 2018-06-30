
import { connect } from 'react-redux';
import { applyMiddleware, combineReducers, createStore, Store, } from 'redux';

// tslint:disable-next-line:no-var-requires
const reduxLogic = require('redux-logic') 
const { createLogicMiddleware, createLogic } = reduxLogic;

import getParamNames from './helpers/getParamNames';

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
  dispatchers: D;
  logics?: any[];
}

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
  private logics: any[];

  constructor() {
    this.models = [];
    this.dispatchers = {}
    this.logics = [];
  }

  public getDispatcher () {
    return this.dispatchers as D;
  }

  public applyLogicMiddleware(logics:any, deps:any) {
    let modelLogics: any[] = [];
    this.models.forEach(model => {
      if(model.logics && Array.isArray(model.logics)){
        modelLogics = modelLogics.concat(model.logics)
      }
    });
    this.logics = modelLogics.concat(logics);
  }

  public init = (reducers?: any, deps?: object, middlewares?: any[]) => {
    const reducerObject: IReducers<any> = {};

    // apply reducers
    this.models.forEach(model => {
      const reducerFunction: reducerType<any> = (state = model.initialState, action) => {
        if (Object.keys(model.reducers).includes(action.type)) {
          return model.reducers[action.type](state, action);
        }
        return state;
      };
      reducerObject[model.namespace] = reducerFunction;
    });

    // apply action logics
    const possibleLogics : any[] = [];
    this.models.forEach(model => {
      const dispatchers = model.dispatchers;
      Object.keys(dispatchers).forEach((key) => {
        const possibleLogic : any = dispatchers[key]();
        if(possibleLogic){
          possibleLogics.push(possibleLogic);
        }
      });
    })

    // apply middleware
    const logicMiddleware = createLogicMiddleware(this.logics.concat(possibleLogics), deps);
    const middleware = applyMiddleware(
      logicMiddleware
    );

    // apply dispatchers
    // tslint:disable-next-line:prefer-object-spread
    this.store = createStore(combineReducers(Object.assign({}, reducerObject, reducers)), middleware)
    this.models.forEach(model => {

      const dispatchers = model.dispatchers;
      const newDispatchers : any = {};
      Object.keys(dispatchers).forEach((key) => {

        newDispatchers[key] = () => {/**/};

        const paramsNames = getParamNames(dispatchers[key])
        newDispatchers[key] = (...rest: any[]) => {
          let payload:any = {};
          paramsNames.forEach((name: string, i: number)=>{
            payload[name] = rest[i];
          })
          this.store.dispatch({
            type: key,
            payload
          })
        }
      })
      this.dispatchers[model.namespace] = newDispatchers;
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

// waiting for typescript to implement feature on generic type spread
const eduxoConnect = <T,D>(stateMappers: (state: any) => T, dispatchers: D) => {
  return connect(stateMappers, null, (stateProps: T, dispatchProps : any, ownProps: D) => {
    // tslint:disable-next-line:prefer-object-spread
    return Object.assign({}, stateProps, dispatchers, ownProps)
    // return {
    //   ...stateProps,
    //   ...dispatchers,
    //   ...ownProps,
    // };
  });
};

export { eduxoConnect, createLogic };
