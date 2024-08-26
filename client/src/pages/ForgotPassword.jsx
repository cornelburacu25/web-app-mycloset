import React, { useState } from 'react';
import axios from 'axios';
import { Container, Title, Form, Label, Input, Button, ErrorMessage } from '../styles/ForgotPassword.styled';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ email: '' });
  const [formErrors, setFormErrors] = useState({ email: '' });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let errorMessage = '';

    if (value.trim() === '') {
      errorMessage = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      errorMessage = 'Invalid email format';
    }

    setFormData({ [name]: value });
    setFormErrors({ [name]: errorMessage });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formErrors.email) {
      toast.error(formErrors.email);
      return;
    }

    try {
      const emailExists = await checkEmailAvailability(formData.email);
      if (!emailExists) {
        toast.error('Email does not exist');
        return;
      }

      await axios.post('http://localhost:9000/mycloset/forgot-password', { email: formData.email });
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      console.error('Failed to send password reset link:', error);
      toast.error('Failed to send password reset link. Please try again.');
    }
  };

  const checkEmailAvailability = async (email) => {
    try {
      const response = await axios.post('http://localhost:9000/mycloset/checkemail', { email });
      const { available } = response.data;
      return !available; // Return true if email exists (available is false)
    } catch (error) {
      console.error('Failed to check email availability:', error);
      return false; 
    }
  };

  return (
    <Container>
      <ToastContainer autoClose={2000} />
      <Title>Enter your email to change your password</Title>
      <Form onSubmit={handleSubmit}>
        <Label>Email</Label>
        <Input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleInputChange} 
          hasError={!!formErrors.email} 
        />
        {formErrors.email && <ErrorMessage>{formErrors.email}</ErrorMessage>}
        <Button type="submit">Send</Button>
      </Form>
    </Container>
  );
};

export default ForgotPassword;
