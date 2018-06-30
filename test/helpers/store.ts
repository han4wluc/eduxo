
import Eduxo from '../../src/eduxo';
import model, * as modelTypes from './model';

export interface IDispatchers {
  home: modelTypes.IDispatchers,
}

const app = new Eduxo<IDispatchers>();

app.require(model)
app.init();

export default app;
