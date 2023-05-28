import { T } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Heading } from '#/ui/Heading';

export const TemporaryPasswordWarning = () => {
  const formOfAddress = 'informal';

  return (
    <Alert variant='information'>
      <Heading size='4'>
        <T
          t='schulhof.account.temporary-password-warning.title'
          args={{
            form_of_address: formOfAddress,
          }}
        />
      </Heading>
      <p>
        <T
          t='schulhof.account.temporary-password-warning.text'
          args={{
            form_of_address: formOfAddress,
          }}
        />
      </p>
      <ButtonGroup>
        <Button
          t='schulhof.account.temporary-password-warning.button'
          href={[
            'paths.schulhof',
            'paths.schulhof.account',
            'paths.schulhof.account.profile',
            'paths.schulhof.account.profile.change-password',
          ]}
        />
      </ButtonGroup>
    </Alert>
  );
};
