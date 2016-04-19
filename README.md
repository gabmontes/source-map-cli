# Source-map CLI

Command-line interface to the [`source-map`](https://github.com/mozilla/source-map) module.

```bash
npm install --global source-map-cli
```

## Usage

The tool accepts `source-map` commands to operate with source maps.

### resolve

The `resolve` command accepts a source map (either a path or a URL), a line and column and returns the original source file name, line and column, along with a context (usually the name of the variable or function).

```bash
$ source-map resolve bundle.js.map 1 28
Maps to source.js:2:10 (baz)

   return baz(bar);
          ^
```

## Disclaimer

This module uses [`left-pad`](https://www.npmjs.com/package/left-pad). Use at your own risk.
