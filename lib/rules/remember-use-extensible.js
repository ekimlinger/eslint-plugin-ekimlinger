module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            category: 'Remember use extensible',
            description:
                "make sure not to forget 'use extensible' at the top of " +
                'a file when using the spread operator',
            recommended: true,
        },
        fixable: null,
        schema: [],

        messages: {
            unexpected: "'use extensible' not included at the top of the file.",
        },
    },

    create(context) {
        const spreadRule = node => {
            const sourceCode = context.getSourceCode();
            const operator = sourceCode.getFirstToken(node);
            if (operator) {
                const allText = sourceCode.text;
                const hasUseExtensible = allText.includes('use extensible');
                if (!hasUseExtensible) {
                    context.report({
                        node,
                        loc: operator.loc,
                        message:
                            "Spread operator used without 'use extensible' at top of file.",
                    });
                }
            }
        };
        return {
            SpreadProperty: spreadRule,
            SpreadElement: spreadRule,
        };
    },
};
