
import redux from 'redux';
import Eduxo from '../../src/eduxo';
import model, * as modelTypes from './model';

export interface IDispatchers {
  home: modelTypes.IDispatchers,
}

const initialDispatchers = {
  home: model.generateDispatchers(()=>{return})
}

const app = new Eduxo<IDispatchers>(initialDispatchers);

app.require(model)
app.init();
app.init2({
  home: model.generateDispatchers(app.getStore().dispatch)
});

export default app;
