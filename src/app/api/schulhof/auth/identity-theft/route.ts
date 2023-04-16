export type IdentityTheftInput = {
  oldPassword: string;
  newPassword: string;
  newPasswordAgain: string;
};

export type IdentityTheftOutputOk = {
  code: 'OK';
};

export type IdentityTheftOutputNotOk = {
  code: 'NOT_OK';
  errors: {
    code: 'INVALID_CREDENTIALS' | 'PASSWORD_MISMATCH';
  }[];
};
