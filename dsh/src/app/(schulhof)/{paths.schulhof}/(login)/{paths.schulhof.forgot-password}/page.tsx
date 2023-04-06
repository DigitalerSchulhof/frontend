import { requireLogin } from '#/auth/server';
import { ForgotPasswordForm } from './form';

export default async function Page() {
  await requireLogin(false);

  return <ForgotPasswordForm />;
}
