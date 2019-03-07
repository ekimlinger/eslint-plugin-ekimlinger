# eslint-plugin-ekimlinger

Some awesome custom lint rules made by me for the world!

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev

--For Yarn--
$ yarn add eslint --dev
```

Next, install `eslint-plugin-ekimlinger`:

```
$ npm install eslint-plugin-ekimlinger --save-dev

--For Yarn--
$ yarn add eslint-plugin-ekimlinger --dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-ekimlinger` globally.

## Usage

Add `ekimlinger` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["ekimlinger"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "ekimlinger/[rule-name-here]": 2
  }
}
```

## List of supported rules

### Rules currently working:

- `only-immutable-redux-form` (ES6): When enabled, this rule disallows the use of importing from `'redux-form'`, in favor of `'redux-form/immutable'`. When used with Prettier, or running eslint with the `--fix` flag, these should automatically be fixed.

### Rules in progress:

- `fix-duplicate-imports` (ES6): A rule that only allows one import statement for a module (see example below). This ensures that code is more concise and easy to find. When used with Prettier, or running eslint with the `--fix` flag, these will be consolidated to the first import.

```javascript
// Before
import defaultImport, { someDependency } from "some-module";
import { someOther } from "some-module";
// After
import defaultImport, { someDependency, someOther } from "some-module";
```

- `remember-use-extensible` (ES6): For projects that have to opt into [babel-plugin-extensible-destructuring](https://github.com/vacuumlabs/babel-plugin-extensible-destructuring), it is easily forgettable to add the directive at the start of a file. This poses an issue because the destructured variables are silently set to `undefined`, especially when using safe coding practices. This rule will ensure that anytime you are destructuring a potentially immutable object or array it is advised to have `'use extensible';` at the top of the file. When used with Prettier, or running eslint with the `--fix` flag, the directive will automatically be added.
