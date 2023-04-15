import { EditAccountForm } from './form';

export type EditAccountProps = {
  isOwnProfile?: boolean;
  person: {
    id: string;
  };
  account: {
    id: string;
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
    <EditAccountForm
      isOwnProfile={isOwnProfile}
      personId={person.id}
      accountId={account.id}
      username={account.username}
      email={account.email}
    />
  );
};
