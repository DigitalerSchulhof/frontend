import { FooterButton } from '#/shell/footer/button';

export const Links = () => {
  return (
    <>
      <FooterButton href={['paths.contact']} t='footer.links.contact' />
      <FooterButton href={['paths.imprint']} t='footer.links.imprint' />
      <FooterButton href={['paths.privacy']} t='footer.links.privacy' />
    </>
  );
};
