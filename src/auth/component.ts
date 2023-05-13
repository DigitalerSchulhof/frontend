import { backendContext } from '#/context';
import { ComponentContextCreator } from '#/context/auth';

export const componentContextCreator = new ComponentContextCreator(
  backendContext
);

export const getContext = componentContextCreator.getContext.bind(
  componentContextCreator
);

export const requireLogin = componentContextCreator.requireLogin.bind(
  componentContextCreator
);

export const requireNoLogin = componentContextCreator.requireNoLogin.bind(
  componentContextCreator
);
