import * as React from "react";
import type { LoginProvider } from "@dsh/schulhof/shells/login-provider";

export default {
  component: (
    <>
      Anmeldung hier
    </>
  ),
  onLogin() {
    alert("HI");
  }
} satisfies LoginProvider;
