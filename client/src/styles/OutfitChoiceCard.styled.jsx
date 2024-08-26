import styled from 'styled-components';
import { CCard, CCardImage, CCardBody, CCardTitle, CCardText, CButton, CListGroupItem, CListGroup } from '@coreui/react'


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

export const StyledCard = styled(CCard)`
  border: 2px solid #ccc; /* Add border style */
  width: 17rem; /* Default width */
  padding: 2px;
  height: 440px;
  overflow-x: hidden;

  @media(max-width: 350px){
    width: 100%;
    width: 13rem;
    height: 385px;
  }
`;

export const StyledButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two equal-width columns */
  gap: 5px;
  margin-top: 10px;
  margin-bottom: 10px;
  justify-items: center;
  align-items: center;
`;

export const StyledImage = styled(CCardImage)`
  width: 100%;
  height: 296px;

  @media(max-width: 350px){
    height: 228px;
  }
`;

export const StyledCardTitle = styled(CCardTitle)`
  font-size: large;
  margin-block-start: 5px;
  margin-block-end: 5px;
  @media(max-width: 350px) {
    font-size: 14.4px;
  }
`;

