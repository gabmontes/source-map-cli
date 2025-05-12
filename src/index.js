"use strict";

const loader = require("path-loader");
const sourceMap = require("source-map");

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

function sliceLine(text, line, column, opts) {
  if (text === null) {
    return "";
  }

  const delimiter = opts.delimiter || "\n";
  const before = opts.before || opts.context || 0;
  const after = opts.after || opts.context || 0;
  const lines = text.split(delimiter);
  const begin = Math.max(0, line - before - 1);
  const end = Math.min(line + after - 1, lines.length - 1);
  const slice = lines.slice(begin, end + 1);
  if (opts.marker) {
    slice.splice(line - begin, 0, "^".padStart(column + 1));
  }
  return slice.join(delimiter);
}

function getSourceContentFor(smc, pos, options) {
  const src = smc.sourceContentFor(pos.source);
  return sliceLine(src, pos.line, pos.column, options);
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
