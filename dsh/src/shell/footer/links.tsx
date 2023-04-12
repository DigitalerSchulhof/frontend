import { FooterButton } from '#/shell/footer/button';
import { ButtonGroup } from '#/ui/Button';

export const Links = () => {
  return (
    <ButtonGroup>
      <FooterButton href={['paths.contact']} t='footer.links.contact' />
      <FooterButton href={['paths.imprint']} t='footer.links.imprint' />
      <FooterButton href={['paths.privacy']} t='footer.links.privacy' />
    </ButtonGroup>
  );
};
