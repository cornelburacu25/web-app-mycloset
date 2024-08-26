import styled from "styled-components";
import { CButton, CFormInput, CForm, CFormLabel } from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const FormContainer = styled.div`
    width: 100%;
    padding: 20px;
    display: flex;
    justify-content: center;
`;

export const StyledForm = styled(CForm)`
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    background: white;
    border-radius: 5px;
    padding: 20px;
`;

export const ErrorMessage = styled.span`
    color: red;
    font-size: 0.9rem;
    display: block;
`;

export const Heading = styled.h2`
    text-align: center;
    margin-bottom: 20px;
`;

export const Label = styled(CFormLabel)`
    text-align: left;
    margin-bottom: 5px;
    display: block;
`;

export const PasswordField = styled(CFormInput)`
    margin-bottom: 5px;
    width: 100%;
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
    top: 50%;
    transform: translateY(-70%);
    cursor: pointer;
`;

export const PasswordFormItem = styled.div`
    margin-bottom: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
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
