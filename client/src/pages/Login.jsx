import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie'
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { CForm,  CRow, CFormLabel, CCol } from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { FormContainer, InputField, Button, ErrorMessage,  StyledFontAwesomeIcon, WelcomeMessage } from "../styles/Login.styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [formErrors, setFormErrors] = useState({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    

    const validateLoginForm = () => {
        let valid = true;
        const errors = {};
    
        if (formData.email.trim() === '') {
            errors.email = 'Email is required';
            valid = false;
        }
    
        if (formData.password.trim() === '') {
            errors.password = 'Password is required';
            valid = false;
        }

        setFormErrors(errors);
    
        return valid;
    };

    const handleInputChangeLogin = (event) => {
        const { name, value } = event.target;
        let errorMessage = '';
      
        switch (name) {
            case 'email':
                if (value.trim() === '') {
                    errorMessage = 'Email is required';
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    errorMessage = 'Invalid email format';
                }
                break;
            case 'password':
                if (value.trim() === '') {
                    errorMessage = 'Password is required';
                } 
                break;
            default:
                break;
        }
      
        setFormData({
          ...formData,
          [name]: value
        });
      
        setFormErrors({
          ...formErrors,
          [name]: errorMessage
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const isValid = validateLoginForm();

        if (!isValid) {
            toast.error("Login failed!")
            return;
        }

        try {
            const response = await axios.post('http://localhost:9000/mycloset/login', formData);
            const { token } = response.data;
            Cookies.set('token', token);
            toast.success('You have successfully logged in!', {
                onClose: () => navigate("/") // Navigate after the toast message closes
              });
        } catch (error) {
            toast.error("The account doesn't exist!")
            console.error('Login failed:', error.response.data);
            // Handle login error, e.g., display an error message to the user
        }
    };

    const handleRegisterButtonClick = () => {
        navigate("/register");
    };
    
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f0f0' }}>
    <WelcomeMessage>
        <h1>Welcome Back To MyCloset!</h1>
        <p>Please login to continue.</p>
    </WelcomeMessage>
        <FormContainer >
            <ToastContainer autoClose={2000}/>
            <CForm onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #ccc',width: '260px', margin: '0 auto', justifyContent: 'center', background: 'white', borderRadius:'5px'}}>
                <h1>Login</h1>
                <div className="form-group row">
                    <CFormLabel className="col-sm-2 col-form-label">Email</CFormLabel>
                    <div className="col-sm-10">
                        <InputField label="Email:" value={formData.email} onChange={handleInputChangeLogin} name="email" error={formErrors.email} />
                        {formErrors.email && <ErrorMessage>{formErrors.email}</ErrorMessage>}
                    </div>
                </div>
                <div className="form-group row">
                    <CFormLabel className="col-sm-2 col-form-label">Password</CFormLabel>
                    <div className="col-sm-10" style={{ position: 'relative' }}>
                        <InputField label="Password:" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleInputChangeLogin} name="password" error={formErrors.password} />
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} onClick={togglePasswordVisibility} style={{ position: 'absolute', top: '40%', right: '5px', transform: 'translateY(-50%)', cursor: 'pointer' }} />
                    </div>
                    {formErrors.password && <ErrorMessage>{formErrors.password}</ErrorMessage>}
                </div>
            <Button type="submit">Login</Button>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <a href="/forgot-password">Forgot Password?</a>
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <Button onClick={handleRegisterButtonClick}>Register</Button>
            </div>
            </CForm>
           
        </FormContainer>
        </div>
    );
}

export default Login;
