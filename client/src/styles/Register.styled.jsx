import styled from "styled-components"
import { CButton, CFormInput, CForm } from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const StyledForm = styled(CForm)`
border: 1px solid #ccc;
width: 400px;
margin: 0 auto;
justify-content: center;
background: white;
border-radius: 5px;
@media (max-width: 450px) {
  width: 260px;
}
`

export const ErrorMessage = styled.span`
  color: red;
  font-size: 0.9rem;
  display: block;
`;

export const FormContainer = styled.div`
padding: 0px; /* Add padding for spacing inside the container */
` 

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns */
  grid-column-gap: 20px; /* Add some gap between columns */
  
  @media (max-width: 450px) {
    grid-template-columns: 1fr; /* Switch to a single column layout */
  }
`;

// Define the grid item for each form group
export const FormItem = styled.div`
  margin-bottom: 5px;
`;

export const Button = styled(CButton)`
margin-top: 5px;
margin-bottom: 10px;
background: black;
padding: 0.5rem 1rem;
border-radius: 30px;
cursor: pointer;
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

export const PasswordIcon = styled(FontAwesomeIcon)`
position: absolute;
top: 40%;
right: 8px;
transform: translateY(-50%);
cursor: pointer;
@media (max-width: 450px) {
  top: 100%;
  left: 198px;
  transform: translateY(-170%);
}
`;

export const WelcomeMessage = styled.div`
margin-right: 50px;
margin-bottom: 50px;
@media (max-width: 640px){
  display: none;
}
`

export const SelectField = styled.select`
  margin-bottom: 5px;
  width: 170px;
  height: 21.33px;
  padding: 1px 2px;
  border: 2px solid ${props => props.hasError ? 'red' : 'lightgray'};
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s ease;
  `
  