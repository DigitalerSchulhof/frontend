import { Col } from '#/ui/Col';
import { EditAccountForm } from './form';

export type EditAccountProps = {
  isOwnProfile?: boolean;
  person: {
    id: string;
  };
  account: {
    username: string;
    email: string;
  };
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
        username={account.username}
        email={account.email}
      />
    </Col>
  );
};
