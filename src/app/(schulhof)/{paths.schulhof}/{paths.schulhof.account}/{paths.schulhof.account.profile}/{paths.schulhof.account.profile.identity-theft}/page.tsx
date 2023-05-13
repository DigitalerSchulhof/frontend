import { requireLogin } from '#/auth/component';
import { Alert } from '#/ui/Alert';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { Variant } from '#/ui/variants';
import { IdentityTheftForm } from './form';

export default async function Page() {
  const context = await requireLogin();

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
        <Heading size='1' t='schulhof.account.profile.identity-theft.title' />
      </Col>
      <Col w='12'>
        <Alert
          variant={Variant.Warning}
          title='schulhof.account.profile.identity-theft.disclaimer.title'
        >
          {context
            .t(
              'schulhof.account.profile.identity-theft.disclaimer.description',
              {
                form_of_address: context.account.formOfAddress,
              }
            )
            .map((e, i) => (
              <p key={i}>{e}</p>
            ))}
        </Alert>
        <IdentityTheftForm />
      </Col>
    </>
  );
}
