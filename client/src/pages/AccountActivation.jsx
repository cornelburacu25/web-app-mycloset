import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Title, Message } from '../styles/AccountActivation.styled';

const AccountActivation = () => {
    const [activationStatus, setActivationStatus] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
  
    useEffect(() => {
      const activateAccount = async () => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        console.log('token', token);
  
        if (!token) {
          setActivationStatus('Invalid activation token.');
          return;
        }
  
        try {
          const response = await axios.get(`http://localhost:9000/mycloset/activate?token=${token}`);
          setActivationStatus(response.data.message);

          // Navigate to root if activation is successful
          if (response.data.message === "Account activated successfully") {
            navigate('/');
          }
        } catch (error) {
          console.error('Error activating account:', error);
          setActivationStatus('Failed to activate account. Please try again.');
        }
      };
  
      activateAccount();
    }, [location, navigate]);
  
    if (!activationStatus) {
      return <Container>Activating your account...</Container>;
    }
  
    return (
      <Container>
        <Title>Account Activation</Title>
        <Message>{activationStatus}</Message>
      </Container>
    );
};

export default AccountActivation;
