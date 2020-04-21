"use strict";

require("chai").should();

const { resolve } = require("../src");

describe("Resolver", function () {
  it("should resolve the source location and context", function () {
    return resolve("test/fixtures/lineSlicer.min.js.map", 1, 228, {
      marker: false,
    }).then(function ({ pos, name, context }) {
      pos.should.deep.equal({
        source: "lib/lineSlicer.js",
        line: 11,
        column: 53,
        name: "padStart",
      });
      name.should.equal("padStart");
      context.should.match(/padStart/);
    });
  });
});
