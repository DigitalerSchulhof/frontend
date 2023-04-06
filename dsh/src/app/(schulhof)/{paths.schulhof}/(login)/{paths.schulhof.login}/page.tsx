import { requireLogin } from '#/auth/server';
import { LoginForm } from './form';

export default async function Page() {
  await requireLogin(false);

  return <LoginForm />;
}
