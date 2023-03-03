import {
  OnExecuteDoneHookResultOnNextHook
} from '@envelop/core';
import { GraphQLError } from 'graphql';
import { Plugin, handleStreamOrSingleExecutionResult } from 'graphql-yoga';
import {
  AggregatedInputValidationError,
  InputValidationError,
} from '../../validators/utils';

export function useValidationErrors(): Plugin {
  return {
    async onExecute() {
      return {
        onExecuteDone(payload) {
          const handleResult: OnExecuteDoneHookResultOnNextHook<{}> = ({
            result,
            setResult,
          }) => {
            if (!result.errors) return;

            const newErrors = result.errors.reduce<any[]>((acc, err) => {
              if (err instanceof GraphQLError === false) {
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

export const VALIDATION_ERROR = 'VALIDATION_ERROR';

function handleInputValidationError(error: GraphQLError): any {
  const validationError = error.originalError as InputValidationError;

  return new GraphQLError(validationError.message, {
    ...error,
    extensions: {
      ...error.extensions,
      code: VALIDATION_ERROR,
      errorCode: validationError.code,
    },
  });
}

function handleAggregatedInputValidationError(error: GraphQLError): any[] {
  const aggregatedError = error.originalError as AggregatedInputValidationError;

  return aggregatedError.errors.map((err) => {
    return new GraphQLError(err.message, {
      ...error,
      extensions: {
        ...error.extensions,
        code: VALIDATION_ERROR,
        errorCode: err.code,
      },
    });
  });
}
