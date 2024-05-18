#!/usr/bin/env node

import { Command } from "commander";
import { addLiquidity } from "./addLiquidity.js";

// Declare the program
const program = new Command();

// Add actions onto that CLI
program
.command("add-liquidity")
  .action(
    async () => {
     await addLiquidity()
    },
  )
  .description("Add MASS/USDC Liquidity");

// Execute the CLI with the given arguments
program.parse(process.argv);