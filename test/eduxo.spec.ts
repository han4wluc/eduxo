import { expect } from "chai";
import { describe, it } from "mocha";
import app from "./helpers/store";

describe("eduxo", () => {
  it("should set isLoading to true", async () => {
    const { home } = app.getDispatcher();
    expect(app.getState().home.isLoading).to.equal(false);
    home.showLoadingLogic();
    // await new Promise((resolve)=>setTimeout(resolve, 500));
    expect(app.getState().home.isLoading).to.equal(true);
  })
  it("should set count to 5", () => {
    const { home } = app.getDispatcher();
    expect(app.getState().home.count).to.equal(0);
    home.incrementByLogic(5);
    expect(app.getState().home.count).to.equal(5);
  })
});
