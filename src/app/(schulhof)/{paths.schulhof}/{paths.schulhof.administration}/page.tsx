import { requireLogin } from '#/auth/component';
import { AdministrationGroup } from '#/components/administration/group';
import { AdministrationSectionCard } from '#/components/administration/section-card';
import type { LoggedInBackendContext } from '#/context';
import type { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { noPermission } from '#/utils/client';

export default async function Page() {
  // Permission depends on whether at least on section is shown
  const context = await requireLogin(null);

  const groupsOrNull = await Promise.all([
    <PersonsGroup key='persons' context={context} />,
  ]);

  const groups = groupsOrNull.filter((e): e is JSX.Element => !!e);

  if (!groups.length) noPermission();

  return (
    <>
      <Col w='12'>
        <Breadcrumbs
          path={['paths.schulhof', 'paths.schulhof.administration']}
        />
        <Heading size='1' t='schulhof.administration.title' />
      </Col>
      {groups}
    </>
  );
}

const PersonsGroup = ({
  context,
}: {
  context: LoggedInBackendContext;
}): Promise<JSX.Element | null> => {
  return createAdministrationGroup(
    'schulhof.administration.groups.persons.title',
    [
      context.services.permission
        .hasPermission('schulhof.administration.sections.persons.read')
        .then((r) =>
          r ? (
            <AdministrationSectionCard
              title='schulhof.administration.sections.persons.card.title'
              description='schulhof.administration.sections.persons.card.description'
              // eslint-disable-next-line @typescript-eslint/no-var-requires
              icon={require(`../../../../../icons/32/users_5.png`).default}
              href={[
                'paths.schulhof',
                'paths.schulhof.administration',
                'paths.schulhof.administration.persons',
              ]}
            />
          ) : null
        ),
    ]
  );
};

async function createAdministrationGroup(
  title: TranslationsWithStringTypeAndNoVariables,
  promises: readonly Promise<JSX.Element | null>[]
): Promise<JSX.Element | null> {
  const elementsOrNull = await Promise.all(promises);
  const elements = elementsOrNull.filter((e): e is JSX.Element => !!e);

  if (!elements.length) return null;

  return (
    <Col w='3'>
      <AdministrationGroup title={title}>{elements}</AdministrationGroup>
    </Col>
  );
}
