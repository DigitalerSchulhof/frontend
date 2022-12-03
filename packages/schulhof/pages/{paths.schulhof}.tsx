import { useT } from "@dsh/core";

export default function Page() {
  const { t } = useT();

  return t('login.welcome');
}
