# Coding Guidelines

* Don't make longer lines than 79 columns where possible (like in PEP-8)
* Use 4 spaces for indent in all files, except for shell scripts (use tabs
  there). Consider configuring your editor to use `.editorconfig`, then it gets
  configured automatically.
* Linter: `.ci/lint.sh` (consider setting it as pre-commit hook, requires GNU
  grep)
