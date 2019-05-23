const path = require("path");

module.exports = {
  meta: {
    type: "problem",
    docs: {
      category: "intl-format-message-id-is-defined",
      description:
        "React-intl requires that there be translations defined in order for " +
        "it to be passed into intl.formatMessage, if not, it falls back to the id. " +
        "This is problematic because the users will not see the translated version if " +
        "the id doesn't match the one in the translation file"
    },
    schema: [
      {
        type: "string" // Require the source for the translation file
      }
    ]
  },

  create(context) {
    // Actual rule
    const checkForMissingTranslationIfFormatMessage = node => {
      // Error messages
      const reportInvalidFormatting = () =>
        context.report({
          node,
          loc: node.loc,
          message:
            'Must provide intl.formatMessage with a valid translation key as first argument in the form of {id: "String to translate"}'
        });
      const reportInvalidTranslationsFile = () =>
        context.report({
          node,
          loc: node.loc,
          message:
            "Must provide valid translation JSON file source in the form of { stringToTranslate: any }"
        });

      // Start working for actual rule
      const maybeMemberExpression = node.callee;
      // Return early if we're not calling an object's function. Same as intl?.formatmessage expression
      if (maybeMemberExpression.type !== "MemberExpression") return;

      // Return early if we're not calling intl.formatMessage
      if (
        !maybeMemberExpression.object ||
        maybeMemberExpression.object.name !== "intl" ||
        maybeMemberExpression.property.name !== "formatMessage"
      ) {
        return;
      }
      // Checking to make sure that the formatting is actually good.
      if (
        !node.arguments ||
        !node.arguments.length ||
        node.arguments.length < 1 ||
        node.arguments[0].type !== "ObjectExpression"
      ) {
        console.log("node.arguments :", node.arguments);
        reportInvalidFormatting();
        return;
      }
      const translationObject = node.arguments[0];
      if (
        !translationObject ||
        !translationObject.properties ||
        !translationObject.properties[0] ||
        !translationObject.properties[0].key ||
        translationObject.properties[0].key.name !== "id" ||
        !translationObject.properties[0].value ||
        !translationObject.properties[0].value.value
      ) {
        console.log(
          "translationObject.properties[0] :",
          translationObject.properties[0].value.value
        );
        reportInvalidFormatting();
        return;
      }

      // Getting down to what we need to since we have the string now.
      const intlKey = translationObject.properties[0].value.value;

      // Check to make sure translations file can be found.
      const pathToTranslationFile = context.options[0];
      console.log("pathToTranslationFile :", pathToTranslationFile);
      if (!pathToTranslationFile || typeof pathToTranslationFile !== "string") {
        reportInvalidTranslationsFile();
        return;
      }
      const intlTranslations = require(path.join(
        process.env.PWD,
        pathToTranslationFile
      ));
      console.log("intlTranslations :", intlTranslations);
      if (!intlTranslations || typeof intlTranslations !== "object") {
        reportInvalidTranslationsFile();
        return;
      }

      const intlKeyIsInTranslationFile = !!intlTranslations[intlKey];
      if (!intlKeyIsInTranslationFile) {
        context.report({
          node,
          loc: node,
          message:
            "Intl translation key is not listed under " +
            pathToTranslationFile.toString() +
            ", which means the user will not see your translated string."
        });
      }
    };
    return {
      CallExpression: checkForMissingTranslationIfFormatMessage
    };
  }
};
