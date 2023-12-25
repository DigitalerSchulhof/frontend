import type { BackendContext, LoggedInBackendContext } from '#/context';
import { createLoggedInBackendContext } from '#/context';
import type { FormOfAddress } from '#/services/interfaces/person';
import type { Session } from '#/services/interfaces/session';
import type { JwtPayload } from '#/services/interfaces/user';

// eslint-disable-next-line @typescript-eslint/no-var-requires -- See https://github.com/vercel/next.js/issues/49752#issuecomment-1546687003
const { cookies } = require('next/headers');

export type SessionData = {
  payload: JwtPayload;
  personId: string;
  session: Session;
  formOfAddress: FormOfAddress;
};

abstract class ContextCreator {
  constructor(protected baseContext: BackendContext) {}

  getContext(): BackendContext {
    return this.baseContext;
  }

  /**
   * @param permission Explicitly no permission required if null
   */
  async requireLogin(
    permission:
      | string
      | {
          permission: string;
          context: object;
        }
      | null
  ): Promise<LoggedInBackendContext> {
    const sessionData = await this.getSessionData();

    if (!sessionData) {
      this.handleNotLoggedIn();
    }

    return this.createLoggedInContext(sessionData);
  }

  async requireNoLogin(): Promise<BackendContext> {
    const sessionData = await this.getSessionData();

    if (sessionData) {
      this.handleAlreadyLoggedIn();
    }

    return this.baseContext;
  }

  async getSessionData(): Promise<SessionData | null> {
    const jwt = this.getJwt();
    // No JWT provided
    if (!jwt) return null;

    const verified = await this.baseContext.services.user.verifyJwt(jwt);
    // Invalid JWT or session expired/revoked
    if (!verified) return null;

    return verified;
  }

  protected abstract getJwt(): string | undefined;

  protected abstract handleNotLoggedIn(): never;

  protected abstract handleAlreadyLoggedIn(): void;

  protected async createLoggedInContext(
    sessionData: SessionData
  ): Promise<Promise<LoggedInBackendContext>> {
    return createLoggedInBackendContext(
      this.baseContext,
      sessionData.personId,
      sessionData.session,
      sessionData.formOfAddress
    );
  }
}

export abstract class CookiesContextCreator extends ContextCreator {
  getJwt() {
    return cookies().get('jwt')?.value;
  }
}
