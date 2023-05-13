import { WithId } from '#/backend/repositories/arango';
import { SessionBase } from '#/backend/repositories/content/session';
import {
  BackendContext,
  LoggedInBackendContext,
  createLoggedInBackendContext,
} from '#/context';
import { redirect } from 'next/navigation';
// eslint-disable-next-line @typescript-eslint/no-var-requires -- See https://github.com/vercel/next.js/issues/49752#issuecomment-1546687003
const { cookies } = require('next/headers');

abstract class ContextCreator {
  constructor(protected context: BackendContext) {}

  getContext(): BackendContext {
    // TODO: Return LoggedInBackendContext if logged in
    return this.context;
  }

  async requireLogin(): Promise<LoggedInBackendContext> {
    const session = await this.getSession();

    if (!session) {
      this.handleNotLoggedIn();
    }

    return this.createLoggedInContext(session);
  }

  async requireNoLogin(): Promise<BackendContext> {
    const session = await this.getSession();

    if (session) {
      this.handleAlreadyLoggedIn(session);
    }

    return this.context;
  }

  async getSession(): Promise<WithId<SessionBase> | null> {
    const jwt = this.getJwt();
    if (!jwt) return null;

    const jwtContent = this.context.services.session.verifyJwt(jwt);
    if (!jwtContent) return null;

    if (jwtContent.exp < Date.now() / 1000) {
      return null;
    }

    const session = await this.context.services.session.getById(
      jwtContent.sessionId
    );

    // Session revoked
    if (!session) return null;

    return session;
  }

  protected abstract getJwt(): string | undefined;

  protected abstract handleNotLoggedIn(): never;

  protected abstract handleAlreadyLoggedIn(session: WithId<SessionBase>): void;

  protected async createLoggedInContext(
    session: WithId<SessionBase>
  ): Promise<Promise<LoggedInBackendContext>> {
    const account = (await this.context.services.account.getById(
      session.accountId
    ))!;

    const person = (await this.context.services.person.getById(
      account.personId
    ))!;

    return createLoggedInBackendContext(this.context, session, account, person);
  }
}

abstract class CookiesContextCreator extends ContextCreator {
  getJwt() {
    return cookies().get('jwt')?.value;
  }
}

export class ActionContextCreator extends CookiesContextCreator {
  handleNotLoggedIn(): never {
    throw new Error('Not logged in');
  }

  handleAlreadyLoggedIn() {
    throw new Error('Already logged in');
  }
}

export class ComponentContextCreator extends CookiesContextCreator {
  handleNotLoggedIn(): never {
    const { t } = this.context;

    redirect(`/${[t('paths.schulhof'), t('paths.schulhof.login')].join('/')}`);
  }

  handleAlreadyLoggedIn(): never {
    const { t } = this.context;

    redirect(
      `/${[t('paths.schulhof'), t('paths.schulhof.account')].join('/')}`
    );
  }
}
