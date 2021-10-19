import { fmtStr } from 'crude-dev-tools';
import { environment, Environment } from './environment';
import { evaluate } from './evaluate';
import * as AST from '../parser/AST-types';
import { evaluateBlockStatements } from './evaluate-block-statements';

export function evaluateCallExpression(
  node: AST.CallExpression,
  context: Environment
) {
  if (!context.get(node.callee)) {
    throw new Error(fmtStr(`Unknown definition: ${node.callee}`, 'red'));
  }
  const { env, params, body } = context.get(node.callee);
  const updateEnv = params.reduce(
    (acc, v, i) => ({
      ...acc,
      [v.literal]: evaluate(node.args[i], context),
    }),
    env
  );
  const functionEnvironment = environment(updateEnv, context);
  return evaluateBlockStatements(body.statements, functionEnvironment);
}
