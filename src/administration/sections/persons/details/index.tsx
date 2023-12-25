import type { LoggedInBackendContext } from '#/context';
import type { Person } from '#/services/interfaces/person';
import { PersonDetailsButtonSection } from './buttons';
import { PersonDetailsPersonalDataSection } from './personal-data';

export const PersonDetails = async ({
  context,
  isOwnProfile = false,
  person,
}: {
  context: LoggedInBackendContext;
  isOwnProfile?: boolean;
  person: Person;
}) => {
  return (
    <>
      <PersonDetailsPersonalDataSection context={context} person={person} />
      <PersonDetailsButtonSection
        context={context}
        isOwnProfile={isOwnProfile}
        person={person}
      />
    </>
  );
};
