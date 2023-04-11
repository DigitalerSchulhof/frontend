import { useT as clientUseT } from '../client';
import { TContext } from './utils';

export function useT(): TContext {
  if (typeof window === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('../server/t').getServerT();
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks -- This is for this component to work both on the server and the client
  return clientUseT();
}
