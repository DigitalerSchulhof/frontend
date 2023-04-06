import { T } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Col } from '#/ui/Col';
import { Heading } from '#/ui/Heading';
import { Variant } from '#/ui/variants';

export const NoScript = () => {
  return (
    <Col as='noscript' w='12'>
      <Alert variant={Variant.Error}>
        <Heading size='4'>
          <T t='generic.noscript.title' />
        </Heading>
        <p>
          <T t='generic.noscript.message' />
        </p>
      </Alert>
    </Col>
  );
};
