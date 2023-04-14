import { EditAccountForm } from './form';

export type EditAccountProps = {
  account: {
    id: string;
    username: string;
    email: string;
  };
};

export const EditAccount = async ({ account }: EditAccountProps) => {
  return (
    <EditAccountForm
      accountId={account.id}
      username={account.username}
      email={account.email}
    />
  );
};
