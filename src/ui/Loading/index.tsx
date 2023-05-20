'use client';

import { keyframes, styled } from 'styled-components';

export const Loading = () => {
  return (
    <LoadingContainer>
      <LoadingBlob1 />
      <LoadingBlob2 />
      <LoadingBlob3 />
      <LoadingBlob4 />
    </LoadingContainer>
  );
};

const LoadingContainer = styled.div`
  display: inline-block;
  position: relative;
  width: ${3 * 11 + 2 * 9}px;
  height: 11px;
`;

const LoadingBlob = styled.div`
  position: absolute;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background-color: #555555;

  animation-timing-function: ease !important;
`;

const KeyframesBlob1 = keyframes`
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
`;

const LoadingBlob1 = styled(LoadingBlob)`
  left: 0;
  animation: ${KeyframesBlob1} 0.6s infinite;
`;

const KeyframesBlob2 = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(19px);
  }
`;

const LoadingBlob2 = styled(LoadingBlob)`
  left: 0;
  animation: ${KeyframesBlob2} 0.6s infinite;
`;

const KeyframesBlob3 = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(19px);
  }
`;

const LoadingBlob3 = styled(LoadingBlob)`
  left: 20px;
  animation: ${KeyframesBlob3} 0.6s infinite;
`;

const KeyframesBlob4 = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0);
  }
`;

const LoadingBlob4 = styled(LoadingBlob)`
  left: 40px;
  animation: ${KeyframesBlob4} 0.6s infinite;
`;
