import type { LoggedInBackendContext } from '#/context';
import type { Account } from '#/services/interfaces/account';
import type { WithId } from '#/services/interfaces/base';
import type { Person } from '#/services/interfaces/person';
import { PersonDetailsButtonSection } from './buttons';
import { PersonDetailsPersonalDataSection } from './personal-data';

export type PersonDetailsProps = {
  context: LoggedInBackendContext;
  isOwnProfile?: boolean;
  person: WithId<Person>;
  account: WithId<Account> | null;
};

export const PersonDetails = async ({
  context,
  isOwnProfile = false,
  person,
  account,
}: PersonDetailsProps) => {
  return (
    <>
      <PersonDetailsPersonalDataSection
        context={context}
        person={person}
        account={account}
      />
      <PersonDetailsButtonSection
        context={context}
        isOwnProfile={isOwnProfile}
        person={person}
        account={account}
      />
    </>
  );
};
