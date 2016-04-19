'use strict';

const loader = require('path-loader');
const sourceMap = require('source-map');
const leftPad = require('left-pad');

function loadUri (path) {
  return loader.load(path).then(JSON.parse);
}

function resolve (path, line, column) {
  loadUri(path)
    .then(function (map) {
      const smc = new sourceMap.SourceMapConsumer(map);
      const mapPos = {
        line: parseInt(line, 10),
        column: parseInt(column, 10)
      };
      const pos = smc.originalPositionFor(mapPos);
      if (!pos.source) {
        throw new Error('Mapping not found');
      }
      const name = pos.name ? '(' + pos.name + ')' : '';
      console.log('Maps to %s:%s:%s %s', pos.source, pos.line, pos.column, name);
      const src = smc.sourceContentFor(pos.source).split('\n');
      const srcLine = src[pos.line - 1];
      console.log('\n%s', srcLine);
      console.log(leftPad('^', pos.column + 1));
    })
    .catch(function (err) {
      console.log('Could not resolve mapping: ', err.message);
    });
}

module.exports = {
  resolve
};
