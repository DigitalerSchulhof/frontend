import { useRequireNoLogin } from '#/auth';
import { ForgotPasswordForm } from './form';

export default async function Page() {
  await useRequireNoLogin();

  return <ForgotPasswordForm />;
}
