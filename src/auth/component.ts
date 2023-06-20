import { backendContext } from '#/context';
import { CookiesContextCreator } from '#/context/auth';
import { redirect } from 'next/navigation';

export class ComponentContextCreator extends CookiesContextCreator {
  handleNotLoggedIn(): never {
    const { t } = this.baseContext;

    redirect(`/${[t('paths.schulhof'), t('paths.schulhof.login')].join('/')}`);
  }

  handleAlreadyLoggedIn(): never {
    const { t } = this.baseContext;

    redirect(
      `/${[t('paths.schulhof'), t('paths.schulhof.account')].join('/')}`
    );
  }
}

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
