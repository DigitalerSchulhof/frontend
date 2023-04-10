import { requireNoLogin } from '#/auth/server';
import { ForgotPasswordForm } from './form';

export default async function Page() {
  await requireNoLogin();

  return <ForgotPasswordForm />;
}
