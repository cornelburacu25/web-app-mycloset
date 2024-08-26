import styled from "styled-components"
import { CButton, CFormInput, CForm, CFormLabel } from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";

export const EditProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: 30px;
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;


export const StyledForm = styled(CForm)`
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    background: white;
    border-radius: 5px;
`;

export const ErrorMessage = styled.span`
    color: red;
    font-size: 0.9rem;
    display: block;
`;

export const Heading = styled.h2`
    text-align: left;
    margin-bottom: 20px;
`;

export const FormContainer = styled.div`
    width: 100%;
    padding-right: 20px;
    display: flex;
    justify-content: center;
`;

export const Label = styled(CFormLabel)`
    text-align: left;
    margin-bottom: 5px;
    display: block;
`;

export const FormGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* Two columns */
    grid-column-gap: 40px; /* Add more gap between columns */
    grid-row-gap: 10px; /* Add some gap between rows */
    
    @media (max-width: 450px) {
        grid-template-columns: 1fr; /* Switch to a single column layout */
    }
`;

export const FormItem = styled.div`
    margin-bottom: 20px;
`;

export const EditButton = styled(CButton)`
    margin-top: 20px;
    background: black;
    padding: 0.5rem 1rem;
    border-radius: 30px;
    cursor: pointer;
    color: white;
    transition: 0.2s;
    &:hover {
        color: white;
    }
`;

export const StyledDeleteButton = styled(Button)`
  margin-top: 21px;
  border-radius: 15px;
  color: white;
  transition: 0.2s;
  text-decoration: none;
  font-size: small;

  &:hover {
    color: white;
  }
`;

export const InputField = styled(CFormInput)`
    margin-bottom: 5px;
    width: 100%;
    height: 35px;
    padding: 1px 2px;
    border: 2px solid ${props => props.hasError ? 'red' : 'lightgray'};
    border-radius: 5px;
    outline: none;
    transition: border-color 0.3s ease;

    &:focus {
        border-color: ${props => props.hasError ? 'red' : 'navy'};
    }
`;

export const SelectField = styled.select`
    margin-bottom: 5px;
    width: 100%;
    height: 35px;
    padding: 1px 2px;
    border: 2px solid ${props => props.hasError ? 'red' : 'lightgray'};
    border-radius: 5px;
    outline: none;
    transition: border-color 0.3s ease;
`;

export const PasswordField = styled(CFormInput)`
    margin-bottom: 5px;
    width: 100%; /* Reduce width */
    height: 35px;
    padding: 1px 2px;
    padding-right: 30px; /* Space for icon */
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
    left: 210px; /* Adjusted positioning */
    transform: translateY(-200%);
    cursor: pointer;
`;

export const PasswordFormItem = styled.div`
    margin-bottom: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

export const ButtonContainer = styled.div`
display: flex;
justify-content: space-evenly;
`;