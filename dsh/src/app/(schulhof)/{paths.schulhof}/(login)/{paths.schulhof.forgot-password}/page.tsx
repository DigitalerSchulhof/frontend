import { useRequireNoLogin } from '#/auth/server';
import { ForgotPasswordForm } from './form';

export default async function Page() {
  await useRequireNoLogin();

  return <ForgotPasswordForm />;
}
