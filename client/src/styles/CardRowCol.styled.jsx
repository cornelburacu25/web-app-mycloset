import React from "react";
import styled from "styled-components";

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(21rem, 1fr));
  grid-gap: 20px;
  justify-items: center;
  @media (max-width: 400px) {
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  }
`;