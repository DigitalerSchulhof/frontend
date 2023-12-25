import { ReportIdentityTheftForm } from '#/administration/sections/persons/report-identity-theft';
import { requireLogin } from '#/auth/component';
import { useT } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';

export default async function Page() {
  const { t } = useT();

  const context = await requireLogin({
    permission: 'schulhof.administration.persons.report-identity-theft',
    context: {
      personId: '#self',
    },
  });

  const person = await context.getPerson();

  return (
    <>
      <Col w='12'>
        <Breadcrumbs
          path={[
            'paths.schulhof',
            'paths.schulhof.account',
            'paths.schulhof.account.profile',
            'paths.schulhof.account.profile.report-identity-theft',
          ]}
        />
        <Heading
          size='1'
          t='schulhof.account.profile.report-identity-theft.title'
        />
      </Col>
      <Col w='12'>
        <Alert
          variant='warning'
          title='schulhof.account.profile.report-identity-theft.disclaimer.title'
        >
          {t(
            'schulhof.account.profile.report-identity-theft.disclaimer.description',
            {
              form_of_address: context.formOfAddress,
            }
          ).map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </Alert>
        <ReportIdentityTheftForm isOwnProfile person={person} />
      </Col>
    </>
  );
}
