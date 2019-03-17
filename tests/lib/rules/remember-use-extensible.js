"use strict";

var rule = require("../../../lib/rules/remember-use-extensible.js");
var RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: "module" }
});
ruleTester.run("remember-use-extensible.js", rule, {
  valid: [
    "'use extensible';\nconst {something} = someObject;",
    "'use extensible';\nconst [something] = someArray;"
  ],
  invalid: [
    {
      code: "const someObject = {}; const { something } = someObject;",
      errors: [
        { message: "'use extensible' not included at the top of the file." }
      ]
    },
    {
      code: "const someArray = []; const [ something ] = someArray;",
      errors: [
        { message: "'use extensible' not included at the top of the file." }
      ]
    }
  ]
});
