"use strict";

var rule = require("../../../lib/rules/only-immutable-redux-form.js");
var RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: "module" }
});
ruleTester.run("only-immutable-redux-form.js", rule, {
  valid: [
    'import {something} from "redux-form/immutable";', 
  ],
  invalid: [
    {
      code: "import {something} from 'redux-form';",
      errors: [{ message: "Redux-form needs to be immutable" }]
    },
  ]
});
