'use client';

import { StyledAlert } from '#/ui/Alert/client';
import { ButtonGroup } from '#/ui/Button';
import { createPortal } from 'react-dom';
import { styled } from 'styled-components';

export type ModalProps = {
  onClose?: () => void;
};

export const Modal = ({
  onClose,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & ModalProps) => {
  return (
    <>
      {createPortal(<ModalOverlay onClick={onClose} />, document.body)}
      {createPortal(<ModalContainer {...props} />, document.body)}
    </>
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

  & > ${StyledAlert}:first-child, & > ${ButtonGroup}:first-child {
    margin-top: 0;
  }

  & > ${StyledAlert}:last-child, & > ${ButtonGroup}:last-child {
    margin-bottom: 0;
  }
`;
