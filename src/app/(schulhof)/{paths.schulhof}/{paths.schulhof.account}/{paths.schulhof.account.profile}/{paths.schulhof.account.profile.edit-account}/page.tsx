import { AccountForm } from '#/administration/sections/persons/account-form';
import { requireLogin } from '#/auth/component';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';

export default async function Page() {
  const context = await requireLogin();

  const person = await context.getPerson();

  return (
    <>
      <Col w='12'>
        <Breadcrumbs
          path={[
            'paths.schulhof',
            'paths.schulhof.account',
            'paths.schulhof.account.profile',
            'paths.schulhof.account.profile.edit-account',
          ]}
        />
        <Heading size='1' t='schulhof.account.profile.edit-account.title' />
      </Col>
      <Col w='12'>
        <AccountForm isOwnProfile person={person} />
      </Col>
    </>
  );
}
