import { GraphQLScalarType, Kind } from 'graphql';
import { getValue } from '../utils';

export const Date = new GraphQLScalarType({
  name: 'Date',
  description:
    'The `Date` scalar type represents a timestamp: number of milliseconds from start of UNIX epoch.',
  serialize(value) {
    if (typeof value === 'number') {
      return value;
    }
    throw new Error(
      `Date cannot represent non-integer value: ${String(value)}`
    );
  },
  parseValue(value) {
    if (typeof value === 'number') {
      return value;
    }
    throw new Error(
      `Date cannot represent non-integer value: ${String(value)}`
    );
  },
  parseLiteral(ast, variables) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10);
    }
    if (ast.kind === Kind.STRING) {
      return parseInt(ast.value, 10);
    }
    throw new Error(
      `Date cannot represent non-integer value: ${String(
        getValue(variables ?? {}, ast)
      )}`
    );
  },
});
