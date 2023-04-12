import { useRequireNoLogin } from '#/auth/server';
import { LoginForm } from './form';

export default async function Page() {
  await useRequireNoLogin();

  return <LoginForm />;
}
