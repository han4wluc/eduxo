import { IModel } from '../../src/eduxo';
let reduxLogic = require('redux-logic') 
const { createLogic } = reduxLogic;

export interface IState {
  isLoading?: boolean;
  count?: number;
}

export enum actionTypes {
  showLoading = 'showLoading',
  hideLoading = 'hideLoading',
  incrementBy = 'incrementBy',
  showLoadingLogic = 'showLoadingLogic',
  incrementByLogic = 'incrementByLogic'
}

export interface IDispatchers {
  showLoadingLogic: () => void;
  incrementByLogic: (count: number) => void;
}

const initialState = {
  isLoading: false,
  count: 0,
};

const model: IModel<IState, IDispatchers> = {
  namespace: 'home',
  initialState,
  reducers: {
    [actionTypes.showLoading]: (state = initialState, action) => {
      return Object.assign({}, state, {
        isLoading: true
      })
      // return {
      //   ...state,
      //   isLoading: true,
      // };
    },
    [actionTypes.hideLoading]: (state = initialState, action) => {
      return Object.assign({}, state, {
        isLoading: false
      })
      // return {
      //   ...state,
      //   isLoading: false,
      // };
    },
    [actionTypes.incrementBy]: (state = initialState, action : any) => {
      return Object.assign({}, state, {
        count: state.count + action.payload.count
      })
      // return {
      //   ...state,
      //   count: state.count + action.payload.count,
      // };
    },
  },
  dispatchers: {
    [actionTypes.showLoadingLogic]: () => {
      return createLogic({
        type: actionTypes.showLoadingLogic,
        latest: true,
        process({ action: { payload } } : any, dispatch: any, done: any) {
          dispatch({
            type: 'showLoading'
          })
          done();
        }
      });
    },
    [actionTypes.incrementByLogic]: (count) => {
      return createLogic({
        type: actionTypes.incrementByLogic,
        latest: true,
        process({ action: { payload } } : any, dispatch: any, done: any) {
          dispatch({
            type: 'incrementBy',
            payload
          })
          done();
        }
      });
    }
  },
};

export default model;
