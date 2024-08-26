import styled from "styled-components"
import { CButton, CFormInput, CImage, CFormSelect } from "@coreui/react";

export const ErrorMessage = styled.span`
  color: red;
  font-size: 0.9rem;
  display: block;
`;

export const GridContainer = styled.div`
display: grid;
grid-template-columns: 1fr 1fr; /* Two equal-width columns */
gap: 20px; /* Gap between grid items */
margin: 0 auto; /* Center align horizontally */
justify-content: center; /* Center content horizontally */
width: 100%;

@media (max-width: 525px) {
  /* Switch to one column layout with two rows */
  grid-template-columns: 100%;
  grid-auto-rows: auto;
}
`

export const StyledImage = styled(CImage)`
  // Add your custom styles for the image
  width: 70%;
  height: auto;
  @media (max-width: 315px) {
   
  }
`;

export const ImageContainer = styled.div`
`

export const FormContainer = styled.div`
` 

export const Button = styled(CButton)`
margin-top: 10px;
background: black;
padding: 0.5rem 1rem;
border-radius: 30px;
cursor: pointer;
color: white;
transition: 0.2s;
&:hover {
  color: white;
`

export const Input = styled(CFormInput)`
margin-bottom: 10px;
border-color: ${props => props.hasError ? 'red' : 'darkgray'};
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
  width: 166px;
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
  width: 179px;
  height: 25.33px;
  padding: 1px 2px;
  border: 2px solid ${props => props.hasError ? 'red' : 'lightgray'};
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: ${props => props.hasError ? 'red' : 'navy'};
  }
`;

export const ColorPicker = styled.div`
  position: relative;
  display: inline-block;
`;

export const FilterButton = styled.button`
  background-color: #FFFFFF;
  border: 2px solid lightgray; // Add border
  padding: 1px 2px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  
  width: 179px;
  height: 25.33px;
  align-items: center;
  justify-content: center;
`;

export const ColorDropdown = styled.div`
  display: grid;
  gap: 5px;
  border: 1px solid black;
  position: absolute;
  background-color: white;
  padding: 7px;
  border-radius: 4px;
  z-index: 100;
`;

export const ColorBox = styled.div`
  width: 162px;
  height: 10px;
  cursor: pointer;
  border: 1px solid black;
`;
