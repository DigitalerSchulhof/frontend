import { backendContext } from '#/context';
import { CookiesContextCreator } from '#/context/auth';

export class ActionContextCreator extends CookiesContextCreator {
  handleNotLoggedIn(): never {
    throw new Error('Not logged in');
  }

  handleAlreadyLoggedIn() {
    throw new Error('Already logged in');
  }
}

export const actionContextCreator = new ActionContextCreator(backendContext);

export const getContext =
  actionContextCreator.getContext.bind(actionContextCreator);

export const requireLogin =
  actionContextCreator.requireLogin.bind(actionContextCreator);

export const requireNoLogin =
  actionContextCreator.requireNoLogin.bind(actionContextCreator);
