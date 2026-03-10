function calculateAverage(numbers) {
  if (!Array.isArray(numbers)) {
    throw new TypeError("numbers must be an array");
  }

  if (numbers.length === 0) {
    throw new Error("numbers array must not be empty");
  }

  for (const value of numbers) {
    if (typeof value !== "number" || Number.isNaN(value)) {
      throw new TypeError("all items in numbers must be valid numbers");
    }
  }

  let total = 0;

  for (const value of numbers) {
    total += value;
  }

  return total / numbers.length;
}

module.exports = calculateAverage;