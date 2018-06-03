
import { reducerType, reducersType, modelType } from '../../src/eduxo';

export type dispatchersType = {
  showLoading: () => void
}

export type stateType = {
  isLoading: boolean
}

export enum actionTypes {
    showLoading = 'showLoading',
    hideLoading = 'hideLoading'
}

const initialState = {
  isLoading: false
}

const model:modelType<stateType, dispatchersType> = {
  namespace: 'home',
  initialState: initialState,
  reducers: {
    [actionTypes.showLoading]: (state = initialState, action) => {
      return {
        isLoading: true
      }
    },
    [actionTypes.hideLoading]: (state = initialState, action) => {
      return {
        isLoading: false
      }
    }
  },
  generateDispatchers: (dispatch) => {
    return {
      showLoading: () => {
        dispatch({
          type: actionTypes.showLoading
        })
      }
    }
  }

}

export default model;