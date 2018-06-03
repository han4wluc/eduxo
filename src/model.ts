
import { reducerType, reducersType, modelType } from './eduxo';

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
  namespace: 'hello',
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

// export dispatchers = dipatchers;;
export default model;