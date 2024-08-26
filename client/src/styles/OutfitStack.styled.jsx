import styled, { keyframes, css } from "styled-components";

export const slideOutLeft = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

export const slideOutRight = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

export const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const slideInLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const StackContainer = styled.div`
  position: relative;
  width: 300px;
  height: 400px;
`;

export const CardWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  animation: ${({ animate }) => {
    switch (animate) {
      case 'out-left':
        return css`${slideOutLeft} 0.5s forwards`;
      case 'out-right':
        return css`${slideOutRight} 0.5s forwards`;
      case 'in-left':
        return css`${slideInLeft} 0.5s forwards`;
      case 'in-right':
        return css`${slideInRight} 0.5s forwards`;
      default:
        return 'none';
    }
  }};
`;