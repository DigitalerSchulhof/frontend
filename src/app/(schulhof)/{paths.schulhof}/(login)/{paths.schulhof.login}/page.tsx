import { requireNoLogin } from '#/auth/component';
import { LoginForm } from './form';

export default async function Page() {
  await requireNoLogin();

  return <LoginForm />;
}
