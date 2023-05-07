import { requireNoLogin } from '#/auth';
import { ForgotPasswordForm } from './form';

export default async function Page() {
  await requireNoLogin();

  return <ForgotPasswordForm />;
}
