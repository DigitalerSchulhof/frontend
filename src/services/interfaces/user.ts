import type { FormOfAddress } from './person';
import type { Session } from './session';

export type Jwt = string;

export type JwtPayload = {
  ver: '1';

  /**
   * Issued at in s
   */
  iat: number;

  /**
   * Expiration date in s
   */
  exp: number;
  iss: 'dsh';

  /**
   * Session ID
   */
  sub: string;
};

export interface UserService {
  /**
   * Verifies that the given username and password are valid and creates a new session if they are.
   *
   * @returns A JWT for the new session.
   */
  login(username: string, password: string): Promise<{ jwt: Jwt }>;

  /**
   * Verifies that the passed JWT is valid and the session is not expired/revoked.
   *
   * @returns The payload of the JWT.
   */
  verifyJwt(jwt: Jwt): Promise<{
    payload: JwtPayload;
    personId: string;
    formOfAddress: FormOfAddress;
    session: Session;
  } | null>;

  /**
   * Sends a password reset link the the account's email address if the username and the email match.
   *
   * @returns The form of address and email of the user.
   */
  resetPassword(
    username: string,
    email: string
  ): Promise<{
    formOfAddress: FormOfAddress;
    email: string;
  }>;

  /**
   * Changes the password of the user if the old password is correct and the new passwords match.
   */
  changePassword(
    ifPersonRev: string,
    oldPassword: string,
    newPassword: string,
    newPasswordAgain: string
  ): Promise<void>;

  /**
   * Reports an identity theft and
   * changes the password of the user if the old password is correct and the new passwords match.
   * The identity theft is not reported if the old password is incorrect or the new ones mismatch.
   */
  reportIdentityTheft(
    ifPersonRev: string,
    oldPassword: string,
    newPassword: string,
    newPasswordAgain: string
  ): Promise<void>;
}
