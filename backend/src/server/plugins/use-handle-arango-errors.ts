import { OnExecuteDoneHookResultOnNextHook } from '@envelop/core';
import { GraphQLError } from 'graphql';
import { handleStreamOrSingleExecutionResult, Plugin } from 'graphql-yoga';
import { IdNotFoundError, RevMismatchError } from '../../repositories/errors';
import {
  GraphQLIdNotFoundError,
  GraphQLRevMismatchError,
} from '../../resolvers/errors';

export function useHandleArangoErrors(): Plugin {
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
