import styled from "styled-components";
import { Link } from "react-router-dom";

export const ChoiceCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1rem;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
  width: 200px;
`;

export const CardTitle = styled.h3`
  margin-bottom: 1rem;
`;

export const CardButton = styled(Link)`
  padding: 0.5rem 1rem;
  background: black;
  color: white;
  text-align: center;
  border-radius: 15px;
  text-decoration: none;
`;




