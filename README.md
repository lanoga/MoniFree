# startvue3

This template should help get you started developing with Vue 3 in Vite.

## Tech stack

- [Vue 3](https://vuejs.org/guide/introduction.html)
- [Vite](https://vitejs.dev/guide/)
- [Pinia store](https://pinia.vuejs.org/introduction.html)
- Form validation with [VeeValidate](https://vee-validate.logaretm.com/v4/guide/overview/)
- Styling with [TailwindCSS](https://tailwindcss.com/)
- [Vue3 DataTable](https://vue3-datatable-document.vercel.app/)
- Composition utilities with [VueUse](https://vueuse.org/)
- Pre-commit linting/formatting with [husky](https://www.npmjs.com/package/husky) and [lint-staged](https://github.com/okonet/lint-staged)
- Unit testing with [Vitest](https://vitest.dev/) and E2E testing with [Cypress](https://www.cypress.io/)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
