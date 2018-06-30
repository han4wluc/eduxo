
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

  