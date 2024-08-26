import styled from 'styled-components';
import { CButton } from '@coreui/react';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  background: white;
`;

export const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
  text-align: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export const Label = styled.label`
  margin-bottom: 8px;
  font-size: 16px;
  color: #333;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 2px solid ${props => props.hasError ? 'red' : 'lightgray'};
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    border-color: ${props => props.hasError ? 'red' : 'navy'};
  }
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
  }
`;

export const ErrorMessage = styled.span`
  color: red;
  font-size: 0.9rem;
  display: block;
`;
