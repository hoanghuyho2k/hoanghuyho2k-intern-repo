# Merge Conflicts & Conflict Resolution

## What caused the conflict?
The conflict occurred because the same line in duplicate-repo/README.md was edited differently on two branches (main and task/merge-conflict). During merge, Git could not automatically determine which change to keep.

## How did you resolve it?
I opened the conflicted file, reviewed the “current” (main) and “incoming” (task branch) changes, removed the conflict markers, and wrote the final intended content. Then I staged the resolved file and committed the merge resolution.

## What did you learn?
- Merge conflicts happen when two branches modify the same lines/sections.
- Git requires manual resolution when it cannot safely auto-merge.
- After resolving, you must stage the file and commit to complete the merge.

