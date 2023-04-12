import { LoggedInBackendContext } from '#/backend/context';
import {
  PersonGender,
  PersonType,
} from '#/backend/repositories/content/person';
import { Col } from '#/ui/Col';
import { PersonDetailsChangePersonalDataSection } from './change-personal-data';
import { PersonDetailsPersonalDataSection } from './personal-data';

export type PersonDetailsProps = {
  context: LoggedInBackendContext;
  isOwnProfile?: boolean;
  person: {
    id: string;
    type: PersonType;
    firstname: string;
    lastname: string;
    gender: PersonGender;
    teacherCode: string | null;
  };
  account: {
    username: string;
    email: string;
    lastLogin: number | null;
    secondLastLogin: number | null;
  } | null;
};

export const PersonDetails = async ({
  context,
  isOwnProfile = false,
  person,
  account,
}: PersonDetailsProps) => {
  return (
    <>
      <Col w='6'>
        <PersonDetailsPersonalDataSection
          context={context}
          person={person}
          account={account}
        />
        <PersonDetailsChangePersonalDataSection
          context={context}
          isOwnProfile={isOwnProfile}
          person={person}
          account={account}
        />
      </Col>
    </>
  );
};
