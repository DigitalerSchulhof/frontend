import { requireNoLogin } from '#/auth/server';
import { LoginForm } from './form';

export default async function Page() {
  await requireNoLogin();

  return <LoginForm />;
}
