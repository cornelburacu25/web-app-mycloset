import styled from "styled-components"
import { CButton, CFormInput } from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ErrorMessage = styled.span`
  color: red;
  font-size: 0.9rem;
  display: block;
`;

export const FormContainer = styled.div`
padding: 25px; 
@media (max-width: 640px){
  padding: 0px;
}
` 

export const Button = styled(CButton)`
margin-top: 5px;
margin-bottom: 10px;
background: black;
cursor: pointer;
padding: 0.5rem 1rem;
border-radius: 30px;
color: white;
transition: 0.2s;
&:hover {
  color: white;
`

export const InputField = styled.input`
margin-bottom: 5px;
width: 170px;
height: 21.33px;
padding: 1px 2px;
border: 2px solid ${props => props.hasError ? 'red' : 'lightgray'};
border-radius: 5px;
outline: none;
transition: border-color 0.3s ease;

&:focus {
  border-color: ${props => props.hasError ? 'red' : 'navy'};
}
`;

export const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
padding: 2px;
`;

export const WelcomeMessage = styled.div`
margin-right: 50px;
margin-bottom: 50px;
@media (max-width: 640px){
  display: none;
}
`