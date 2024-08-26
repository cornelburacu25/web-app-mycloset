import React from "react";
import styled from "styled-components";
import { CCard, CCardImage, CCardBody, CCardTitle, CCardText, CButton, CListGroupItem, CListGroup } from '@coreui/react'
import { Button } from 'antd'

export const StyledCard = styled(CCard)`
  border: 2px solid #ccc; /* Add border style */
  width: 17rem; /* Default width */
  padding: 2px;
  height: 440px;
  overflow: hidden;

  @media(max-width: 350px){
    width: 100%;
    width: 13rem;
    height: 385px;
  }
`;

export const StyledImage = styled(CCardImage)`
  width: 100%;
  height: 296px;

  @media(max-width: 350px){
    height: 228px;
  }
`;

export const StyledListGroup = styled(CListGroup)`
  list-style-type: none;
  padding-inline-start: 0;
  margin: 0;
`;

export const StyledListGroupItem = styled(CListGroupItem)`
  text-align: left;
  font-size: smaller;
`;

export const StyledCardText = styled(CCardText)`
  font-size: small;
  text-align: left;
  margin-block-end: 12px;
  height: 58px;
  @media(max-width: 350px) {
    height: 77.33px;
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

export const StyledButton = styled(CButton)`
  margin-top: 10px;
  background: black;
  padding: 0.3rem 0.6rem;
  border-radius: 15px;
  width: 50%;
  color: white;
  transition: 0.2s;
  text-decoration: none;
  font-size: small;


  &:hover {
    color: white;
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

export const StyledDeleteButton = styled(Button)`
  margin-top: 10px;
  padding: 0.3rem 0.6rem;
  border-radius: 15px;
  width: 60%;
  color: white;
  transition: 0.2s;
  text-decoration: none;
  font-size: small;

  &:hover {
    color: white;
  }
`;

export const LastWornAt = styled(CCardText)`
font-size: small;
margin-block-end: 0px;
margin-block-start: 5px; 
border-top: ridge;
text-align: center;
color: slategray;
`