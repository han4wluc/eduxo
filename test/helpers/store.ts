
import redux from 'redux';
import model, * as modelTypes from './model';
import Eduxo from '../../src/eduxo';

type dispatchersType = {
  home: modelTypes.dispatchersType,
}

const initialDispatchers = {
  home: model.generateDispatchers(()=>{})
}

const app = new Eduxo<dispatchersType>(initialDispatchers);

app.require(model)
app.init();
app.init2({
  home: model.generateDispatchers(app.getStore().dispatch)
});

export default app;
