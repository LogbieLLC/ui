// Test setup and teardown helpers
// This file runs before all tests

import { before, after } from "mocha";

before(() => {
  // Global test setup
  console.log("Setting up test environment...");
});

after(() => {
  // Global test teardown
  console.log("Cleaning up test environment...");
});
