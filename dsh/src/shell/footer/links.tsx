import { T } from '#/i18n';
import { FooterButton } from '#/shell/footer/button';

export const Links = () => {
  return (
    <>
      <FooterButton href={['paths.contact']}>
        <T t='footer.links.contact' />
      </FooterButton>
      <FooterButton href={['paths.imprint']}>
        <T t='footer.links.imprint' />
      </FooterButton>
      <FooterButton href={['paths.privacy']}>
        <T t='footer.links.privacy' />
      </FooterButton>
    </>
  );
};
