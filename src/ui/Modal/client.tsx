import { getContext } from '#/auth/component';
import { T } from '#/i18n';
import { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import { Alert } from '#/ui/Alert';
import { Button, ButtonGroup } from '#/ui/Button';
import { Heading } from '#/ui/Heading';
import { Loading } from '#/ui/Loading';
import { Modal } from '#/ui/Modal';
import { Variant } from '#/ui/variants';
import { ReactNode } from 'react';

export type LoadingModalProps = {
  title: TranslationsWithStringTypeAndNoVariables;
  description: TranslationsWithStringTypeAndNoVariables;
};

export const LoadingModal = ({ title, description }: LoadingModalProps) => {
  const { t } = getContext();

  return (
    <Modal>
      <Heading size='1'>{t(title)}</Heading>
      <p>{t('generic.wait')}</p>
      <Loading />
      <p>{t(description)}</p>
    </Modal>
  );
};

export type ErrorModalProps = {
  close: () => void;
  title: TranslationsWithStringTypeAndNoVariables;
  description: TranslationsWithStringTypeAndNoVariables;
  reasons: readonly ReactNode[];
};

export const ErrorModal = ({
  close,
  title,
  description,
  reasons,
}: ErrorModalProps) => {
  return (
    <Modal onClose={close}>
      <Alert variant={Variant.Error} title={title}>
        <p>
          <T t={description} />
        </p>
        <ul>
          {reasons.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </Alert>
      <ButtonGroup>
        <Button onClick={close} t='generic.back' />
      </ButtonGroup>
    </Modal>
  );
};
