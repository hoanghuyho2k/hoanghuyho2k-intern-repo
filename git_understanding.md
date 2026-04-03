
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

## Advanced Git Commands – Practical Evidence

### Commands I tested

For this task, I experimented with the following Git commands in my test repository:

- `git checkout main -- <file>`
- `git cherry-pick <commit>`
- `git log`
- `git blame <file>`

### Testing `git checkout main -- <file>`

#### What I did

I created a file called `advanced_git_test.txt` and committed it on `main`:

```bash
echo "origin line" > advanced_git_test.txt
git add advanced_git_test.txt
git commit -m "Add test file to main"
```

Then I switched to my branch and changed the file:

```bash
echo "changed line" > advanced_git_test.txt
cat advanced_git_test.txt
```

Output:

`change line`

After that, I restored the file from main using:

```bash
git checkout main -- advanced_git_test.txt
cat advanced_git_test.txt
```

Output:

`origin line`

What I learned

This command restored only that specific file from main without affecting other files or changes in the branch. It is useful when one file has unwanted changes and I want to bring back the clean version from another branch.

### Testing git cherry-pick <commit>

What I did

I created a branch called feature/cherry-pick-demo and added a file:

```bash
echo "line from cherry-pick demo" > cherry_pick_demo.txt
git add cherry_pick_demo.txt
git commit -m "Add cherry-pick demo file"
```

Then I checked the most recent commit hash:

```bash
git log --online -1
```

Output:

```bash
9d7cf81 Add cherry-pick demo file
```

Then I switched back to main and applied only that commit:

```bash
git checkout main
git cherry-pick 9d7cf81
```

Output:

```bash
[main d1e8fbe] Add cherry-pick demo file
 Date: Sun Mar 8 17:02:29 2026 +1100
 1 file changed, 1 insertion(+)
 create mode 100644 cherry_pick_demo.txt
 ```

What I learned

`git cherry-pick` let me copy one specific commit from another branch without merging the whole branch. This is useful when only one fix or feature is needed from a branch.

### Test git log

What I did:

I used:

```bash
git log --online --decorate --graph -10
```

Example output:

```bash
* d1e8fbe (HEAD -> main) Add cherry-pick demo file
* f16ca63 Add test file to main
*   95328b1 (origin/main, origin/HEAD) Merge pull request #79 from hoanghuyho2k/task/pr-practice
|\  
| * cfd2c5f Add section on Pull Requests in git_understanding.md
| * 32fda72 (origin/task/pr-practice) Update git_understanding with PR reflections
* | 62f7ece Merge pull request #78 from hoanghuyho2k/task/vscode-productivity
```

What I learned

`git log` helped me understand how the commit history evolved, which branches were merged, and which commit was currently checked out. The graph view made branch history easier to understand.

### Test git blame <file>

WHat I did

I used:

```bash
git blame git_understanding.md
```

Example output:

```bash
98ab1eba (Huy Ho       2026-03-05 15:25:37 +1100  1) # Merge Conflicts & Conflict Resolution
736fd89d (Huy Ho       2026-03-05 15:56:42 +1100  4) The conflict occurred because the same line in duplicate-repo/README.md was edited differently on two branches
cfd2c5f4 (hoanghuyho2k 2026-03-08 14:24:25 +1100 14) ## Pull Requests (PRs)
```

## Reflection for Advanced Git Commands

What does each command do?

`git checkout main -- <file>` restores a specific file from the main branch without affecting other files.

`git cherry-pick <commit>` applies one specific commit from another branch onto the current branch.

`git log` shows commit history and how the project changed over time.

`git blame <file>` shows which commit last modified each line of a file.

When would you use these in a real project?

I would use `git checkout main -- <file>` when I want to discard unwanted changes in one file and restore the known-good version from main.

I would use `git cherry-pick` when I need one useful fix from another branch without merging unrelated changes.

I would use `git log` to understand project history, review how features evolved, or investigate when a problem was introduced.

I would use git blame when debugging code or when I need to know who changed a specific line and in which commit.

What surprised me while testing these commands?

What surprised me most was how targeted these commands are. Instead of merging or reverting many changes at once, Git allows developers to restore one file, copy one commit, inspect project history clearly, and trace line-by-line changes. These commands would be very useful in large projects with multiple developers.
