module.exports = {
  meta: {
    type: "problem",
    docs: {
      category: "remember-use-extensible",
      description:
        "make sure not to forget 'use extensible' at the top of " +
        "a file when using destructuring",
      recommended: true,
      url: "https://github.com/ekimlinger/eslint-plugin-ekimlinger"
    },
    fixable: "code",
    schema: []
  },

  create(context) {
    const fixFunc = fixer =>
      fixer.insertTextAfterRange([0, 0], "'use extensible';\n");

    const theRule = node => {
      const sourceCode = context.getSourceCode();
      const operator = sourceCode.getFirstToken(node);
      if (operator) {
        const allText = sourceCode.text;
        const hasUseExtensible = allText.includes("use extensible");
        if (!hasUseExtensible) {
          context.report({
            node,
            loc: operator.loc,
            message: "'use extensible' not included at the top of the file.",
            fix: fixFunc
          });
        }
      }
    };
    return {
      ObjectPattern: theRule,
      ArrayPattern: theRule
    };
  }
};
