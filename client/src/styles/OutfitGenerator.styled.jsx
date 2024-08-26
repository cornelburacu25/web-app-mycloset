import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

export const CanvasWrapper = styled.div`
  flex-direction: column;
  border: 2px solid #ccc; /* Added border */
  padding: 10px;
  height: 469.33px; 
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
`;

export const Content = styled.div`
  display: flex;
  width: 100%;
  justify-content: ${({ centered }) => (centered ? 'center' : 'space-around')};
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

export const LikeButton = styled.button`
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 15px;
  &:hover {
    background-color: #218838;
  }
`;

export const DislikeButton = styled.button`
  padding: 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  &:hover {
    background-color: #c82333;
  }
`;
