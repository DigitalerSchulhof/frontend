import { requireLogin } from '#/auth/component';
import { AdministrationGroup } from '#/components/administration/group';
import { AdministrationSectionCard } from '#/components/administration/section-card';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';

export default async function Page() {
  await requireLogin();

  return (
    <>
      <Col w='12'>
        <Breadcrumbs
          path={['paths.schulhof', 'paths.schulhof.administration']}
        />
        <Heading size='1' t='schulhof.administration.title' />
      </Col>
      <Col w='3'>
        <AdministrationGroup title='schulhof.administration.groups.persons.title'>
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
        </AdministrationGroup>
      </Col>
    </>
  );
}
