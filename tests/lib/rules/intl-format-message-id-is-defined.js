var path = require("path");
var rule = require("../../../lib/rules/intl-format-message-id-is-defined.js");
var RuleTester = require("eslint").RuleTester;

const testFileName = "./test-messages.json";

var ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: "module" }
});
ruleTester.run("intl-format-message-id-is-defined", rule, {
  valid: [
    {
      options: [testFileName],
      code: "intl.formatMessage({id: 'Some intlString to format'});"
    }
  ],
  invalid: [
    {
      options: [testFileName],
      code: "intl.formatMessage({id: 'Some intlString that is missing'});",
      errors: [
        {
          message:
            "Intl translation key is not listed under ./test-messages.json, which means the user will not see your translated string." ==
            'Must provide intl.formatMessage with a valid translation key as first argument in the form of {id: "String to translate"}'
        }
      ]
    }
  ]
});
