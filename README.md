# tsconfig

[![NPM Version](https://img.shields.io/npm/v/%40jessestricker%2Ftsconfig?logo=npm)](https://www.npmjs.com/package/@jessestricker/tsconfig)

A collection of `tsconfig.json` files:

- **[node-22](./tsconfig.node-22.json): Node.js v22 (LTS)**
- **[node-24](./tsconfig.node-24.json): Node.js v24**
- **[node-ts](./tsconfig.node-ts.json): Run TypeScript directly in Node.js**

  Uses the compiler option `erasableSyntaxOnly` to constrain the syntax of `.ts` files.
  This makes them executable directly in Node.js without transpilation using its [type stripping feature](https://nodejs.org/api/typescript.html#type-stripping).

- **[pedantic](./tsconfig.pedantic.json): Use the strictest type-checking mode**

  Enables all compiler options which increase the strictness of the type-checking done by Typescript.
  Additionally, options improving the consistency of modules/import are also enabled.

## Installation & Usage

Run one of the following, depending on your package manager:

```shell
npm install --save-dev @jessestricker/tsconfig
pnpm add --save-dev @jessestricker/tsconfig
```

Then, use one (or more) of the provided base configurations for the `extends` options in your `tsconfig.json` file, for example:

```jsonc
{
  "extends": [
    "@jessestricker/tsconfig/node-24.json",
    "@jessestricker/tsconfig/pedantic.json",
  ],
  // ...
}
```
