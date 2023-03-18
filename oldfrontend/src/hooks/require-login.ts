import { useT } from "@i18n";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../schulhof/auth";

export const useRequireLogin = (shouldBeLoggedIn: boolean = true) => {
  const { isLoggedIn } = useAuth();
  const t = useT();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn !== shouldBeLoggedIn) {
      if (shouldBeLoggedIn) {
        router.push(`/${t('paths.schulhof')}/${t('paths.schulhof.login')}`);
      } else {
        router.push(`/${t('paths.schulhof')}/${t('paths.schulhof.account')}`);
      }
    }
  }, [router, t, shouldBeLoggedIn, isLoggedIn]);
};
