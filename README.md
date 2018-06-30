
# Eduxora

# Introduction

Eduxo is a state management library based on redux and typescript.

<!-- This library provides 2 value propositions: -->
<!-- * Dispatch functions in redux do not support types.
* Writing new redux logic is time consuming due to the amount of files that one needs to manage. -->
<!-- 
Problem one is solved by using typescript and adding a layer of functions called 'dispatchers'
Problem two is solved by prividing an API inspired by dvajs.

All actions are still done through redux dispatch. You can still write your own middleware. -->
```
Model --> Connector  <-- Component
             |
             |
             V
    Connected Component          
```
The Model has its own state and actions.
The component has also its own state and actions.
The Connector is responsible for matching the state and actions of the Model and the Component.

There is not a 1 to 1 relationship between the Model and the Component, you can easily do more to more connections:

```
ModelA -->   |-----------|
ModelB -->   | Connector |  <-- Component
ModelC -->   |-----------|
                   |
                   |
                   V
          Connected Component
```

A Model can be used in multiple Components and, and multiple Models can belond go a Component.

# Example Usage
In order to create a Connected Component, you need to
1. Create an Eduxo instance.
2. Create a model and add it to the Eduxo instance.
3. Create a Component
4. Connect the Component with the Eduxo instance.

#### 1. Create an Eduxo instance
app.ts
```
import Eduxo from '../../src/eduxo';

export interface IDispatchers {}

const app = new Eduxo<IDispatchers>();
```

#### 2. Create the model
modelA.ts
```
import { IModel } from '../../src/eduxo';

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
```

add the model to the Edux instance

app.js
```
import Eduxo from '../../src/eduxo';
import model, * as modelTypes from './model';

export interface IDispatchers {
  home: modelTypes.IDispatchers,
}

const app = new Eduxo<IDispatchers>();

app.require(model)
app.init();

export default app;
```

#### 3. Create the Component
component.tsx
```
import * as React from 'react';

export interface IPropStates {
    isLoading: boolean
}

export interface IProps {
    doSomething: (a:number,b:string) => void,
}

export interface IProps2 extends IPropStates, IProps {};

class MyComp extends React.Component<IProps2> {
    public componentDidMount() {
        const a = this.props.count;
    }

    public render() {
        return (
            <button className="button" id="button" onClick={()=>{this.props.doSomething(1,'sdf')}}/>
        )
    }
}

export default MyComp;
```

#### 4. Connect the model and the component
connector.ts
```
import { eduxoConnect } from '../../src/eduxo'
import Comp, { IProps, IProps2, IPropStates,  } from './component';
import app from "./store";
  
const ConntectedComp = eduxoConnect<IPropStates, IProps>((state: any)=>{
    return {
        count: state.home.count,
    }
}, {
    doSomething: app.dispatchers.home.showLoading
})(Comp);

export default ConntectedComp;

```

Now you can just use the connected component as a component.

# Run tests
`npm run test`
