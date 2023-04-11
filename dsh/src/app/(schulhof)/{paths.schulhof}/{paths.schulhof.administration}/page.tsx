import { AdministrationOverviewSection } from '#/administration/overview/section';
import { administrationSections } from '#/administration/sections';
import { T } from '#/i18n';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';

export default function Page() {
  return (
    <>
      <Col w='12'>
        <Breadcrumbs
          path={['paths.schulhof', 'paths.schulhof.administration']}
        />
        <Heading size='1'>
          <T t='schulhof.administration.title' />
        </Heading>
      </Col>
      <Col w='3'>
        <AdministrationOverviewSection section={administrationSections[0]} />
      </Col>
    </>
  );
}
