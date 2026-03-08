# Merge Conflicts & Conflict Resolution

## What caused the conflict?
The conflict occurred because the same line in duplicate-repo/README.md was edited differently on two branches (main and task/merge-conflict). During merge, Git could not automatically determine which change to keep.

## How did you resolve it?
I opened the conflicted file, reviewed the “current” (main) and “incoming” (task branch) changes, removed the conflict markers, and wrote the final intended content. Then I staged the resolved file and committed the merge resolution.

## What did you learn?
- Merge conflicts happen when two branches modify the same lines/sections.
- Git requires manual resolution when it cannot safely auto-merge.
- After resolving, you must stage the file and commit to complete the merge.

## Pull Requests (PRs)

### Why are PRs important in a team workflow?
Pull requests are important because they give team members a structured way to review, discuss, and improve changes before merging them into the main branch. They help maintain code quality, reduce mistakes, and make collaboration more transparent.

### What makes a well-structured PR?
A well-structured PR should have a clear title, a short explanation of what changed and why, and only include focused changes that are easy to review. It is also helpful to link the PR to a related issue and provide enough context for reviewers.

### What did you learn from reviewing an open-source PR?
From reviewing an open-source PR, I learned that good code review is not only about checking whether code works, but also about readability, maintainability, and clear communication. I also noticed that reviewers often give specific, constructive feedback and contributors respond by updating the code or explaining their decisions.


## Writing Meaningful Commit Messages

### What makes a good commit message?
A good commit message should clearly describe what change was made and why it was made. It should be concise, informative, and easy for other developers to understand when reviewing the project history.

### How does a clear commit message help in team collaboration?
Clear commit messages help team members understand what changes were introduced in each commit without needing to read all the code. This makes it easier to review pull requests, track changes, and debug issues.

### How can poor commit messages cause issues later?
Poor commit messages such as "fix" or "update" do not explain what was changed. This can make it difficult for developers to understand the history of the project, identify when bugs were introduced, or track the purpose of specific changes.

## Debugging with git bisect

### What does git bisect do?
git bisect helps identify which commit introduced a bug by using a binary search through the commit history. Instead of checking every commit manually, it narrows the search range step by step until it finds the first bad commit.

### When would you use it in a real-world debugging situation?
I would use git bisect when a project worked correctly before, but now has a bug and I do not know which commit caused it. It is especially useful when there are many commits and manually checking each one would take too much time.

### How does it compare to manually reviewing commits?
git bisect is much faster and more efficient than manually reviewing commits one by one because it reduces the number of commits that need to be tested. Manual review can still be useful for understanding the code, but git bisect is better for quickly locating the exact commit that introduced the problem.


## Advanced Git Commands

### What does each command do?
- `git checkout main -- <file>` restores a specific file from the `main` branch without changing other files.
- `git cherry-pick <commit>` applies one specific commit from another branch onto the current branch.
- `git log` shows the history of commits and how the project changed over time.
- `git blame <file>` shows which commit last modified each line of a file.

### When would you use it in a real project?
- I would use `git checkout main -- <file>` when one file has unwanted local changes and I want to restore only that file.
- I would use `git cherry-pick` when I need one useful fix from another branch but do not want to merge the entire branch.
- I would use `git log` to understand project history, investigate when changes happened, or review branch activity.
- I would use `git blame` when debugging or when I need to understand who changed a line and why.

### What surprised you while testing these commands?
What surprised me most was how targeted these commands are. Instead of merging or reverting large sets of changes, Git allows developers to restore one file, copy one commit, inspect history clearly, and trace changes line by line, which is very useful in large team projects.

<<<<<<< HEAD
## Branching & Team Collaboration

### Why is pushing directly to main problematic?
Pushing directly to main is problematic because it can introduce bugs or incomplete work into the main codebase without review. It also makes collaboration riskier because there is less opportunity to catch mistakes before changes affect everyone.

### How do branches help with reviewing code?
Branches allow developers to work on changes separately from the stable main branch. This makes it easier to open pull requests, review code, discuss improvements, and test changes before merging them.

### What happens if two people edit the same file on different branches?
If two people edit the same file on different branches, Git may produce a merge conflict when the branches are merged. The conflict must then be resolved manually by deciding which changes to keep or how to combine them.
=======
## Git Concepts: Staging vs Committing

### What is the difference between staging and committing?
Staging is the process of selecting which changes will be included in the next commit, while committing saves those staged changes permanently to the repository history.

### Why does Git separate these two steps?
Git separates staging and committing so developers can carefully choose which changes should be included in a commit. This helps keep commits clean, meaningful, and organized.

### When would you want to stage changes without committing?
You might stage changes without committing when you are preparing multiple edits but want to group them into logical commits. Staging allows you to review and organize the exact changes that will be recorded before creating the commit.
>>>>>>> 8c0d5b8 (Adding reflections for staging & committing)
