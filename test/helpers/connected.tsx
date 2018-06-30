
import * as React from 'react';
// import { connect } from 'react-redux';

import { eduxoConnect } from '../../src/eduxo'
import Comp, { IProps, IProps2, IPropStates,  } from './component';
type IStateMappers = (state: any) => IPropStates;
import app from "./store";
  
const ConntectedComp = eduxoConnect<IPropStates, IProps>((state: any)=>{
    return {
        count: state.home.count,
    }
}, {
    doSomething: app.dispatchers.home.showLoading
})(Comp);

{/* <ConntectedComp/> */}

export default ConntectedComp;

  