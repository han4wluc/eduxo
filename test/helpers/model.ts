import { IModel, reducerType  } from '../../src/eduxo';

export interface IDispatchers {
  showLoading: () => void;
}

export interface IState {
  isLoading: boolean;
}

export enum actionTypes {
  showLoading = 'showLoading',
  hideLoading = 'hideLoading',
}

const initialState = {
  isLoading: false,
};

const model: IModel<IState, IDispatchers> = {
  namespace: 'home',
  initialState,
  reducers: {
    [actionTypes.showLoading]: (state = initialState, action) => {
      return {
        isLoading: true,
      };
    },
    [actionTypes.hideLoading]: (state = initialState, action) => {
      return {
        isLoading: false,
      };
    },
  },
  generateDispatchers: dispatch => {
    return {
      showLoading: () => {
        dispatch({
          type: actionTypes.showLoading,
        });
      },
    };
  },
};

export default model;
