import {
  AnyAction,
  combineReducers,
  createStore,
  Dispatch,
  Middleware,
  Store,
} from 'redux';

export interface IAction { type: string; payload?: object | string }

export type reducerType<T> = (state: T, action: IAction) => T;
export interface IReducers<T> { [s: string]: reducerType<T> }

export interface IModel<T, D> {
  namespace: string;
  initialState: T;

  reducers: IReducers<T>;
  generateDispatchers: (dispatch: (action: IAction) => void) => D;
}

export default class Eduxora<D> {
  public store: Store;
  public models: Array<IModel<any, any>>;
  public dispatchers: D;

  constructor(initialDispatchers: D) {
    this.store = {
      dispatch: action => {
        return action;
      },
      getState: () => {return},
      subscribe: () => () => {return},
      replaceReducer: () => {return},
    };
    this.models = [];
    this.dispatchers = initialDispatchers;
  }

  public init = (middleware?: any) => {
    const reducerObject: IReducers<any> = {};

    this.models.forEach(model => {
      const reducerFunction: reducerType<any> = (state, action) => {
        if (Object.keys(model.reducers).includes(action.type)) {
          return model.reducers[action.type](state, action);
        }
        return model.initialState;
      };
      reducerObject[model.namespace] = reducerFunction;
    });

    this.store = createStore(combineReducers(reducerObject), middleware);
  };

  public init2 = (dispatchers: D) => {
    this.dispatchers = dispatchers;
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
