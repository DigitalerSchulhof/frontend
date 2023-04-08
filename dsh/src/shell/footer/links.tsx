import { T } from '#/i18n';
import { FooterButton } from '#/shell/footer/button';
import { Col } from '#/ui/Col';

export const Links = () => {
  return (
    <Col w='12'>
      <FooterButton href={['paths.contact']}>
        <T t='footer.links.contact' />
      </FooterButton>
      <FooterButton href={['paths.imprint']}>
        <T t='footer.links.imprint' />
      </FooterButton>
      <FooterButton href={['paths.privacy']}>
        <T t='footer.links.privacy' />
      </FooterButton>
    </Col>
  );
};
