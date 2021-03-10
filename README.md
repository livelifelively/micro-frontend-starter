# Micro Frontend Starter

## Folder Structure and Reasoning

We have divided our packages into following. All packages reside in `/src`. Each package has prefix in its name based on its type like, @qbila/prefix-package-name. e.g. @qbila/uim-multi-select

1. **components-modules** - common shared components and modules. modules > components. Subdivision is as follows:
   1. _business-components_: (package name prefix: bc) reusable business packages that were mostly dependent on ui-components/modules. e.g. @qbila/bc-buying-signals, @qbila/bc-company-avatar-info etc.
   2. _business-modules_: (package name prefix: bm) combination of ui-components/modules and other business-components/modules. Larger than business-components. e.g. @qbila/bm-preferences-drawer, @qbila/bm-share-news-drawer etc.
   3. _ui-components_: (package name prefix: uic) customised ui-components for our specific use case. e.g. @qbila/uic-drawer, @qbila/uic-icons, @qbila/uic-no-items
   4. _ui-modules_: (package name prefix: uim) use more than one ui library (e.g. ant design) components or ui-components. e.g. @qbila/uim-multi-select.
2. **apis** - (package name prefix: api) API packages. Corresponds to each microfrontend. To enable reuse of microfrontend api in any other microfrontend. e.g. @qbila/api-news
3. **microfrontends** - (package name prefix: _no-prefix_) vertical divisions of the application. uses components and resources to serve a specific business objective. there will be a configuration driven shell application which can be built on the fly and which will be able to pick specific micro-frontends. e.g. @qbila/news
4. **configs-constants** - (package name prefix: cc) configurations and constants used in the application. To enable one place definitions and reuse. e.g. @qbila/cc-constants
5. **services** - (package name prefix: s) Functionalties independent of business or ui logics. Used across application. e.g. @qbila/s-http, @qbila/s-local-storage, @qbila/s-cookie, @qbila/s-date-time

## Getting up and running

1. `npm i yarn -g` - globally install yarn
2. `yarn global add lerna` - globally install lerna
3. `git clone` clone repo from bitbucket.
4. `yarn bootstrap`
5. `cd src/micro-frontends/shell/` cd to shell application
6. `yarn local` run application on localhost. It starts on 8080 by default. But its better to start v2 backend before this one to avoid port conflict. Will start on 8081 in that case.

## Adding new package

1. `delete node_modules from root and src/micro-frontends/shell` delete existing node_modules
2. `yarn bootstrap` install and link packages.

### Troubleshooting - most probable reasons

1. Check package.json for the new package.

## Deployment and publishing

1. `node build-script.js` - build deployable version for application. Edit `buildEnv` to whatever environment you are building for. difference is development has devTools and is not minified. Development build can be used for local or testing. use production environment for production or staging.
2. `yarn lerna-publish-force` #FIXME - As of now we are publishing all packages all the time. ideally should only publish packages that are changed.

#TODO pass buildEnv as a variable (development or production).
#TODO Move to CI/CD for this. Build and publishing should be automated to avoid npm packages version conflicts.

## Common Issues and Fixes

1. You can face this error after creating a new module `Unable to resolve path to module '@qbila/...` to handle this error, you need to add `/* eslint-disable import/no-unresolved */` to the file.

## Monorepo with Lerna & Yarn Workspaces

A Monorepo with multiple packages and a shared build, test, and release process.

- [Lerna](https://lernajs.io/)  - The Monorepo manager
- [Yarn Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/)  -  Sane multi-package management
- [React](https://reactjs.org/)  -  JavaScript library for user interfaces
- [Babel](https://babeljs.io/)  -  Compiles next-gen JavaScript
- [Storybook](https://storybook.js.org/) - UI Component Environment
- [Jest](https://jestjs.io/)  -  Unit/Snapshot Testing

## Linting and Formatting

All formatting and linting should be taken care of for you using [ESLint](https://eslint.org/), and [Prettier](https://prettier.io/). You should also consider installing an extension for CSS syntax highlighting.

- [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components)
