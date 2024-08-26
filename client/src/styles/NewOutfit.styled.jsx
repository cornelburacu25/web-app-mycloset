import styled from 'styled-components';
import { CButton } from '@coreui/react';

export const ErrorMessage = styled.span`
  color: red;
  font-size: 0.9rem;
  display: block;
`;

export const GridContainer = styled.div`
display: grid;
grid-template-columns: 1.5fr 1fr 2fr; /* Three equal-width columns */
gap: 0px; /* Gap between grid items */
margin: 0 auto; /* Center align horizontally */
justify-content: center; /* Center content horizontally */
width: 100%;
padding-right: 20px;

@media (max-width: 750px) {
  /* Switch to one column layout with two rows */
  grid-template-columns: 100%;
  grid-auto-rows: auto;
}
`
export const ImageContainer = styled.div`
`

export const FormContainer = styled.div`
` 

export const Button = styled(CButton)`
margin-top: 10px;
background: black;
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

export const TextAreaField = styled.textarea`
  margin-bottom: 5px;
  width: 170px;
  height: 80px;
  padding: 4px;
  border: 2px solid ${props => props.hasError ? 'red' : 'lightgray'};
  border-radius: 5px;
  outline: none;
  resize: none; /* Prevent resizing */
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: ${props => props.hasError ? 'red' : 'navy'};
  }
`;

export const SelectField = styled.select`
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

export const CanvasContainer = styled.div`
  width: 100%;
  max-width: 300px; /* Set maximum width for the canvas container */
  height: 100%;
  max-height: 350px; /* Set maximum height for the canvas container */
  position: relative;
  border: 1px solid black;
  @media (max-width: 750px) {
    left: 180px;
  }
  @media (max-width: 700px) {
    left: 150px;
  }
  @media (max-width: 500px) {
    left: 60px;
  }
  
`;