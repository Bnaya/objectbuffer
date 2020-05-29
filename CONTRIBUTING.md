# objectbuffer Contributor Guide

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/Bnaya/objectbuffer)

## Code of Conduct
[link](./CODE_OF_CONDUCT.md)

## Recommendations regarding development environment
Make sure you have the following tools/IDE extensions setup properly

* yarn
* editorconfig
* eslint
* prettier is enforced eslint plugin

Run `yarn;` and then `yarn test` 
And see that tests are passing. if they are not, something is wrong, and please open an issue with repro information

Sorry windows users, while everything should work, I don't regularly run on windows.

## Do open draft prs and tag me for early collaboration!

## Code guidelines

Aside of the prettier & lint rules, there are no hard rules for var & files names.  
Try to keep the same code sprit you find around you, but also make things better! 

Avoid intermediate objects and arrays.
There are many things that you might find very verbose or obscure. that because of the nature of the project and the problems domain

## Generated structs code

Elementary building block of the library is
The code in `src/internal/generatedStructs.ts`,
that is generated from the structs declarations in
`src/structsGenerator/declarations.ts`.
To understand how to add new struct, follow the `yarn generate-structs` command. `run yarn lint --fix` to re-apply prettier on the generated code

## Tests

The codebase is mostly tested, but there are flows that need more of them!
If you are not sure how to test your code, open draft pr, tag me and we will figure it together

## Nothing specific
There's a huge place for optimizations, code hygiene, and features!  
Feel free to open issues and maybe implementing missing parts.  
The code is Written in TypeScript 🦾, but the semantics are more like `C` 🥵   
Have a look on the [issues](https://github.com/Bnaya/objectbuffer/issues) and see if you find something interesting
