import { requireLogin } from '#/auth/component';
import { useT } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Breadcrumbs } from '#/ui/Breadcrumbs';
import { Button, ButtonGroup } from '#/ui/Button';
import { Col } from '#/ui/Col';
import { HiddenInput, TextFormRow } from '#/ui/Form';
import { Heading } from '#/ui/Heading';
import { Table } from '#/ui/Table';
import { IdentityTheftForm } from './form';

export default async function Page() {
  const context = await requireLogin();
  const { t } = useT();

  const person = await context.getPerson();

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
          variant='warning'
          title='schulhof.account.profile.identity-theft.disclaimer.title'
        >
          {t('schulhof.account.profile.identity-theft.disclaimer.description', {
            form_of_address: context.formOfAddress,
          }).map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </Alert>
        <IdentityTheftForm>
          <HiddenInput name='personRev' value={person.rev} />
          <Table>
            <TextFormRow
              label='schulhof.account.profile.identity-theft.form.old-password'
              name='oldPassword'
              autoComplete='current-password'
              type='password'
            />
            <TextFormRow
              label='schulhof.account.profile.identity-theft.form.new-password'
              name='newPassword'
              autoComplete='new-password'
              type='password'
            />
            <TextFormRow
              label='schulhof.account.profile.identity-theft.form.new-password-again'
              name='newPasswordAgain'
              autoComplete='new-password'
              type='password'
            />
          </Table>
          <ButtonGroup>
            <Button
              type='submit'
              variant='warning'
              t='schulhof.account.profile.identity-theft.form.buttons.submit'
            />
            <Button
              href={[
                'paths.schulhof',
                'paths.schulhof.account',
                'paths.schulhof.account.profile',
                'paths.schulhof.account.profile.change-password',
              ]}
              t='schulhof.account.profile.identity-theft.form.buttons.change-password'
            />
            <Button
              href={[
                'paths.schulhof',
                'paths.schulhof.account',
                'paths.schulhof.account.profile',
              ]}
              t='schulhof.account.profile.identity-theft.form.buttons.back'
            />
          </ButtonGroup>
        </IdentityTheftForm>
      </Col>
    </>
  );
}
