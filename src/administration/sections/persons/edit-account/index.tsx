import { WithId } from '#/backend/repositories/arango';
import { AccountBase } from '#/backend/repositories/content/account';
import { PersonBase } from '#/backend/repositories/content/person';
import { Col } from '#/ui/Col';
import { EditAccountForm } from './form';

export type EditAccountProps = {
  isOwnProfile?: boolean;
  person: WithId<PersonBase>;
  account: WithId<AccountBase>;
};

export const EditAccount = async ({
  isOwnProfile = false,
  person,
  account,
}: EditAccountProps) => {
  return (
    <Col w='12'>
      <EditAccountForm
        isOwnProfile={isOwnProfile}
        personId={person.id}
        personRev={person.rev}
        username={account.username}
        email={account.email}
      />
    </Col>
  );
};
