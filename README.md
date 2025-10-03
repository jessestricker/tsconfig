# tsconfig

A collection of `tsconfig.json` files.

- [node-ts](./tsconfig.node-ts.json): Run TypeScript directly in Node.js.

  Uses the compiler option `erasableSyntaxOnly` to constrain the syntax of `.ts` files.
  This makes them executable directly in Node.js without transpilation using its [type stripping feature](https://nodejs.org/api/typescript.html#type-stripping).

- [pedantic](./tsconfig.pedantic.json): Use the strictest type-checking mode.

  Enables all compiler options which increase the strictness of the type-checking done by Typescript.
  Additionally, options improving the consistency of modules/import are also enabled.
