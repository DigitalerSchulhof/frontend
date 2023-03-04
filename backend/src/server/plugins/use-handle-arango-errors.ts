import { OnExecuteDoneHookResultOnNextHook } from '@envelop/core';
import { GraphQLError } from 'graphql';
import { Plugin, handleStreamOrSingleExecutionResult } from 'graphql-yoga';
import {
  AggregatedInputValidationError,
  InputValidationError,
} from '../../validators/utils';
import {
  GraphQLIdNotFoundError,
  GraphQLRevMismatchError,
  GraphQLValidationError,
} from '../../resolvers/errors';
import { ArangoError } from 'arangojs/error';
import { IdNotFoundError, RevMismatchError } from '../../repositories/utils';

export function useHandleArangoErrors(): Plugin {
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

              if (err.originalError instanceof RevMismatchError) {
                acc.push(new GraphQLRevMismatchError(err));
                return acc;
              }

              if (err.originalError instanceof IdNotFoundError) {
                acc.push(new GraphQLIdNotFoundError(err));
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
