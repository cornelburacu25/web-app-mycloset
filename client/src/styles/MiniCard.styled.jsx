import React from "react";
import styled from "styled-components";
import { CCard, CCardImage, CCardBody, CCardTitle, CCardText, CButton, CListGroupItem, CListGroup } from '@coreui/react'
import { Button } from 'antd'

export const StyledCard = styled(CCard)`
  border: 2px solid #ccc; /* Add border style */
  width: 90px; /* Default width */
  padding: 2px;
  height: 110px;

`;

export const StyledImage = styled(CCardImage)`
  width: 100%;
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
  height: 2px;
`;

export const StyledCardTitle = styled(CCardTitle)`
  font-size: 6px;
  margin-block-start: 0;
  margin-block-end: 0;
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