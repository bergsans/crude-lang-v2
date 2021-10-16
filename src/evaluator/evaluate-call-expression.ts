import { fmtStr } from 'crude-dev-tools';
import { Environment, evaluate } from './evaluate';
import { environment } from './evaluate';
import { evaluateBlockStatements } from './evaluate-block-statements';

export function evaluateCallExpression(node, context: Environment) {
  if (!context.get(node.name)) {
    throw new Error(fmtStr(`Unknown definition: ${node.name}`, 'red'));
  }
  const { env, params, body } = context.get(node.name);
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
