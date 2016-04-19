'use strict';

const leftPad = require('left-pad');

function slice (text, line, column, opts) {
  const delimiter = opts.delimiter || '\n';
  const before = opts.before || opts.context || 0;
  const after = opts.after || opts.context || 0;
  const lines = text.split(delimiter);
  const begin = Math.max(0, line - before - 1);
  const end = Math.min(line + after - 1, lines.length - 1);
  const slice = lines.slice(begin, end + 1);
  if (opts.marker) slice.splice(line - begin, 0, leftPad('^', column + 1));
  return slice.join(delimiter);
}

module.exports = slice;
