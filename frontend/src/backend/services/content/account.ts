import { AccountBase } from '#/backend/repositories/content/account';
import { Service } from '../base';

export class AccountService extends Service<'accounts', AccountBase> {}
