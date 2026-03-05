# Merge Conflicts & Conflict Resolution

## What caused the conflict?
The conflict happened because the same line in duplicate-repo/README.md was edited differently on two branches (main and feature/merge-conflict-test). When merging, Git could not automatically decide which version to keep.

## How did you resolve it?
I opened the conflicted file, reviewed the “current (main)” and “incoming (feature)” sections, removed the conflict markers, and wrote the final intended content. Then I staged the resolved file and committed the merge resolution.

## What did you learn?
- Merge conflicts occur when two branches modify the same lines.
- Git cannot auto-merge overlapping edits and requires manual resolution.
- After resolving, you must stage the file and commit to complete the merge.
