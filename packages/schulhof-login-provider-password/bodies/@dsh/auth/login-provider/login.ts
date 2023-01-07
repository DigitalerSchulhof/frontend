export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export enum LoginErrorCode {
  InternalError = 'INTERNAL_ERROR',
  InvalidCredentials = 'INVALID_CREDENTIALS'
}

export type LoginResponse = LoginResponseError | LoginResponseSuccess;

export type LoginResponseError = {
  readonly __typename?: 'LoginResponseError';
  readonly code: LoginErrorCode;
};

export type LoginResponseSuccess = {
  readonly __typename?: 'LoginResponseSuccess';
  readonly jwt: Scalars['String'];
};

export type RootMutation = {
  readonly __typename?: 'RootMutation';
  readonly login: LoginResponse;
};


export type RootMutation_LoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};
