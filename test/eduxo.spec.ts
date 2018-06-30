import { expect } from "chai";
import { describe, it } from "mocha";
import app from "./helpers/store";

describe("eduxo", () => {
  it("should set isLoading to true", () => {
    const { home } = app.getDispatcher();
    expect(app.getState().home.isLoading).to.equal(false);
    home.showLoading();
    expect(app.getState().home.isLoading).to.equal(true);
  })
});
