import { requireLogin } from '#/auth';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { ChangePasswordForm } from './form';

export default async function Page() {
  await requireLogin();

  return (
    <>
      <Col w='12'>
        <Breadcrumbs
          path={[
            'paths.schulhof',
            'paths.schulhof.account',
            'paths.schulhof.account.profile',
            'paths.schulhof.account.profile.change-password',
          ]}
        />
        <Heading size='1' t='schulhof.account.profile.change-password.title' />
      </Col>
      <Col w='12'>
        <ChangePasswordForm />
      </Col>
    </>
  );
}
