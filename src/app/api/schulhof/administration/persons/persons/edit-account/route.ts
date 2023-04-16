export type EditAccountInput = {
  personId: string;
  username: string;
  email: string;
};

export type EditAccountOutputOk = {
  code: 'OK';
};

export type EditAccountOutputNotOk = {
  code: 'NOT_OK';
  errors: {
    code: never;
  }[];
};
