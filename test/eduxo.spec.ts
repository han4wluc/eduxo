import { expect } from "chai";
import { describe, it } from "mocha";
import store from "./helpers/store";

describe("eduxo", () => {
  it("should set isLoading to true", () => {
    expect(store.getState().home.isLoading).to.equal(false);
    store.dispatchers.home.showLoading();
    expect(store.getState().home.isLoading).to.equal(true);
  });
});
