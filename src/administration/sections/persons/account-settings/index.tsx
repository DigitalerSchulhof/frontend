import { T } from '#/i18n';
import type { Account } from '#/services/interfaces/person';
import { FormOfAddress, type Person } from '#/services/interfaces/person';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Col } from '#/ui/Col';
import {
  HiddenInput,
  NumberFormRow,
  NumberOrNullFormRow,
  SelectFormRow,
  ToggleFormRow,
} from '#/ui/Form';
import { Heading } from '#/ui/Heading';
import { Table } from '#/ui/Table';
import { EditAccountSettingsForm } from './form';

export const EditAccountSettings = async ({
  person,
  isOwnProfile = false,
}: {
  person: Person & { account: Account };
  isOwnProfile?: boolean;
}) => {
  const settings = person.account.settings;

  const own = isOwnProfile ? 'own' : 'other';

  return (
    <EditAccountSettingsForm own={own} personId={person.id}>
      <HiddenInput name='personId' value={person.id} />
      <HiddenInput name='personRev' value={person.rev} />
      <Col w='6'>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.account-settings.form.emailOn.title'
        />
        <Table columns='1fr auto'>
          <ToggleFormRow
            label='schulhof.administration.sections.persons.account-settings.form.emailOn.title'
            name='emailOnNewMessage'
            defaultValue={settings.emailOn.newMessage}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.account-settings.form.emailOn.newSubstitution'
            name='emailOnNewSubstitution'
            defaultValue={settings.emailOn.newSubstitution}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.account-settings.form.emailOn.newNews'
            name='emailOnNewNews'
            defaultValue={settings.emailOn.newNews}
          />
        </Table>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.account-settings.form.pushOn.title'
        />
        <Table columns='1fr auto'>
          <ToggleFormRow
            label='schulhof.administration.sections.persons.account-settings.form.pushOn.newMessage'
            name='pushOnNewMessage'
            defaultValue={settings.pushOn.newMessage}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.account-settings.form.pushOn.newSubstitution'
            name='pushOnNewSubstitution'
            defaultValue={settings.pushOn.newSubstitution}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.account-settings.form.pushOn.newNews'
            name='pushOnNewNews'
            defaultValue={settings.pushOn.newNews}
          />
        </Table>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.account-settings.form.considerNews.title'
        />
        <Table columns='1fr auto'>
          <ToggleFormRow
            label='schulhof.administration.sections.persons.account-settings.form.considerNews.newEvent'
            name='considerNewsNewEvent'
            defaultValue={settings.considerNews.newEvent}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.account-settings.form.considerNews.newBlog'
            name='considerNewsNewBlog'
            defaultValue={settings.considerNews.newBlog}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.account-settings.form.considerNews.newGallery'
            name='considerNewsNewGallery'
            defaultValue={settings.considerNews.newGallery}
          />
          <ToggleFormRow
            label='schulhof.administration.sections.persons.account-settings.form.considerNews.fileChanged'
            name='considerNewsFileChanged'
            defaultValue={settings.considerNews.fileChanged}
          />
        </Table>
      </Col>
      <Col w='6'>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.account-settings.form.mailbox.title'
        />
        <Table columns='1fr 150px'>
          <NumberOrNullFormRow
            whetherLabel='schulhof.administration.sections.persons.account-settings.form.mailbox.deleteAfter.title.whether'
            numberLabel='schulhof.administration.sections.persons.account-settings.form.mailbox.deleteAfter.title.number'
            unit='schulhof.administration.sections.persons.account-settings.form.mailbox.deleteAfterInBin.unit'
            defaultValue={settings.mailbox.deleteAfter}
            name='mailboxDeleteAfter'
            numberDefaultValue={100}
          />
          <NumberOrNullFormRow
            whetherLabel='schulhof.administration.sections.persons.account-settings.form.mailbox.deleteAfterInBin.title.whether'
            numberLabel='schulhof.administration.sections.persons.account-settings.form.mailbox.deleteAfterInBin.title.number'
            unit='schulhof.administration.sections.persons.account-settings.form.mailbox.deleteAfterInBin.unit'
            defaultValue={settings.mailbox.deleteAfterInBin}
            name='mailboxDeleteAfterInBin'
            numberDefaultValue={100}
          />
        </Table>
        <Heading
          size='2'
          t='schulhof.administration.sections.persons.account-settings.form.profile.title'
        />
        <Table columns='1fr 150px'>
          <NumberFormRow
            label='schulhof.administration.sections.persons.account-settings.form.profile.sessionTimeout.title'
            unit='schulhof.administration.sections.persons.account-settings.form.profile.sessionTimeout.unit'
            name='profileSessionTimeout'
            defaultValue={settings.profile.sessionTimeout}
          />
          <SelectFormRow
            label='schulhof.administration.sections.persons.account-settings.form.profile.formOfAddress.title'
            name='profileFormOfAddress'
            defaultValue={
              {
                [FormOfAddress.Informal]: 'informal',
                [FormOfAddress.Formal]: 'formal',
              }[settings.profile.formOfAddress]
            }
            values={{
              informal:
                'schulhof.administration.sections.persons.account-settings.form.profile.formOfAddress.values.informal',
              formal:
                'schulhof.administration.sections.persons.account-settings.form.profile.formOfAddress.values.formal',
            }}
          />
        </Table>
      </Col>
      <Col w='12'>
        <Alert
          variant='information'
          title='schulhof.administration.sections.persons.account-settings.disclaimer.title'
        >
          <p>
            <T t='schulhof.administration.sections.persons.account-settings.disclaimer.description' />
          </p>
        </Alert>
        <ButtonGroup>
          <Button
            type='submit'
            variant='success'
            t='schulhof.administration.sections.persons.account-settings.form.buttons.save'
          />
          <Button
            href={
              isOwnProfile
                ? [
                    'paths.schulhof',
                    'paths.schulhof.account',
                    'paths.schulhof.account.profile',
                  ]
                : [
                    'paths.schulhof',
                    'paths.schulhof.administration',
                    'paths.schulhof.administration.persons',
                    `{${person.id}}`,
                  ]
            }
            t={`schulhof.administration.sections.persons.account-settings.form.buttons.back.${own}`}
          />
        </ButtonGroup>
      </Col>
    </EditAccountSettingsForm>
  );
};
