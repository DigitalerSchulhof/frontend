import { backendContext } from '#/context';
import { ActionContextCreator } from '#/context/auth';

export const actionContextCreator = new ActionContextCreator(backendContext);

export const getContext =
  actionContextCreator.getContext.bind(actionContextCreator);

export const requireLogin =
  actionContextCreator.requireLogin.bind(actionContextCreator);

export const requireNoLogin =
  actionContextCreator.requireNoLogin.bind(actionContextCreator);
