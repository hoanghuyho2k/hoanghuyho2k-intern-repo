// ...existing code...
# Understanding Clean Code Principles

Clean code is important because software is rarely written once and never touched again. In real projects, code is read, debugged, extended, and reviewed by many people over time, so code quality affects both development speed and long-term maintainability.

## 1. Simplicity

Simplicity means solving a problem in the clearest and least complicated way possible. Simple code is easier to read, test, and modify, and it reduces the chance of bugs caused by unnecessary logic or over-engineering.

## 2. Readability

Readability means code should be easy for other developers to understand. Clear naming, logical structure, consistent formatting, and small focused functions all improve readability. Readable code is written for the next person who will maintain it, not just for the original author.

## 3. Maintainability

Maintainability means the code can be updated, fixed, or extended without causing unnecessary difficulty. Code becomes more maintainable when it is modular, well-organized, and avoids duplication, because future developers can understand and change it more safely.

## 4. Consistency

Consistency means following the same naming conventions, formatting style, file organization, and coding patterns across the project. Consistent code helps developers move through a codebase more easily because similar problems are solved in similar ways.

## 5. Efficiency

Efficiency means writing code that performs well enough for the problem being solved, while avoiding unnecessary complexity. It is important to think about performance, but clean code also avoids premature optimization that makes code harder to understand without a clear benefit.

# Example of Messy Code

## Messy Code
```javascript
function p(a,b,c){if(a>0){if(b==true){if(c!=null){console.log("User: "+c.name+" Score: "+a)}}}}
```

This code is difficult to read because it uses unclear variable names, multiple nested conditions, inconsistent comparison operators, and no spacing or structure. It is hard to understand what the function is trying to do, and future developers would need extra time to work out the logic.

## Cleaner version
```javascript
function printUserScore(score, isActive, user) {
  if (score <= 0) {
    return;
  }

  if (!isActive) {
    return;
  }

  if (!user) {
    return;
  }

  console.log(`User: ${user.name} Score: ${score}`);
}
```

The cleaner version is easier to understand because it uses descriptive names, clear formatting, and simpler control flow. The early returns reduce nesting, and the purpose of the function is more obvious at a glance.

## Reflection

Clean code matters in real-world development because software is maintained by teams over long periods of time. Code that is simple, readable, maintainable, consistent, and efficient is easier to review, debug, and improve. Writing clean code is not only about making the program work, but also about making it easier for people to understand and work with in the future.

# Naming Variables & Functions

## Best Practices for Naming Variables and Functions

Clear naming is an important part of clean code because names are the first thing developers read when trying to understand code.

Good naming practices include:

- Use descriptive and meaningful names.
- Avoid vague abbreviations unless they are very common and obvious.
- Use names that explain the purpose of the variable or function.
- Keep naming consistent with the project style.
- Use function names that describe an action.
- Use variable names that describe the data they store.

For example, `calculateTotalPrice()` is much clearer than `doCalc()`, and `userEmail` is much clearer than `x` or `data1`.

## Example of Unclear Naming

### Unclear Code
```javascript
function a(x, y) {
  let z = x * y;
  return z;
}

let d = a(5, 10);
console.log(d);
```

This code is difficult to understand because the function name `a` does not explain what the function does, and the variable names `x`, `y`, `z`, and `d` do not describe their purpose. A developer reading this code has to guess the meaning of each value instead of understanding it immediately.

### Refactored code
```javascript
function calculateArea(width, height) {
  const area = width * height;
  return area;
}

const rectangleArea = calculateArea(5, 10);
console.log(rectangleArea);
```

The refactored version is easier to read because the names clearly describe the purpose of the function and variables. `calculateArea` explains the function’s action, while `width`, `height`, `area`, and `rectangleArea` make the data much easier to understand.

## Reflection

### What makes a good variable or function name?

A good variable or function name is descriptive, clear, and easy for another developer to understand. It should communicate purpose without needing extra explanation.

### What issues can arise from poorly named variables?

Poorly named variables can make code confusing, increase the chance of mistakes, slow down debugging, and make maintenance harder for both the original developer and future team members.

### How did refactoring improve code readability?

Refactoring improved readability by replacing vague names with meaningful ones, making the code easier to understand at a glance and reducing the need to guess what the code is doing.

# Writing Small, Focused Functions

## Best Practices

Small, focused functions are easier to read, test, and maintain because each function has a single clear responsibility. A good function should do one thing, have a clear name, and avoid mixing unrelated logic in one place.

## Example of a Long, Complex Function
```javascript
function processOrder(order) {
  if (!order) {
    console.log("Invalid order");
    return;
  }

  if (!order.items || order.items.length === 0) {
    console.log("No items in order");
    return;
  }

  let total = 0;

  for (let i = 0; i < order.items.length; i++) {
    total += order.items[i].price * order.items[i].quantity;
  }

  if (order.discount) {
    total = total - total * order.discount;
  }

  if (total > 100) {
    console.log("Free shipping applied");
  } else {
    console.log("Shipping fee applies");
  }

  console.log("Customer:", order.customerName);
  console.log("Total:", total);
}
```

This function does too many things at once: it validates the order, calculates the total, applies a discount, decides shipping, and prints output. Because all responsibilities are combined into one function, the code is harder to read, test, and modify.

## Refactored function
```javascript
function isValidOrder(order) {
  return order && order.items && order.items.length > 0;
}

function calculateOrderTotal(items) {
  let total = 0;

  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }

  return total;
}

function applyDiscount(total, discount) {
  if (!discount) {
    return total;
  }

  return total - total * discount;
}

function getShippingMessage(total) {
  if (total > 100) {
    return "Free shipping applied";
  }

  return "Shipping fee applies";
}

function processOrder(order) {
  if (!isValidOrder(order)) {
    console.log("Invalid order");
    return;
  }

  let total = calculateOrderTotal(order.items);
  total = applyDiscount(total, order.discount);

  console.log(getShippingMessage(total));
  console.log("Customer:", order.customerName);
  console.log("Total:", total);
}
```

## Reflection

### Why is breaking down functions beneficial?

Breaking down functions is beneficial because it makes code easier to understand, test, reuse, and maintain. Smaller functions also reduce complexity and make debugging easier because each function has a clear purpose.

### How did refactoring improve the structure of the code?

Refactoring improved the structure by separating validation, calculation, discount handling, and shipping logic into individual functions. This made the code more modular, easier to read, and easier to change in the future.

# Avoiding Code Duplication

## The DRY Principle

The "Don't Repeat Yourself" (DRY) principle means that the same logic should not be repeated in multiple places in a codebase. When code is duplicated, any future update must be made in every repeated section, which increases the risk of bugs and inconsistency.

## Example of Duplicated Code
```javascript
function printAdmin(user) {
  console.log("Name:", user.name);
  console.log("Email:", user.email);
  console.log("Role: Admin");
}

function printCustomer(user) {
  console.log("Name:", user.name);
  console.log("Email:", user.email);
  console.log("Role: Customer");
}
```

This code repeats the same logic for printing the user's name and email. The only real difference is the role. If the output format needs to change later, both functions would need to be updated, which makes maintenance harder and increases the chance of mistakes.

## Refactored version
```javascript
function printUser(user, role) {
  console.log("Name:", user.name);
  console.log("Email:", user.email);
  console.log(`Role: ${role}`);
}

function printAdmin(user) {
  printUser(user, "Admin");
}

function printCustomer(user) {
  printUser(user, "Customer");
}
```

## Reflection

### What were the issues with duplicated code?

Duplicated code makes maintenance more difficult because the same change has to be made in multiple places. It also increases the chance of inconsistency if one section is updated but another is forgotten.

### How did refactoring improve maintainability?

Refactoring improved maintainability by moving the shared logic into a single reusable function. This makes the code easier to update, reduces repetition, and keeps the structure cleaner.

# Commenting & Documentation

## Best Practices

Comments and documentation should make the code easier to understand, not harder. Good comments explain the reason behind a decision, important context, assumptions, edge cases, or warnings that are not obvious from reading the code itself.

## Example of Poorly Commented Code
```javascript
// set x to 5
const x = 5;

// loop through users
for (let i = 0; i < users.length; i++) {
  // check if active
  if (users[i].active) {
    // print name
    console.log(users[i].name);
  }
}
```

These comments are not useful because they only repeat what the code already clearly shows. They add noise instead of providing helpful context.

## Improved version
```javascript
// Only display active users because inactive accounts should not appear in the admin report.
const maxLoginAttempts = 5;

for (let i = 0; i < users.length; i++) {
  if (users[i].active) {
    console.log(users[i].name);
  }
}
```

The improved comment explains why the logic exists instead of repeating what the code is doing. This gives future developers useful context that might not be obvious from the code alone.

## Reflection

### When should you add comments?

Comments should be added when code needs extra context, such as explaining why a decision was made, describing assumptions, warning about tricky behavior, or documenting important business rules.

### When should you avoid comments and instead improve the code?

Comments should be avoided when they only restate obvious code. In those cases, it is better to improve variable names, function names, or code structure so the code becomes self-explanatory.

# Handling Errors & Edge Cases

## Best Practices

Reliable code should not assume that input is always valid. Good error handling checks inputs early, uses guard clauses to exit invalid cases quickly, and returns or throws clear errors when something goes wrong.

## Example of Weak Error Handling
```javascript
function calculateAverage(numbers) {
  let total = 0;

  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
  }

  return total / numbers.length;
}
```

This function assumes that:

- `numbers` always exists
- `numbers` is always an array
- the array is never empty
- every value is a valid number

If any of these assumptions are wrong, the function may return incorrect results such as `NaN`, divide by zero, or fail at runtime.

## Refactored version with Guard Clauses
```javascript
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
```

## Reflection

### What was the issue with the original code?

The original code did not validate inputs or handle edge cases such as missing data, empty arrays, or invalid values. Because of that, it could fail silently or return incorrect results.

### How does handling errors improve reliability?

Handling errors improves reliability by making invalid inputs fail clearly and predictably instead of causing hidden bugs or confusing output. Guard clauses also make the code easier to read because invalid cases are handled early and the main logic stays simple.

# Refactoring Code for Simplicity

## Common Refactoring Techniques

Common refactoring techniques include:

- breaking large functions into smaller ones
- removing unnecessary variables or conditions
- replacing nested logic with guard clauses
- renaming unclear variables and functions
- eliminating duplicated code
- simplifying conditional statements

The goal of refactoring is to make code easier to read and maintain without changing its behavior.

## Example of Overly Complicated Code
```javascript
function getDiscount(price, isMember, hasCoupon) {
  let discount = 0;

  if (price > 0) {
    if (isMember === true) {
      if (hasCoupon === true) {
        discount = price * 0.2;
      } else {
        discount = price * 0.1;
      }
    } else {
      if (hasCoupon === true) {
        discount = price * 0.05;
      } else {
        discount = 0;
      }
    }
  } else {
    discount = 0;
  }

  return discount;
}
```

The original code is more complex than necessary because it uses multiple layers of nested `if` statements for a simple decision. This makes the logic harder to follow and increases the effort needed to understand or update the function.

## Refactored version
```javascript
function getDiscount(price, isMember, hasCoupon) {
  if (price <= 0) {
    return 0;
  }

  if (isMember && hasCoupon) {
    return price * 0.2;
  }

  if (isMember) {
    return price * 0.1;
  }

  if (hasCoupon) {
    return price * 0.05;
  }

  return 0;
}
```

## Reflection

### What made the original code complex?

The original code was complex because it used unnecessary nesting and repeated assignments, which made a simple set of rules harder to understand.

### How did refactoring improve it?

Refactoring improved the code by using guard clauses and simpler conditions, which made the function shorter, easier to read, and easier to maintain.

# Identifying & Fixing Code Smells

## Common Code Smells

Code smells are warning signs in code that suggest poor design, low readability, or maintainability problems. They do not always mean the code is broken, but they often indicate that refactoring is needed.

Common code smells include:

- Magic numbers and strings
- Long functions
- Duplicate code
- Large classes (god objects)
- Deeply nested conditionals
- Commented-out code
- Inconsistent naming

---

## Example of Code Smells
```javascript
class AppManager {
  constructor() {
    this.users = [];
    this.orders = [];
  }

  addUser(u) {
    this.users.push(u);
  }

  processOrder(order) {
    if (order.status === "NEW") {
      if (order.total > 100) {
        if (order.customerType === "VIP") {
          console.log("Apply VIP discount");
        } else {
          console.log("Apply standard discount");
        }
      } else {
        console.log("No discount");
      }
    }

    console.log("Saving order...");
    this.orders.push(order);
  }

  printAdmin(user) {
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    console.log("Role: Admin");
  }

  printCustomer(user) {
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    console.log("Role: Customer");
  }
}

// let temp = 123;
// console.log("old code here");

function calc(a, b) {
  return a * b * 0.15 + 99;
}
```

### Problems in the Original Code

1. Magic numbers and strings
   - `"NEW"`
   - `100`
   - `0.15`
   - `99`

   These values are hardcoded, so their meaning is unclear.

2. Long function

   `processOrder()` handles multiple responsibilities such as checking discounts, printing messages, and saving orders.

3. Duplicate code

   `printAdmin()` and `printCustomer()` repeat the same logic.

4. Large class (god object)

   `AppManager` handles users, orders, and printing responsibilities all in one class.

5. Deeply nested conditionals

   The discount logic inside `processOrder()` uses multiple nested `if` statements, making it difficult to read.

6. Commented-out code

   The old unused code adds clutter and should be removed.

7. Inconsistent naming

   Names like `u`, `a`, `b`, and `calc` are unclear and do not describe their purpose.

## Refactored version
```javascript
const ORDER_STATUS_NEW = "NEW";
const DISCOUNT_THRESHOLD = 100;
const TAX_RATE = 0.15;
const SHIPPING_FEE = 99;

function calculateTotalWithExtras(price, quantity) {
  return price * quantity * TAX_RATE + SHIPPING_FEE;
}

function getDiscountMessage(order) {
  if (order.status !== ORDER_STATUS_NEW) {
    return "Order is not new";
  }

  if (order.total <= DISCOUNT_THRESHOLD) {
    return "No discount";
  }

  if (order.customerType === "VIP") {
    return "Apply VIP discount";
  }

  return "Apply standard discount";
}

function printUser(user, role) {
  console.log("Name:", user.name);
  console.log("Email:", user.email);
  console.log(`Role: ${role}`);
}

class UserManager {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    this.users.push(user);
  }
}

class OrderManager {
  constructor() {
    this.orders = [];
  }

  processOrder(order) {
    console.log(getDiscountMessage(order));
    console.log("Saving order...");
    this.orders.push(order);
  }
}
```

## Reflection

### What code smells did you find in your code?

The code contained several code smells, including magic numbers and strings, a long function, duplicate code, a large class with too many responsibilities, deeply nested conditionals, commented-out code, and inconsistent naming.

### How did refactoring improve the readability and maintainability of the code?

Refactoring improved the code by replacing hardcoded values with constants, breaking responsibilities into smaller functions and classes, removing duplicate logic, simplifying conditionals, and using clearer names. This made the code easier to read, understand, and update.

### How can avoiding code smells make future debugging easier?

Avoiding code smells makes debugging easier because the code becomes more structured and predictable. When logic is clear and responsibilities are separated, it is easier to locate problems, test individual parts, and make changes without accidentally breaking other parts of the system.

# Writing Unit Tests for Clean Code

## Why unit testing is important

Unit tests help developers verify that small pieces of code behave as expected. They make code safer to change because problems can be detected quickly when new changes break existing functionality.

## Testing Framework Chosen

For this task, I used **Jest**, which is a popular JavaScript testing framework.

## Example Function
```javascript
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
```

## Example Unit Tests
```javascript
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
```

## Reflection

### How do unit tests help keep code clean?

Unit tests help keep code clean because they encourage smaller, focused, and predictable functions that are easier to test. They also make refactoring safer because developers can quickly check whether the behavior of the code is still correct.

### What issues did you find while testing?

While testing, I found that functions need clear input validation and predictable behavior to be tested properly. This showed that writing tests can reveal missing error handling and edge cases that might otherwise be overlooked.

# Code Formatting & Style Guides

## Why consistent code style matters

Consistent code style is important because it makes code easier to read, review, and maintain across a team. When formatting and style are predictable, developers can focus more on the logic of the code instead of being distracted by inconsistent spacing, naming, or structure.

## Airbnb JavaScript Style Guide

The Airbnb JavaScript Style Guide is a widely used set of JavaScript coding conventions. It emphasizes readability, consistency, clear naming, use of `const` and `let` instead of `var`, and writing code in a predictable and maintainable way.

## ESLint and Prettier

To support consistent code style, I installed:

- **ESLint** to detect style issues, possible mistakes, and patterns that do not match the configured rules.
- **Prettier** to automatically format code into a consistent style.

## What issues did the linter detect?

The linter can detect issues such as inconsistent formatting, unused variables, missing semicolons depending on configuration, and patterns that do not follow the chosen style guide. These issues are useful because they highlight parts of the code that may reduce readability or cause mistakes later.

## Did formatting the code make it easier to read?

Yes, formatting made the code easier to read because spacing, indentation, and structure became more consistent. This made functions and logic easier to scan and understand.

## Reflection

### Why is code formatting important?

Code formatting is important because it improves readability, reduces confusion, and helps teams follow a shared standard. It also makes code reviews easier because developers can focus on the quality of the logic rather than formatting differences.

### What issues did the linter detect?

The linter detected style-related issues and code patterns that did not follow the expected conventions. These kinds of issues are useful to catch early because they help maintain consistency and improve overall code quality.

### Did formatting the code make it easier to read?

Yes, formatting the code made it easier to read because the structure became more consistent and predictable. Clean formatting helps developers understand code more quickly and work with it more confidently.

# CI/CD and Pull Request Guidelines

## Purpose of CI/CD

CI/CD helps automate development tasks such as installing dependencies, running tests, linting, building, and deploying. Automated checks ensure code is validated consistently before it is merged or released, improving reliability and reducing manual errors.

## Automating Style and Spell Checks

Automating style and spell checks (via ESLint, Prettier, markdownlint, and spellcheck actions) improves project quality by enforcing consistent formatting and catching documentation issues early.

## Common CI/CD Challenges

- Strict checks can block progress for small issues; configure rules to balance quality and developer velocity.
- Tool configuration must match project needs to reduce false positives.
- CI runtime and resource limits may require splitting jobs or caching dependencies.

## How CI/CD pipelines differ by team size

- Small projects: simple pipelines (install, lint, test).
- Large teams: multi-stage pipelines (lint, unit tests, integration tests, security scans, build, deploy).

## Push & Pull Request Checklist (for this repo)

- Run tests locally: npm test or yarn test
- Run linter and formatter: npm run lint and npm run format
- Run markdownlint and spell check locally if configured
- Add or update unit tests for changed behavior
- Rebase or merge main to resolve conflicts before push
- Create a descriptive PR title and body
  - Include what changed and why
  - Link related issues
  - List manual testing steps if needed
- Ensure CI passes (lint, tests, build) before merging
- Use squash merge or clean commit history per repository convention