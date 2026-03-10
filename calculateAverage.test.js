const calculateAverage = require("./calculateAverage");

test("returns the average of valid numbers", () => {
  expect(calculateAverage([2, 4, 6])).toBe(4);
});

test("throws an error for an empty array", () => {
  expect(() => calculateAverage([])).toThrow("numbers array must not be empty");
});

test("throws an error for invalid input", () => {
  expect(() => calculateAverage("not an array")).toThrow("numbers must be an array");
});