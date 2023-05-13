import { requireNoLogin } from '#/auth/component';
import { ForgotPasswordForm } from './form';

export default async function Page() {
  await requireNoLogin();

  return <ForgotPasswordForm />;
}
