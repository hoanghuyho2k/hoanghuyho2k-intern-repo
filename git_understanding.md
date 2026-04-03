
# Debug with `git bisect`

## Debugging with `git bisect` – Practical Evidence

### Test Scenario I Created

To practice `git bisect`, I created a simple JavaScript file called `bisect_test.js` and made a series of commits in my test branch.

#### Commit history used for the test

```bash
7418e64 Add extra output to buggy test
debeef5 Introduce bug in bisect test
71eefbf Update output message in bisect test
5a07ab6 Add working bisect test file
```

What I changed in each commit
1. 5a07ab6 – Add working bisect test file
Created a working version of the file:

```javascript
function add(a, b) {
  return a + b;
}

console.log(add(2, 3));
```

2. 71eefbf – Update output message in bisect test
Changed the output text, but the logic still worked correctly:

```javascript
function add(a, b) {
  return a + b;
}

console.log("Result:", add(2, 3));
```

3. debeef5 – Introduce bug in bisect test
Introduced the bug by changing addition to subtraction:

```javascript
function add(a, b) {
  return a - b;
}

console.log("Result:", add(2, 3));
```

4. 7418e64 – Add extra output to buggy test
Added another line while the bug was still present:

```javascript
console.log("Buggy version still active");
```

## Using `git bisect`

I use `git bisect` to identify which commit introduced the bug:

Commands I run:

```bash
git bisect start
git bisect bad
git bisect good 5a07ab6
```

At this point, Git checked out one of the middle commits for testing.

I then inspected the file and marked each checked-out revision as good or bad.

Example command output

```bash
git bisect start
status: waiting for both good and bad commits

git bisect bad
status: waiting for good commit(s), bad commit known

git bisect good 5a07ab6
Bisecting: 0 revisions left to test after this (roughly 1 step)
[debeef53e5496c5b195c753e44b1fe31a9050fba] Introduce bug in bisect test
```

I checked the code:

```javascript
function add(a, b) {
  return a - b;
}

console.log("Result:", add(2, 3));
```

Since this version was buggy, I marked it as bad:

```bash
git bisect bad
```

Git then moved to previous commit:

```bash
Bisecting: 0 revisions left to test after this (roughly 0 steps)
[71eefbf9c656ab4de39000ac4c74f2c2ca991d9b] Update output message in bisect test
```

I checked the file again:

```javascript
function add(a, b) {
  return a + b;
}

console.log("Result:", add(2, 3));
```

This version was working, so I marked it as good:

```bash
git bisect good
```

## Final result from git

```bash
debeef53e5496c5b195c753e44b1fe31a9050fba is the first bad commit
commit debeef53e5496c5b195c753e44b1fe31a9050fba
Author: Huy Ho <huybm27@gmail.com>
Date:   Sun Mar 8 15:05:29 2026 +1100

    Introduce bug in bisect test
```

After finishing, I returned to my branch with:

```bash
git bisect reset
```

## Reflection

What does `git bisect` do?

`git bisect` helps identify which commit introduced a bug by using a binary search through the commit history. Instead of checking every commit manually, it narrows the search range step by step until it finds the first bad commit.

When would you use it in a real-world debugging situation?

I would use `git bisect` when a project worked correctly before, but now has a bug and I do not know which commit caused it. It is especially useful when there are many commits and manually checking each one would take too much time.

How does it compare to manually reviewing commits?

`git bisect` is much faster and more efficient than manually reviewing commits one by one because it reduces the number of commits that need to be tested. Manual review can still be useful for understanding the code, but `git bisect` is better for quickly locating the exact commit that introduced the problem.
