import { T } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Button } from '#/ui/Button';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { Variant } from '#/ui/variants';
import { SchulhofRegisterHeading } from './heading';

export default async function Page() {
  return (
    <>
      <Col w='12'>
        <Breadcrumbs path={['paths.schulhof', 'paths.schulhof.register']} />
        <Heading size='1'>
          <SchulhofRegisterHeading />
        </Heading>
      </Col>
      <Col w='12'>
        <Alert variant={Variant.Warning}>
          <Heading size='4'>
            <T t='schulhof.register.description.title' />
          </Heading>
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
