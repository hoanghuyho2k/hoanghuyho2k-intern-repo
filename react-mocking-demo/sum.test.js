const sum = require("./sum");

test("adds two numbers correctly", () => {
  expect(sum(2, 3)).toBe(5);
});

test("handles negative numbers", () => {
  expect(sum(-2, -3)).toBe(-5);
});

test("adds zero correctly", () => {
  expect(sum(5, 0)).toBe(5);
});