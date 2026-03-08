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