import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import { CFormLabel } from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { FormContainer, InputField, SelectField, Button, ErrorMessage, FormGrid, FormItem, PasswordIcon, StyledForm } from "../styles/Register.styled";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        gender: '',
        country: '',
        city: '',
        phone_number: '',
    });

    const [formErrors, setFormErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        gender: '',
        country: '',
        city: '',
        phone_number: '',
    });

    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false
    });

    const togglePasswordVisibility = (field) => {
        setShowPassword(prevState => ({
            ...prevState,
            [field]: !prevState[field]
        }));
    };

    const checkEmailAvailability = async (email) => {
        try {
            const response = await axios.post('http://localhost:9000/mycloset/checkemail', { email });
            const { available } = response.data;
            console.log(available);
            return available; 
        } catch (error) {
            console.error('Failed to check email availability:', error);
            return false; 
        }
    };

    const checkUsernameAvailability = async (username) => {
        try {
            const response = await axios.post('http://localhost:9000/mycloset/checkusername', { username });
            const { available } = response.data;
            console.log(available);
            return available; 
        } catch (error) {
            console.error('Failed to check username availability:', error);
            return false; 
        }
    };

    const validateLoginForm = () => {
        let valid = true;
        const errors = {};

        if (formData.username.trim() === '') {
            errors.username = 'Username is required';
            valid = false;
        }
    
        if (formData.email.trim() === '') {
            errors.email = 'Email is required';
            valid = false;
        }
    
        if (formData.password.trim() === '') {
            errors.password = 'Password is required';
            valid = false;
        }

        if (formData.confirmPassword.trim() === '') {
            errors.confirmPassword = 'Confirm Password is required';
            valid = false;
        } else if (formData.confirmPassword !== formData.password) {
            errors.confirmPassword = 'Passwords do not match';
            valid = false;
        }

        if (formData.firstName.trim() === '') {
            errors.firstName = 'First name is required';
            valid = false;
        }

        if (formData.lastName.trim() === '') {
            errors.lastName = 'Last name is required';
            valid = false;
        }

        if (formData.gender === '') {
            errors.gender = 'Please select your gender';
            valid = false;
        } 
        

        setFormErrors(errors);
    
        return valid;
    };

    const handleInputChangeLogin = async (event) => {
        const { name, value } = event.target;
        let errorMessage = '';
      
        switch (name) {
            case 'username':
                if (value.trim() === '') {
                    errorMessage = 'Username is required';
                } 
                else {
                    const usernameAvailable = await checkUsernameAvailability(value);
                    if (!usernameAvailable) {
                        errorMessage = 'Username is already taken';
                    }
                }
                break;
            case 'email':
                if (value.trim() === '') {
                    errorMessage = 'Email is required';
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    errorMessage = 'Invalid email format';
                } else {
                    const emailAvailable = await checkEmailAvailability(value);
                    if (!emailAvailable) {
                        errorMessage = 'Email is already taken';
                    }
                }
                break;
            case 'password':
                if (value.trim() === '') {
                    errorMessage = 'Password is required';
                } else if (value.length < 8) {
                    errorMessage = 'Password must be at least 8 characters long';
                } else if (value.length > 32) {
                    errorMessage = 'Password must be no more than 32 characters long';
                } else if (!/\d/.test(value)) {
                    errorMessage = 'Password must contain at least one number';
                } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
                    errorMessage = 'Password must contain at least one special character';
                } else if (!/[A-Z]/.test(value)) {
                    errorMessage = 'Password must contain at least one uppercase character';
                } else if (!/[a-z]/.test(value)) {
                    errorMessage = 'Password must contain at least one lowercase letter';
                }
                break;
            case 'confirmPassword':
                if (value.trim() === '') {
                    errorMessage = 'Confirm Password is required';
                } else if (value !== formData.password) {
                    errorMessage = 'Passwords do not match';
                }
                break;
            case 'firstName':
                if (value.trim() === '') {
                    errorMessage = 'First name is required';
                } 
                break;
            case 'lastName':
                if (value.trim() === '') {
                    errorMessage = 'Last name is required';
                } 
                break;
            case 'gender':
                if (value === 'Choose...') {
                    errorMessage = 'Please select your gender';
                } 
                break;
            case 'city':
                if (value !== null && !(!value.trim() || value.trim().match(/^[a-zA-Z\s]+$/))) {
                    errorMessage = 'Invalid city';
                }   
                break;
            case 'country':
                if (value !== null && !(!value.trim() || value.trim().match(/^[a-zA-Z\s]+$/))) {
                    errorMessage = 'Invalid country';
                }
                break;
            case 'phone_number':
                if (value !== null && !(!value.trim() || /^\d{10}$/.test(value))) {
                    errorMessage = 'Invalid phone number';
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
            toast.error("Register failed!")
            return;
        }

        try {
            const response = await axios.post('http://localhost:9000/mycloset/users/', formData);
            const { token } = response.data;
            Cookies.set('token', token);
            toast.success('Check your email to activate your account!');
             
            setFormData({
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                firstName: '',
                lastName: '',
                gender: '',
                country: '',
                city: '',
                phone_number: '',
            });

            
            setFormErrors({
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                firstName: '',
                lastName: '',
                gender: '',
                country: '',
                city: '',
                phone_number: '',
            });

        } catch (error) {
            toast.error("The registration failed!")
            console.error('Registration failed:', error.response.data);
        }
    };

    useEffect(() => {
        const checkActivationStatus = async () => {
            const token = Cookies.get('token');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const userId = decodedToken.id;

                    const response = await axios.get(`http://localhost:9000/mycloset/users/${userId}`);

                    if (response.data.isActivated) {
                        navigate('/');
                    }
                } catch (error) {
                    console.error('Failed to check activation status:', error);
                }
            }
        };

        checkActivationStatus();
    }, [navigate]);
    
    return (
        <div style={{ display: 'block', justifyContent: 'center', alignItems: 'center', height: '900px', background: '#f0f0f0', paddingTop: '30px' }}>
            <FormContainer>
                <ToastContainer autoClose={2000}/>
                <StyledForm onSubmit={handleSubmit}>
                    <h1>Register</h1>
                    <FormGrid>
                        <FormItem>
                            <CFormLabel>First Name</CFormLabel>
                            <InputField label="Firstname:" value={formData.firstName} onChange={handleInputChangeLogin} name="firstName" error={formErrors.firstName} />
                            {formErrors.firstName && <ErrorMessage>{formErrors.firstName}</ErrorMessage>}
                        </FormItem>
                        <FormItem>
                            <CFormLabel>Last Name</CFormLabel>
                            <InputField label="Lastname:" value={formData.lastName} onChange={handleInputChangeLogin} name="lastName" error={formErrors.lastName} />
                            {formErrors.lastName && <ErrorMessage>{formErrors.lastName}</ErrorMessage>}
                        </FormItem>
                        <FormItem>
                            <CFormLabel>Username</CFormLabel>
                            <InputField label="Username:" value={formData.username} onChange={handleInputChangeLogin} name="username" error={formErrors.username} />
                            {formErrors.username && <ErrorMessage>{formErrors.username}</ErrorMessage>}
                        </FormItem>
                        <FormItem>
                            <CFormLabel style={{width: '100%', display:'flex', justifyContent:'center'}}>Email</CFormLabel>
                            <InputField label="Email:" value={formData.email} onChange={handleInputChangeLogin} name="email" error={formErrors.email} />
                            {formErrors.email && <ErrorMessage>{formErrors.email}</ErrorMessage>}
                        </FormItem>
                        <FormItem>
                            <CFormLabel style={{width: '100%', display:'flex', justifyContent:'center'}}>Password</CFormLabel>
                            <div style={{ position: 'relative' }}>
                                <InputField label="Password:" type={showPassword.password ? 'text' : 'password'} value={formData.password} onChange={handleInputChangeLogin} name="password" error={formErrors.password} />
                                <PasswordIcon icon={showPassword.password ? faEyeSlash : faEye} onClick={() => togglePasswordVisibility('password')}  />
                            </div>
                            {formErrors.password && <ErrorMessage>{formErrors.password}</ErrorMessage>}
                        </FormItem>
                        <FormItem>
                            <CFormLabel style={{width: '100%', display:'flex', justifyContent:'center'}}>Confirm Password</CFormLabel>
                            <div style={{ position: 'relative' }}>
                                <InputField label="Confirm Password:" type={showPassword.confirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleInputChangeLogin} name="confirmPassword" error={formErrors.confirmPassword} />
                                <PasswordIcon icon={showPassword.confirmPassword ? faEyeSlash : faEye} onClick={() => togglePasswordVisibility('confirmPassword')}  />
                            </div>
                            {formErrors.confirmPassword && <ErrorMessage>{formErrors.confirmPassword}</ErrorMessage>}
                        </FormItem>
                        <FormItem>
                            <CFormLabel style={{width: '100%', display:'flex', justifyContent:'center'}}>Gender</CFormLabel>
                            <SelectField className="mb-3" name="gender" onChange={handleInputChangeLogin} hasError={!!formErrors.gender}>
                                <option>Choose...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </SelectField>                        
                            {formErrors.gender && <ErrorMessage>{formErrors.gender}</ErrorMessage>}
                        </FormItem>
                        <FormItem>
                            <CFormLabel style={{width: '100%', display:'flex', justifyContent:'center'}}>Country</CFormLabel>
                            <InputField label="Country:" value={formData.country} onChange={handleInputChangeLogin} name="country" error={formErrors.country} />
                            {formErrors.country && <ErrorMessage>{formErrors.country}</ErrorMessage>}
                        </FormItem>
                        <FormItem>
                            <CFormLabel style={{width: '100%', display:'flex', justifyContent:'center'}}>City</CFormLabel>
                            <InputField label="City:" value={formData.city} onChange={handleInputChangeLogin} name="city" error={formErrors.city} />
                            {formErrors.city && <ErrorMessage>{formErrors.city}</ErrorMessage>}
                        </FormItem>
                        <FormItem>
                            <CFormLabel>Phone Number</CFormLabel>
                            <InputField label="Phone number:" value={formData.phone_number} onChange={handleInputChangeLogin} name="phone_number" error={formErrors.phone_number} />
                            {formErrors.phone_number && <ErrorMessage>{formErrors.phone_number}</ErrorMessage>}
                        </FormItem>
                    </FormGrid>
                    <Button type="submit">Create Account</Button>
                </StyledForm>
            </FormContainer>
        </div>
    );
}

export default Register;
