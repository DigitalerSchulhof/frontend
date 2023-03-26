import * as authProviders from '#/auth/providers';
import { T } from '#/i18n';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';

export default function Page() {
  const provider = 'password';

  const { Login } = authProviders[provider];

  return (
    <>
      <Col w="12">
        <Breadcrumbs path={['{paths.schulhof}', '{paths.schulhof.login}']} />
        <Heading size="1">
          <T t="schulhof.login.welcome" />
        </Heading>
      </Col>
      <Col w="4">
        <Heading size="2">
          <T t="schulhof.login.login.title" />
        </Heading>
        <p>
          <T t="schulhof.login.login.description" />
        </p>
        <Login />
      </Col>
    </>
  );
}
