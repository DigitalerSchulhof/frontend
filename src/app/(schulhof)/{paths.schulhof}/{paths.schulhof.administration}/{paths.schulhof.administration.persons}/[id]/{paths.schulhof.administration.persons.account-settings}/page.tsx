import { AccountSettingsForm } from '#/administration/sections/persons/account-settings';
import { requireLogin } from '#/auth/component';
import { T } from '#/i18n';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { formatName } from '#/utils';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const context = await requireLogin({
    permission: 'schulhof.administration.persons.account-settings',
    context: {
      personId: params.id,
    },
  });

  const person = await context.services.person.getPerson(params.id);

  if (!person || person.account === null) notFound();

  return (
    <>
      <Col w='12'>
        <Breadcrumbs
          path={[
            'paths.schulhof',
            'paths.schulhof.administration',
            'paths.schulhof.administration.persons',
            {
              title: `{${formatName(person)}}`,
              segment: `{${person.id}}`,
            },
            'paths.schulhof.administration.persons.account-settings',
          ]}
        />
        <Heading size='1'>
          <T
            t='schulhof.administration.sections.persons.account-settings.title'
            args={{
              name: formatName(person),
            }}
          />
        </Heading>
      </Col>
      <AccountSettingsForm person={person} />
    </>
  );
}
