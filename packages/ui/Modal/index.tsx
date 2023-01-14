import { createPortal } from 'react-dom';
import styled from 'styled-components';

export interface ModalProps {
  onClose?: () => void;
}

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

export const LoadingModal = () => {
  return (
    <>
      {createPortal(<ModalOverlay />, document.body)}
      {createPortal(<ModalContainer>...</ModalContainer>, document.body)}
    </>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(200, 200, 200, 0.75);
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

  text-align: center;
  padding: 20px;
`;
