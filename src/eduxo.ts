import { combineReducers, createStore, Store, applyMiddleware } from 'redux';
import { connect } from 'react-redux';
import { posix } from 'path';

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
  logics?: any[];
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
  private logics: any[];

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

  public init = (reducers?: any, deps?: object, middlewares?: any[]) => {
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


    const possibleLogics : any[] = [];

    this.models.forEach(model => {
      const dispatchers = model.generateDispatchers(()=>{/**/}, deps);
      Object.keys(dispatchers).forEach((key) => {
        const possibleLogic : any = dispatchers[key]();
        if(possibleLogic){
          possibleLogics.push(possibleLogic);
        }
      });
    })

    const logicMiddleware = createLogicMiddleware(this.logics.concat(possibleLogics), deps);
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

      // https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically/9924463#9924463
      var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
      var ARGUMENT_NAMES = /([^\s,]+)/g;
      function getParamNames(func: any) {
        var fnStr = func.toString().replace(STRIP_COMMENTS, '');
        var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
        if(result === null)
          result = [];
        return result;
      }

      const dispatchers = model.generateDispatchers(this.store.dispatch, deps);
      const newDispatchers : any = {};
      Object.keys(dispatchers).forEach((key) => {
        // newDispatchers[key] = (...rest : any[]) => {
        //   console.warn('arguments', rest)

        newDispatchers[key] = () => {/**/};

        // let possibleLogic = dispatchers[key]();
        // if(possibleLogic) {

        // }
        // console.warn('dispatchers[key]', typeof dispatchers[key](), dispatchers[key]())

        const paramsNames = getParamNames(dispatchers[key])
        // console.warn('params', params);
        newDispatchers[key] = (...rest: any[]) => {
          let payload:any = {};
          paramsNames.forEach((name: string, i: number)=>{
            payload[name] = rest[i];
          })
          // console.warn('rest', rest)
          // console.warn('payload', payload);
          // arguments
          // console.warn('arguments', rest)
          // console.warn('func', func.toString())
          this.store.dispatch({
            type: key,
            payload
          })
        }
      })
      this.dispatchers[model.namespace] = newDispatchers;

      // this.dispatchers[model.namespace] = dispatchers;
      // this.dispatchers[model.namespace] = {
      //   'showLoading': () => {
      //     this.store.dispatch({
      //       type: 'showLoading'
      //     })
      //     // console.warn('okok')
      //   }
      // }
      // this.dispatchers[model.namespace] = model.generateDispatchers(this.store.dispatch, deps);
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
