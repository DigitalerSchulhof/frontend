import { getContext } from '#/backend/context';
import { NextResponse } from 'next/server';

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

export async function POST(req: Request) {
  const body = await req.json();

  const { oldPassword, newPassword, newPasswordAgain } = body;

  const context = getContext(req);

  if (
    typeof oldPassword !== 'string' ||
    typeof newPassword !== 'string' ||
    typeof newPasswordAgain !== 'string'
  ) {
    return NextResponse.json(
      {
        code: 'NOT_OK',
        errors: [{ code: 'INVALID_INPUT' }],
      },
      { status: 400 }
    );
  }
}
