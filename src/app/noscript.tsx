import { T, makeLink, useT } from '#/i18n';
import { Alert } from '#/ui/Alert';
import { Col } from '#/ui/Col';
import { Variant } from '#/ui/variants';

export const NoScript = () => {
  const { t } = useT();

  return (
    <Col as='noscript' w='12'>
      <Alert variant={Variant.Error} title='generic.noscript.title'>
        <p>
          <T
            t='generic.noscript.message'
            args={{
              EnableLink: makeLink(t('generic.noscript.link'), {
                external: true,
              }),
            }}
          />
        </p>
      </Alert>
    </Col>
  );
};
