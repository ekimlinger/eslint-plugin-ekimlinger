/**
 * @fileoverview Fixes duplicate import sources within a file.
 * @author Evan Kimlinger
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * Returns the name of the module imported or re-exported.
 *
 * @param {ASTNode} node - A node to get.
 * @returns {string} the name of the module, or empty string if no name.
 */
function getSourceValue(node) {
    if (node && node.source && node.source.value) {
        return node.source.value.trim();
    }

    return '';
}

const fixImports = (node, matchingImportSource) => fixer => {
    let fixers = [fixer.remove(node)];
    const firstImportSpecifiers = matchingImportSource.node.specifiers;

    if (!firstImportSpecifiers.length) {
        return fixer.remove(matchingImportSource.node);
    }
    const firstImportSpecifier = firstImportSpecifiers[0];
    const lastImportSpecifier =
        firstImportSpecifiers[firstImportSpecifiers.length - 1];
    const nonDefaultImports = node.specifiers
        .filter(x => x.type === 'ImportSpecifier')
        .map(
            x =>
                x.imported.name === x.local.name
                    ? x.imported.name
                    : x.imported.name + ' as ' + x.local.name
        )
        .join(', ');
    const defaultImports = node.specifiers
        .filter(x => x.type === 'ImportDefaultSpecifier')
        .map(x => x.local.name)
        .join(', ');

    // Don't attempt to fix namespace definitions
    const firstImportIsNamespace =
        firstImportSpecifier &&
        firstImportSpecifier.type === 'ImportNamespaceSpecifier';
    const hasNamespace = !!node.specifiers.filter(
        // No find in es5 :(
        x => x.type === 'ImportNamespaceSpecifier'
    ).length;
    if (firstImportIsNamespace || hasNamespace) return;

    // Fix non-defaults
    if (lastImportSpecifier.type === 'ImportDefaultSpecifier') {
        nonDefaultImports.length &&
            fixers.push(
                fixer.insertTextAfter(
                    lastImportSpecifier,
                    ', { ' + nonDefaultImports + ' } '
                )
            );
    } else {
        nonDefaultImports.length &&
            fixers.push(
                fixer.insertTextAfter(
                    lastImportSpecifier,
                    ', ' + nonDefaultImports
                )
            );
    }

    // Fix default(s)
    const start = firstImportSpecifier.start;
    const end = firstImportSpecifier.end;
    if (firstImportSpecifier.type === 'ImportSpecifier') {
        defaultImports.length &&
            fixers.push(
                fixer.insertTextBeforeRange(
                    [start - 2, end],
                    defaultImports + ', '
                )
            );
    } else {
        defaultImports.length &&
            fixers.push(
                fixer.insertTextBeforeRange([start, end], defaultImports + ', ')
            );
    }

    return fixers;
};

/**
 * Checks if the name of the import or export exists in the given array, and reports if so.
 *
 * @param {RuleContext} context - The ESLint rule context object.
 * @param {ASTNode} node - A node to get.
 * @param {string} value - The name of the imported or exported module.
 * @param {string[]} array - The array containing other imports or exports in the file.
 *
 * @returns {void} No return value
 */
function checkAndReport(context, node, value, importsInFile) {
    let matchingImportSource;
    for (let i = 0; i < importsInFile.length; i++) {
        const element = importsInFile[i];

        const maybeMatchingSource = element.sourceValue;
        if (maybeMatchingSource === value) {
            matchingImportSource = element;
            break;
        }
    }

    // Filter out type definitions
    const typeDeclaration =
        node &&
        node.specifiers &&
        node.specifiers[0] &&
        node.specifiers[0].importKind === 'type';
    if (typeDeclaration) return;

    if (matchingImportSource) {
        context.report({
            node,
            message: 'Import is duplicated',
            data: {
                module: value,
            },
            fix: fixImports(node, matchingImportSource),
        });
    }
}

/**
 * @callback nodeCallback
 * @param {ASTNode} node - A node to handle.
 */

/**
 * Returns a function handling the imports of a given file
 *
 * @param {RuleContext} context - The ESLint rule context object.
 * @param {boolean} includeExports - Whether or not to check for exports in addition to imports.
 * @param {string[]} importsInFile - The array containing other imports in the file.
 *
 * @returns {nodeCallback} A function passed to ESLint to handle the statement.
 */
function handleImports(context, importsInFile) {
    return function(node) {
        const sourceValue = getSourceValue(node);

        if (sourceValue) {
            checkAndReport(context, node, sourceValue, importsInFile, 'import');

            importsInFile.push({ sourceValue, node });
        }
    };
}

module.exports = {
    meta: {
        type: 'problem',

        docs: {
            description: 'disallow duplicate module imports',
            category: 'ECMAScript 6',
            recommended: false,
            url: 'https://eslint.org/docs/rules/no-duplicate-imports',
        },
        fixable: 'code',
    },

    create(context) {
        const importsInFile = [];

        return {
            ImportDeclaration: handleImports(context, importsInFile),
        };
    },
};
