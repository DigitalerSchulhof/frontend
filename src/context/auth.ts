import {
  BackendContext,
  LoggedInBackendContext,
  createLoggedInBackendContext,
} from '#/context';
import { WithId } from '#/services/interfaces/base';
import { Session } from '#/services/interfaces/session';
// eslint-disable-next-line @typescript-eslint/no-var-requires -- See https://github.com/vercel/next.js/issues/49752#issuecomment-1546687003
const { cookies } = require('next/headers');

abstract class ContextCreator {
  constructor(protected baseContext: BackendContext) {}

  getContext(): BackendContext {
    return this.baseContext;
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

    return this.baseContext;
  }

  async getSession(): Promise<WithId<Session> | null> {
    const jwt = this.getJwt();
    if (!jwt) return null;

    const jwtContent = this.baseContext.services.session.getJwtContent(jwt);
    if (!jwtContent) return null;

    if (jwtContent.exp < Date.now() / 1000) {
      return null;
    }

    const session = await this.baseContext.services.session.get(
      jwtContent.sessionId
    );

    // Session revoked
    if (!session) return null;

    return session;
  }

  protected abstract getJwt(): string | undefined;

  protected abstract handleNotLoggedIn(): never;

  protected abstract handleAlreadyLoggedIn(session: Session): void;

  protected async createLoggedInContext(
    session: WithId<Session>
  ): Promise<Promise<LoggedInBackendContext>> {
    const person = await this.baseContext.services.person.get(session.personId);

    if (!person) throw new Error('No person');
    if (!person.accountId) throw new Error('No account');

    const account = (await this.baseContext.services.account.get(
      person.accountId
    ))!;

    return createLoggedInBackendContext(
      this.baseContext,
      session,
      account,
      person
    );
  }
}

export abstract class CookiesContextCreator extends ContextCreator {
  getJwt() {
    return cookies().get('jwt')?.value;
  }
}
