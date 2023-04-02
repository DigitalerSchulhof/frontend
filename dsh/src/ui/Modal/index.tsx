'use client';

import { useT } from '#/i18n/client';
import { TranslationsWithStringTypeAndNoVariables } from '#/i18n/translations';
import { Heading } from '#/ui/Heading';
import { Loading } from '#/ui/Loading';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

export interface ModalProps {
  onClose?: () => void;
}

export const Modal = ({
  onClose,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & ModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    <>
      {createPortal(<ModalOverlay onClick={onClose} />, document.body)}
      {createPortal(<ModalContainer {...props} />, document.body)}
    </>
  ) : null;
};

export interface LoadingModalProps {
  title: TranslationsWithStringTypeAndNoVariables;
  description: TranslationsWithStringTypeAndNoVariables;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  title,
  description,
}) => {
  const { t } = useT();

  return (
    <Modal>
      <Heading size='1'>{t(title)}</Heading>
      <p>{t('generic.wait')}</p>
      <Loading />
      <p>{t(description)}</p>
    </Modal>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #c8c8c8bf;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 10px;
  z-index: 1001;
  box-shadow: 0px 0px 20px #212121;

  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
`;
