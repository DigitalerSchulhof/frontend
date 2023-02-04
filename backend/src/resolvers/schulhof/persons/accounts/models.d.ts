import { Collection, Edge } from '../../../models';
import { Person } from '../persons/models';

/**
 * @collection accounts
 */
export interface Account extends Collection {
  username: string;
  salt: string;
  password: string;
}

/**
 * @edge persons_accounts
 */
export interface PersonsAccounts extends Edge<Person, Account> {}

export type AccountAccess = Account;
export type AccountFieldsAccess = Account;
