import { T } from '#/i18n';
import { Link } from '#/ui/Link';
import { Note } from '#/ui/Note';

export const Credits = () => {
  return (
    <Note>
      <T
        t='footer.credits'
        args={{
          FatcowLink: (c) =>
            c.map((e) => (
              // eslint-disable-next-line react/jsx-key
              <Link external href='http://www.fatcow.com/free-icons'>
                {e}
              </Link>
            )),
          FatcowLicenseLink: (c) =>
            c.map((e) => (
              // eslint-disable-next-line react/jsx-key
              <Link
                external
                href='http://creativecommons.org/licenses/by/3.0/us/'
              >
                {e}
              </Link>
            )),
          RobotoLink: (c) =>
            c.map((e) => (
              // eslint-disable-next-line react/jsx-key
              <Link external href='https://github.com/google/roboto'>
                {e}
              </Link>
            )),
          RobotoLicenseLink: (c) =>
            c.map((e) => (
              // eslint-disable-next-line react/jsx-key
              <Link
                external
                href='https://github.com/google/roboto/blob/main/LICENSE'
              >
                {e}
              </Link>
            )),
        }}
      />
    </Note>
  );
};
