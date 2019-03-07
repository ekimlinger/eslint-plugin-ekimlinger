module.exports = {
    meta: {
        type: 'problem',
        docs: {
            category: 'Only immutable redux-form',
            description: 'Redux-form has to be immutable in order to work',
        },
        fixable: 'code',
        schema: [],
    },

    create(context) {
        const importRule = node => {
            const libraryName = node.source.value;
            if (libraryName === 'redux-form') {
                context.report({
                    node,
                    loc: node.loc,
                    message: 'Redux-form needs to be immutable',
                    fix: fixer =>
                        fixer.replaceText(
                            node.source,
                            "'redux-form/immutable'"
                        ),
                });
            }
        };
        return {
            ImportDeclaration: importRule,
        };
    },
};
