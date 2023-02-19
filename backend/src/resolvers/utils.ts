import * as aql from 'arangojs/aql';
import { ArrayCursor } from 'arangojs/cursor';
import * as graphql from 'graphql';
import { InputMaybe, ResolversParentTypes, SortDirection } from './types';

export type MaybeArray<T> = T | T[];

/**
 * The identity function.
 */
export function identity<T>(x: T): T {
  return x;
}

/**
 * Returns the given value, but replaces `null` with `undefined`.
 *
 * @example
 * ```ts
 * const limit = withoutNull(args.limit);
 * //    ^ number | undefined     ^ number | null |  undefined
 * ```
 */
// With these overloads we don't add `undefined` to types that aren't nullable in the first place
export function withoutNull<T>(value: NonNullable<T>): T;
export function withoutNull<T>(value: T | null): T | undefined;
export function withoutNull<T>(val: T | null): T | undefined {
  return val === null ? undefined : val;
}

/**
 * Returns `true` for values other than `null` and `undefined`.
 *
 * @example
 * ```ts
 * const numberArray = numberOrNullArray.filter(isNotNullUndefined);
 * //    ^ number[]    ^ (number | null)[]
 * ```
 */
export function isNotNullOrUndefined<T>(val: T | null | undefined): val is T {
  return val !== null && val !== undefined;
}

const REFERENCE_COMPARATOR = <T>(a: T, b: T) => a === b;

/**
 * Filters out duplicate values with an optional comparator function and returns the new array.
 * @param comparator A function that takes two values and returns `true` if they should be considered identical
 *
 * @example
 * ```ts
 * unique([1, 2, 3, 2, 1]); // -> [1, 2, 3]
 * unique([{ id: 1 }, { id: 2 }, { id: 1 }], (a, b) => a.id === b.id); // -> [{ id: 1 }, { id: 2 }]
 * ```
 */
export function unique<T>(
  arr: readonly T[],
  comparator: (a: T, b: T) => boolean = REFERENCE_COMPARATOR
): T[] {
  if (arr.length === 0) return [];
  // If the comparator is the default one, we can use a Set to filter out duplicates since it's much faster
  if (comparator === REFERENCE_COMPARATOR) return [...new Set(arr)];

  return arr.filter((val, i) => arr.findIndex((v) => comparator(v, val)) === i);
}

export function toArray<T>(maybeArray: MaybeArray<T>): T[] {
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray];
}

/**
 * Converts a numeric string to an integer and throws a `GraphQLError` if the string is not a valid integer.
 *
 * @example
 * ```ts
 * const id = castToNumber(args.id);
 * //    ^ number               ^ ID (the GraphQL scalar type)
 * ```
 */
export function castToNumber(val: string | number): number {
  if (typeof val === 'number') return val;

  const nr = Number(val);

  if (Number.isNaN(nr)) {
    throw new graphql.GraphQLError(
      `Expected a numeric string, but got: '${val}'`
    );
  }

  return nr;
}

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

export class TypedGraphQLError extends graphql.GraphQLError {
  constructor(message: string, code: string) {
    super(message, {
      extensions: {
        code,
      },
    });
  }
}

export class GraphQLPermissionError extends TypedGraphQLError {
  constructor() {
    super(
      'You do not have permission to perform this action',
      'PERMISSION_DENIED'
    );
  }
}
