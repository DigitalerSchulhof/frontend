import { FooterButton, FooterButtonGroup } from '#/shell/footer/button';

export const Links = () => {
  return (
    <FooterButtonGroup>
      <FooterButton href={['paths.contact']} t='footer.links.contact' />
      <FooterButton href={['paths.imprint']} t='footer.links.imprint' />
      <FooterButton href={['paths.privacy']} t='footer.links.privacy' />
    </FooterButtonGroup>
  );
};
