import { T } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { Variant } from '#/ui/variants';

export const TemporaryPasswordWarning = () => {
  const formOfAddress = 'informal';

  return (
    <Alert variant={Variant.Information}>
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
          variant={Variant.Default}
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
