---
title: "Console Limitations"
weight: 2004
menu:
  build:
    parent: "phat-basic"
---

## Known Limitations

- Instantiation arguments
  - Now the Phat Contract Console does not support specifying arguments during contract instantiation
  - **Workaround**: you can implement a `config(&mut self, argument0, ...)` function and set the contract state with transactions after the instantiation
