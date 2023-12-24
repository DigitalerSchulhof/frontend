import type { DeepPartial } from '#/utils';
import type { HasId, ListResult, SearchOptions } from './base';

export interface PersonService {
  searchPersons(
    options: SearchOptions<{
      lastname: string;
      firstname: string;
      class: string;
      type: number;
    }>
  ): Promise<ListResult<Person>>;

  /**
   * Gets a person by ID.
   */
  getPerson(personId: string): Promise<Person | null>;

  /**
   * Creates a new person.
   */
  createPerson(person: CreatePersonData): Promise<Person>;

  /**
   * Updates a person.
   */
  updatePerson(
    personId: string,
    personRev: string,
    person: UpdatePersonData
  ): Promise<Person>;

  /**
   * Deletes a person.
   */
  deletePerson(personId: string, ifPersonRev: string): Promise<void>;

  /**
   * Creates a new account for the person.
   */
  createAccount(
    personId: string,
    personRev: string,
    accountData: CreateAccountData
  ): Promise<void>;

  /**
   * Updates a person's account.
   */
  updateAccount(
    personId: string,
    personRev: string,
    accountData: UpdateAccountData
  ): Promise<void>;

  /**
   * Deletes a person's account.
   */
  deleteAccount(personId: string, personRev: string): Promise<void>;

  /**
   * Generates a suggested teacher code.
   *
   * @param lastnameFirstThree The first three letters of the teacher's lastname.
   */
  generateTeacherCodeSuggestion(lastnameFirstThree: string): Promise<string>;
}

export type Person = HasId & {
  firstname: string;
  lastname: string;
  type: PersonType;
  gender: PersonGender;
  teacherCode: string | null;
  account: Account | null;
} & (
    | {
        account: Account;
      }
    | {
        account: null;
      }
  );

export interface CreatePersonData {
  firstname: string;
  lastname: string;
  type: PersonType;
  gender: PersonGender;
}

export type UpdatePersonData = DeepPartial<Person>;

export interface Account {
  username: string;
  email: string;
  password: Buffer;
  salt: Buffer;
  passwordExpiresAt: Date | null;
  lastLogin: Date | null;
  secondLastLogin: Date | null;
  settings: AccountSettings;
}

export interface AccountSettings {
  emailOn: AccountSettingsNotifyOn;
  pushOn: AccountSettingsNotifyOn;
  considerNews: AccountSettingsConsiderNews;
  mailbox: AccountSettingsMailbox;
  profile: AccountSettingsProfile;
}

export interface AccountSettingsNotifyOn {
  newMessage: boolean;
  newSubstitution: boolean;
  newNews: boolean;
}

export interface AccountSettingsConsiderNews {
  newEvent: boolean;
  newBlog: boolean;
  newGallery: boolean;
  fileChanged: boolean;
}

export interface AccountSettingsMailbox {
  deleteAfter: number | null;
  deleteAfterInBin: number | null;
}

export interface AccountSettingsProfile {
  sessionTimeout: number;
  formOfAddress: FormOfAddress;
}

export interface CreateAccountData {
  username: string;
  email: string;
}

export type UpdateAccountData = DeepPartial<Account>;

export enum PersonType {
  Student,
  Teacher,
  Parent,
  Admin,
  Other,
}

export enum PersonGender {
  Male,
  Female,
  Other,
}

export enum FormOfAddress {
  Formal,
  Informal,
}
