import * as graphql from 'graphql';

/**
 * Get the first field in the first query packed in a fake `GraphQLResolveInfo` object (Note: Only `fieldNodes` is set)
 *
 * Expects the form
 * ```graphql
 * query {
 *   <returns this field node>
 * }
 * ```
 */
export function getFirstFieldNodeAsResolveInfo(
  source: string
): graphql.GraphQLResolveInfo {
  return {
    fieldNodes: (
      graphql.parse(source).definitions[0] as graphql.OperationDefinitionNode
    ).selectionSet.selections as graphql.FieldNode[],
  } as unknown as graphql.GraphQLResolveInfo;
}

/**
 * Get the first value of the first argument of the first field in the first query
 *
 * Expects the form
 * ```graphql
 * query {
 *   <any name>(<any name>: <returns this value node>)
 * }
 * ```
 */
export function getFirstArgument<N extends graphql.ValueNode>(
  source: string
): N {
  return getFirstFieldNodeAsResolveInfo(source).fieldNodes[0].arguments![0]
    .value as N;
}
