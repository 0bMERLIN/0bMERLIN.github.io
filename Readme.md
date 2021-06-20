# Vox game engine
A (WIP) 2.5D engine written in javascript.
Inspired by https://github.com/s-macke/VoxelSpace/ (visit them to see a proper implementation of this algorithm).

# How to run:
Visit 0bmerlin.github.io for a demo (hosted by this repository).
You can use the Server.sh shell script to launch a python server for local developement (should start on localhost:8000).

# TODO/notes:
  - sprite rendering
    - inspiration from wolfenstein 3D?
  - refactor before integrating scripting language
  - simple scripting language
    - functional lisp dialect
    - might need to be compiled to js
    - dynamically typed
    - lexically scoped, no mutation
    - TEA?
    - pattern matching, oo-style polymorphism or even both?
    - integration with engine / DSL for 2.5D scripting
    - written in haskell/elm/purescript/rescript ?
  - proper server framework (node + rescript?) + multiplayer
  - editor (godot-ish)
    - elm / react / vanilla rescript-jsx ?