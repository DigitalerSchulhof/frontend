import * as graphql from 'graphql';
import { Paginated } from '../repositories/utils';
import { isNotNullOrUndefined } from '../utils';
import { ResolversParentTypes } from './types';

/**
 * Returns the first value of an argument of a field (replaces null values with undefined)
 *
 * **Note**: If the referenced parameter is optional, the `Maybe<R>` type from `src/resolvers/types.ts` must be added manually.
 *
 * @see getFieldArguments for retrieving all values
 *
 * @example
 * ```graphql
 * query {
 *   myType {
 *     x {
 *       a: myField(arg: "a")
 *       b: myField(arg: "b")
 *     }
 *   }
 * }
 * ```
 * ```ts
 *
 * // Within 'myType' resolver:
 * const argValue = getFieldArgument(info, ['x', 'myField'], 'arg'); // -> "a"
 * ```
 */
export function getFieldArgument<R = unknown>(
  info: graphql.GraphQLResolveInfo,
  fieldNames: readonly string[],
  argumentName: string
): R {
  return (
    yieldFieldArguments<R>(info, fieldNames, argumentName).next().value ??
    undefined
  );
}

/**
 * Returns all values of an argument of a field (strips null values)
 *
 * **Note**: If the referenced parameter is optional, the `Maybe<R>` type from `src/resolvers/types.ts` must be added manually.
 *
 * @see getFieldArgument for retrieving only the first value
 *
 * @example
 * ```graphql
 * query {
 *   myType {
 *     x {
 *       a: myField(arg: "a")
 *       b: myField(arg: "b")
 *     }
 *   }
 * }
 * ```
 * ```ts
 *
 * // Within 'myType' resolver:
 * const argValues = getFieldArguments(info, ['x', 'myField'], 'arg'); // -> ["a", "b"]
 * ```
 */
export function getFieldArguments<R = unknown>(
  info: graphql.GraphQLResolveInfo,
  fieldsPath: readonly string[],
  argumentName: string
): R[] {
  return [...yieldFieldArguments<R>(info, fieldsPath, argumentName)].filter(
    isNotNullOrUndefined
  );
}

/**
 * Returns all values of an argument of a field
 *
 * @example
 * ```graphql
 * query {
 *   myType {
 *     x {
 *       a: myField(arg: "a")
 *       b: myField(arg: "b")
 *     }
 *   }
 * }
 * ```
 * ```ts
 *
 * // Within 'myType' resolver:
 * const argValues = [...yieldFieldArguments(info, ['x', 'myField'], 'arg')]; // -> ["a", "b"]
 * ```
 */
export function* yieldFieldArguments<R = unknown>(
  info: graphql.GraphQLResolveInfo,
  fieldsPath: readonly string[],
  argumentName: string
): Generator<R> {
  for (const rootFieldNode of info.fieldNodes) {
    for (const fieldNode of yieldFieldNodes(
      info,
      rootFieldNode.selectionSet,
      fieldsPath
    )) {
      const valueNode = fieldNode.arguments?.find(
        (arg) => arg.name.value === argumentName
      )?.value;

      if (valueNode) {
        yield getValue<R>(info.variableValues, valueNode);
      }
    }
  }
}

/**
 * Returns whether the field is requested in the query
 *
 * @example
 * ```graphql
 * query {
 *   myType {
 *     x {
 *       a: myField
 *       b: myField
 *     }
 *   }
 * }
 * ```
 * ```ts
 *
 * // Within 'myType' resolver:
 * const isRequested = isFieldRequested(info, ['x', 'myField']); // -> true
 * const isAlsoRequested = isFieldRequested(info, ['x', 'myOtherField']); // -> false
 * ```
 */
export function isFieldRequested(
  info: graphql.GraphQLResolveInfo,
  fieldPath: readonly string[]
): boolean {
  return info.fieldNodes.some(
    (fieldNode) =>
      !yieldFieldNodes(info, fieldNode.selectionSet, fieldPath).next().done
  );
}

/**
 * Traverses the AST and yields all field nodes by the given fields path
 *
 * @example
 * ```graphql
 * query {
 *   myType {
 *     x {
 *       a: myField
 *       b: myField
 *     }
 *   }
 * }
 * ```
 * ```ts
 *
 * // Within 'myType' resolver:
 * const fieldNodesGenerator = yieldFieldNodes(info.fieldNodes[0].selectionSet, ['x', 'myField']);
 * const myFieldA = fieldNodesGenerator.next().value; // -> (reference to 'a: myField')
 * const myFieldB = fieldNodesGenerator.next().value; // -> (reference to 'b: myField')
 * ```
 */
export function* yieldFieldNodes(
  info: graphql.GraphQLResolveInfo,
  selectionSet: graphql.SelectionSetNode | undefined,
  fieldPath: readonly string[]
): Generator<graphql.FieldNode> {
  if (!fieldPath.length) return;
  if (!selectionSet?.selections.length) return;

  for (const selection of selectionSet.selections) {
    if (isExcludedByDirective(selection, info.variableValues)) continue;

    switch (selection.kind) {
      case graphql.Kind.FRAGMENT_SPREAD:
        yield* yieldFieldNodes(
          info,
          info.fragments[selection.name.value].selectionSet,
          fieldPath
        );
        break;
      case graphql.Kind.INLINE_FRAGMENT:
        yield* yieldFieldNodes(info, selection.selectionSet, fieldPath);
        break;
      case graphql.Kind.FIELD:
        if (selection.name.value !== fieldPath[0]) break;

        if (fieldPath.length === 1) {
          yield selection;
        } else {
          yield* yieldFieldNodes(
            info,
            selection.selectionSet,
            fieldPath.slice(1)
          );
        }
    }
  }
}

export function isExcludedByDirective(
  node: graphql.SelectionNode,
  variables: Record<string, any>
): boolean {
  return (
    node.directives?.some((directive) => {
      if (
        directive.name.value !== 'skip' &&
        directive.name.value !== 'include'
      ) {
        return false;
      }

      const ifArgument = directive.arguments?.find(
        (arg) => arg.name.value === 'if'
      );

      if (!ifArgument) return false;

      // The argument is excluded if the value is `true` for `@skip` and `false` for `@include`
      return (
        getValue<boolean>(variables, ifArgument.value) ===
        (directive.name.value === 'skip')
      );
    }) ?? false
  );
}

/**
 * Returns the actual value of a `ValueNode`
 */
export function getValue<R = unknown>(
  variables: Record<string, any>,
  valueNode: graphql.ValueNode
): R {
  // We have to use this many assertions since `R` does in fact override the actual "unknown" return value
  switch (valueNode.kind) {
    case graphql.Kind.VARIABLE:
      return variables[valueNode.name.value] as unknown as R;
    case graphql.Kind.NULL:
      return null as unknown as R;
    case graphql.Kind.LIST:
      return valueNode.values.map((val) =>
        getValue(variables, val)
      ) as unknown as R;
    case graphql.Kind.OBJECT:
      return valueNode.fields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name.value]: getValue(variables, field.value),
        }),
        {}
      ) as unknown as R;
    case graphql.Kind.INT:
      return parseInt(valueNode.value, 10) as unknown as R;
    case graphql.Kind.FLOAT:
      return parseFloat(valueNode.value) as unknown as R;
    case graphql.Kind.STRING:
    case graphql.Kind.BOOLEAN:
    case graphql.Kind.ENUM:
      return valueNode.value as unknown as R;
  }
}

export function getPageInfo<T>(
  paginated: Paginated<T>
): ResolversParentTypes['PageInfo'] {
  return {
    totalResults: paginated.total,
  };
}

type InputField = {
  [K in string]?: { value: unknown } | null;
};

type UnwrapInput<T extends InputField> = {
  [K in keyof T]: T[K] extends { value: infer V } ? V : never;
};

export function unwrapInput<T extends InputField>(input: T): UnwrapInput<T> {
  const result: any = {};
  for (const key in input) {
    if (input[key]) {
      result[key] = input[key]!.value;
    }
  }
  return result;
}
