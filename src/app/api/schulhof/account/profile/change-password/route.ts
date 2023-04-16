export type ChangePasswordInput = {
  oldPassword: string;
  newPassword: string;
  newPasswordAgain: string;
};

export type ChangePasswordOutputOk = {
  code: 'OK';
};

export type ChangePasswordOutputNotOk = {
  code: 'NOT_OK';
  errors: {
    code: 'INVALID_CREDENTIALS' | 'PASSWORD_MISMATCH';
  }[];
};
