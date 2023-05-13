import { T, makeLink } from '#/i18n';
import { Note } from '#/ui/Note';

export const Credits = () => {
  return (
    <Note>
      <T
        t='footer.credits'
        args={{
          FatcowLink: makeLink('http://www.fatcow.com/free-icons', {
            external: true,
          }),
          FatcowLicenseLink: makeLink(
            'http://creativecommons.org/licenses/by/3.0/us/',
            { external: true }
          ),
          RobotoLink: makeLink('https://github.com/google/roboto', {
            external: true,
          }),
          RobotoLicenseLink: makeLink(
            'https://github.com/google/roboto/blob/main/LICENSE',
            { external: true }
          ),
        }}
      />
    </Note>
  );
};
