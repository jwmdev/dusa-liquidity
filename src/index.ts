#!/usr/bin/env node

import { Command } from "commander";

// Declare the program
const program = new Command();

// Add actions onto that CLI
program
.command("greet")
  .argument("<string>", "name to mention")
  .option("-c, --capitalize", "Capitalize the message")
  .action(
    (
      name: string,
      opts: {
        capitalize?: boolean;
      },
    ) => {
      if (opts.capitalize) {
				console.log(`HELLO, ${name.toUpperCase()}!`);
				} else {
        console.log(`Hello, ${name}!`);
      }
    },
  )
  .description("Greets the given name");

// Execute the CLI with the given arguments
program.parse(process.argv);