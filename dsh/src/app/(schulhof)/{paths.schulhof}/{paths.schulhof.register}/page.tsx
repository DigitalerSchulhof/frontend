import { T } from '#/i18n';
import { getSettings } from '#/settings/server';
import { Alert } from '#/ui/Alert';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Button } from '#/ui/Button';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { Variant } from '#/ui/variants';

export default async function Page() {
  const settings = await getSettings();

  return (
    <>
      <Col w='12'>
        <Breadcrumbs path={['paths.schulhof', 'paths.schulhof.register']} />
        <Heading size='1'>
          <T
            t='schulhof.register.heading'
            args={{
              school_name_genus: settings.school.name.genus,
              school_name_genitive: settings.school.name.genitive,
            }}
          />
        </Heading>
      </Col>
      <Col w='12'>
        <Alert
          variant={Variant.Warning}
          title='schulhof.register.description.title'
        >
          <p>
            <T t='schulhof.register.description.text' />
          </p>
        </Alert>
        <Button href={['paths.schulhof', 'paths.schulhof.login']}>
          <T t='schulhof.register.buttons.login' />
        </Button>
        <Button href={['paths.schulhof', 'paths.schulhof.forgot-password']}>
          <T t='schulhof.register.buttons.forgot-password' />
        </Button>
      </Col>
    </>
  );
}
