/**
 * ESLint rule: no-top-level-side-effects
 *
 * Detects bare expressions at the module top-level that constitute side effects
 * (function calls, assignments). These silently break tree-shaking when
 * "sideEffects": false is declared in package.json — bundlers assume the module
 * is pure and may skip it, but the side effect never runs.
 *
 * Safe top-level patterns (not flagged):
 *   export const x = fn()    → ExportNamedDeclaration, not ExpressionStatement
 *   const x = fn()           → VariableDeclaration
 *   function foo() { fn() }  → fn() is inside a FunctionDeclaration body
 *
 * Unsafe patterns (flagged):
 *   fn()                     → bare CallExpression
 *   a.b.register()           → bare MemberExpression call
 *   globalThis.x = value     → bare AssignmentExpression
 */

/** @type {import('eslint').Rule.RuleDefinition} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow top-level side effects in library modules — they break tree-shaking with "sideEffects": false.',
    },
    schema: [],
    messages: {
      topLevelCall:
        'Top-level function call is a side effect. Move inside a function body, or add this file to the "sideEffects" array in package.json.',
      topLevelAssignment:
        'Top-level assignment is a side effect. Move inside a function body, or add this file to the "sideEffects" array in package.json.',
    },
  },

  create(context) {
    return {
      // Only examine statements that are direct children of the module Program
      'Program > ExpressionStatement'(node) {
        const expr = node.expression;

        // Bare call: fn(), obj.method(), a.b().c()
        if (expr.type === 'CallExpression' || expr.type === 'ChainExpression') {
          context.report({ node, messageId: 'topLevelCall' });
          return;
        }

        // Bare assignment: x = 1, globalThis.foo = bar
        if (expr.type === 'AssignmentExpression') {
          context.report({ node, messageId: 'topLevelAssignment' });
        }
      },
    };
  },
};
