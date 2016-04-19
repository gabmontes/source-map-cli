'use strict';

const loader = require('path-loader');
const sourceMap = require('source-map');
const lineSlicer = require('./lineSlicer');

function loadUri (path) {
  return loader.load(path).then(JSON.parse);
}

function getOriginalPositionFor (smc, line, column) {
  const mapPos = { line, column };
  const pos = smc.originalPositionFor(mapPos);
  if (!pos.source) {
    throw new Error('Mapping not found');
  }
  return pos;
}

function getSourceContentFor (smc, pos, options) {
  const src = smc.sourceContentFor(pos.source);
  return lineSlicer(src, pos.line, pos.column, options);
}

function resolve (path, line, column, options) {
  line = parseInt(line, 10);
  column = parseInt(column, 10);
  loadUri(path)
    .then(function (map) {
      const smc = new sourceMap.SourceMapConsumer(map);
      const pos = getOriginalPositionFor(smc, line, column);
      const name = pos.name ? '(' + pos.name + ')' : '';
      console.log('Maps to %s:%s:%s %s', pos.source, pos.line, pos.column, name);
      const context = getSourceContentFor(smc, pos, options);
      console.log('\n%s', context);
    })
    .catch(function (err) {
      console.log('Could not resolve mapping: ', err.message);
    });
}

module.exports = {
  resolve
};
