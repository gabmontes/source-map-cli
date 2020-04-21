"use strict";

const loader = require("path-loader");
const sourceMap = require("source-map");
const lineSlicer = require("./lineSlicer");

function loadUri(path) {
  return loader.load(path).then(JSON.parse);
}

function getOriginalPositionFor(smc, line, column) {
  const mapPos = { line, column };
  const pos = smc.originalPositionFor(mapPos);
  if (!pos.source) {
    throw new Error("Mapping not found");
  }
  return pos;
}

function getSourceContentFor(smc, pos, options) {
  const src = smc.sourceContentFor(pos.source);
  return lineSlicer(src, pos.line, pos.column, options);
}

function resolve(path, line, column, options) {
  line = parseInt(line, 10);
  column = parseInt(column, 10);
  return loadUri(path)
    .then(function (map) {
      return new sourceMap.SourceMapConsumer(map);
    })
    .then(function (smc) {
      const pos = getOriginalPositionFor(smc, line, column);
      const name = pos.name;
      const context = getSourceContentFor(smc, pos, options);
      return { pos, name, context };
    });
}

module.exports = {
  resolve,
};
