#!/usr/bin/env node

"use strict";

const program = require("commander");

const cli = require("../src");
const packageJson = require("../package.json");

program.version(packageJson.version);

program
  .command("resolve <path> <line> <column>")
  .description("Returns the original source's line and column")
  .option(
    "-c, --context [num]",
    "Add num lines of leading and trailing context",
    parseInt
  )
  .option("-b, --before [num]", "Add num lines of leading context", parseInt)
  .option("-a, --after [num]", "Add num lines of trailing context", parseInt)
  .option("-n, --no-marker", "Does not include a column marker (^)")
  .action(function (...args) {
    cli
      .resolve(...args)
      .then(function ({ pos, name, context }) {
        console.log(
          "Maps to %s:%s:%s %s",
          pos.source,
          pos.line,
          pos.column,
          name ? "(" + name + ")" : ""
        );
        if (context) console.log("\n%s", context);
      })
      .catch(function (err) {
        console.log("Could not resolve mapping: ", err.message);
      });
  });

program.command("*", "", { noHelp: true }).action(function (cmd) {
  console.error("Unrecognized command: %s", cmd);
  program.help();
});

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}
