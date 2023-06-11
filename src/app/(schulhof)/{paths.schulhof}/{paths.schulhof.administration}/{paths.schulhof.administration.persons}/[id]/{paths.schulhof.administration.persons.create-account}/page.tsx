import { AccountForm } from '#/administration/sections/persons/account-form';
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
  const context = await requireLogin();

  const person = await context.services.person.getById(params.id);

  if (!person || person.accountId !== null) notFound();

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
            'paths.schulhof.administration.persons.create-account',
          ]}
        />
        <Heading size='1'>
          <T
            t='schulhof.administration.sections.persons.create-account.title'
            args={{
              name: formatName(person),
            }}
          />
        </Heading>
      </Col>
      <Col w='12'>
        <AccountForm person={person} account={null} />
      </Col>
    </>
  );
}
