import { AccountSettingsForm } from '#/administration/sections/persons/account-settings';
import { requireLogin } from '#/auth/component';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';

export default async function Page() {
  const context = await requireLogin({
    permission: 'schulhof.administration.persons.account-settings',
    context: {
      personId: '#self',
    },
  });

  const person = await context.getPerson();

  return (
    <>
      <Col w='12'>
        <Breadcrumbs
          path={[
            'paths.schulhof',
            'paths.schulhof.account',
            'paths.schulhof.account.profile',
            'paths.schulhof.account.profile.account-settings',
          ]}
        />
        <Heading size='1' t='schulhof.account.profile.account-settings.title' />
      </Col>
      <AccountSettingsForm isOwnProfile person={person} />
    </>
  );
}
