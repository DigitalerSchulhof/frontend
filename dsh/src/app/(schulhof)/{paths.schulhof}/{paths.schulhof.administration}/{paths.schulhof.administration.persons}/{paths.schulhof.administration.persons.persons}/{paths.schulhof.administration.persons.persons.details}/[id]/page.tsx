import { PersonDetails } from '#/administration/sections/persons/slices/persons/details';
import { requireLogin } from '#/auth/server';
import { WithId } from '#/backend/repositories/arango';
import { AccountBase } from '#/backend/repositories/content/account';
import { AccountPersonIdFilter } from '#/backend/repositories/content/account/filters';
import { EqFilterOperator } from '#/backend/repositories/filters/operators';
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
  const { context } = await requireLogin();

  const [person, accountSearch] = await Promise.all([
    context.services.person.getById(params.id),
    context.services.account.search({
      filter: new AccountPersonIdFilter(new EqFilterOperator(params.id)),
    }),
  ]);

  if (!person) {
    notFound();
  }

  const account = (accountSearch.nodes[0] ??
    null) as WithId<AccountBase> | null;

  return (
    <>
      <Col w='12'>
        <Breadcrumbs
          path={[
            'paths.schulhof',
            'paths.schulhof.administration',
            'paths.schulhof.administration.persons',
            'paths.schulhof.administration.persons.persons',
            'paths.schulhof.administration.persons.persons.details',
          ]}
        />
        <Heading size='1'>
          <T
            t='schulhof.administration.sections.persons.slices.persons.details.title'
            args={{
              name: formatName(person),
            }}
          />
        </Heading>
      </Col>
      {/* @ts-expect-error -- Server Component */}
      <PersonDetails context={context} person={person} account={account} />
    </>
  );
}
