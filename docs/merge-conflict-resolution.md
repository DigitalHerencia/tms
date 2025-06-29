<!-- @format -->

# Merge Conflict Resolution Guide

Follow these steps whenever your pull request cannot be merged automatically.

1. **Fetch the latest changes**

   ```bash
   git fetch origin
   ```

2. **Checkout your feature branch**

   ```bash
   git checkout <your-branch>
   ```

3. **Rebase onto `main`** (preferred) or merge

   ```bash
   git rebase origin/main
   # or
   git merge origin/main
   ```

4. **Resolve each conflict**

   - Open the files marked as conflicted.
   - Look for the `<<<<<<<`, `=======`, and `>>>>>>>` markers.
   - Keep the desired changes and delete the markers.
   - Stage the file when it is correct:

     ```bash
     git add <file>
     ```

5. **Continue the rebase or complete the merge**

   ```bash
   git rebase --continue  # for rebase
   # or
   git commit            # for merge
   ```

6. **Run the project checks** to ensure everything still works:

   ```bash
   npm run lint && npm run type-check && npm test
   ```

7. **Push the updated branch**

   ```bash
   git push --force-with-lease
   ```

8. **Update your pull request**

   GitHub will re-run CI and your PR should now merge cleanly.

If at any point you need to start over, use `git rebase --abort` or `git merge --abort`.
