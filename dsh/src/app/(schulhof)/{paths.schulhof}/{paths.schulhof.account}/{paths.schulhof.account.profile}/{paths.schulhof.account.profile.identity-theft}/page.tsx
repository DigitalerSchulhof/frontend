import { requireLogin } from '#/auth/server';
import { T, useT } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { Variant } from '#/ui/variants';
import { IdentityTheftForm } from './form';

export default async function Page() {
  const { account } = await requireLogin();
  const { t } = useT();

  return (
    <>
      <Col w='12'>
        <Breadcrumbs
          path={[
            'paths.schulhof',
            'paths.schulhof.account',
            'paths.schulhof.account.profile',
            'paths.schulhof.account.profile.identity-theft',
          ]}
        />
        <Heading size='1'>
          <T t='schulhof.account.profile.identity-theft.title' />
        </Heading>
      </Col>
      <Col w='12'>
        <Alert
          variant={Variant.Warning}
          title='schulhof.account.profile.identity-theft.disclaimer.title'
        >
          {t('schulhof.account.profile.identity-theft.disclaimer.content', {
            form_of_address: account.formOfAddress,
          }).map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </Alert>
        <IdentityTheftForm />
      </Col>
    </>
  );
}
