import { OnExecuteDoneHookResultOnNextHook } from '@envelop/core';
import { GraphQLError } from 'graphql';
import { Plugin, handleStreamOrSingleExecutionResult } from 'graphql-yoga';
import {
  AggregatedInputValidationError,
  InputValidationError,
} from '../../validators/utils';
import { GraphQLValidationError } from '../../resolvers/errors';

export function useHandleValidationErrors(): Plugin {
  return {
    async onExecute() {
      return {
        onExecuteDone(payload) {
          const handleResult: OnExecuteDoneHookResultOnNextHook<unknown> = ({
            result,
            setResult,
          }) => {
            if (!result.errors) return;

            const newErrors = result.errors.reduce<unknown[]>((acc, err) => {
              if (!(err instanceof GraphQLError)) {
                acc.push(err);
                return acc;
              }

              if (err.originalError instanceof InputValidationError) {
                acc.push(handleInputValidationError(err));
                return acc;
              }

              if (err.originalError instanceof AggregatedInputValidationError) {
                acc.push(...handleAggregatedInputValidationError(err));
                return acc;
              }

              acc.push(err);
              return acc;
            }, []);

            setResult({
              ...result,
              errors: newErrors,
            });
          };

          return handleStreamOrSingleExecutionResult(payload, handleResult);
        },
      };
    },
  };
}

function handleInputValidationError(
  error: GraphQLError
): GraphQLValidationError {
  const validationError = error.originalError as InputValidationError;

  return new GraphQLValidationError(
    validationError.message,
    validationError.code,
    error
  );
}

function handleAggregatedInputValidationError(
  error: GraphQLError
): GraphQLValidationError[] {
  const aggregatedError = error.originalError as AggregatedInputValidationError;

  return aggregatedError.errors.map((err) => {
    return new GraphQLValidationError(err.message, err.code, error);
  });
}
