import { expect } from "chai";
import { describe, it } from "mocha";
import app from "./helpers/store";

describe("eduxo", () => {
  it("should call correct action type", async () => {
    const { home } = app.getDispatcher();
    expect(app.getState().home.isLoading).to.equal(false);
    home.showLoadingLogic();
    expect(app.getState().home.isLoading).to.equal(true);
  })
  it("should pass correct payload", () => {
    const { home } = app.getDispatcher();
    expect(app.getState().home.count).to.equal(0);
    home.incrementByLogic(5);
    expect(app.getState().home.count).to.equal(5);
  })
});
