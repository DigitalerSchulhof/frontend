import { AdministrationOverviewSection } from '#/administration/overview/section';
import { administrationSections } from '#/administration/sections';
import { requireLogin } from '#/auth';
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
        <AdministrationOverviewSection section={administrationSections[0]} />
      </Col>
    </>
  );
}
