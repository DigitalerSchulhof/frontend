import { useRequireNoLogin } from '#/auth';
import { LoginForm } from './form';

export default async function Page() {
  await useRequireNoLogin();

  return <LoginForm />;
}
