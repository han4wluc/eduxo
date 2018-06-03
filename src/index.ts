
import redux from 'redux';
import model, * as modelTypes from './model';
import Eduxo from './eduxo';

class MyApp<T> extends Eduxo {

  dispatchers: modelTypes.dispatchersType;

  constructor() {
    super();
    // this.dispatchers = model.generateDispatchers(this.getStore().dispatch);
    this.dispatchers = {
      showLoading: () => {},
    };

  }

  // init () {
  //   super();
  // }
  init2 () {
    this.dispatchers = model.generateDispatchers(this.getStore().dispatch);
  }

}

const app = new MyApp();

app.require(model)
app.init();
app.init2();

console.log(app.getState());
app.dispatchers.showLoading();
console.log(app.getState());





