import React, { useState, useEffect } from 'react';
import { CFormLabel } from '@coreui/react';
import { FormContainer, EditButton, PasswordFormItem, Heading, StyledForm, Label, PasswordField, PasswordIcon, ErrorMessage } from "../styles/EditProfile.styled";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';


const ChangePassword = () => {
    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        newPassword: false,
        confirmNewPassword: false
    });

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [formErrors, setFormErrors] = useState({});
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = Cookies.get("token");
                const decodedToken = jwtDecode(token);
                const user_id = decodedToken.id;
                setUserId(user_id);

                const response = await axios.get(`http://localhost:9000/mycloset/users/${user_id}`);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserData();
    }, []);

    const validateLoginForm = async () => {
        let valid = true;
        const errors = {};

        if (formData.currentPassword.trim() === '') {
            errors.password = 'Current Password is required';
            valid = false;
        } else {
            const response = await axios.post('http://localhost:9000/mycloset/checkpassword', {
                userId,
                password: formData.currentPassword
            });
            if (!response.data.valid) {
                errors.currentPassword = 'Current Password is incorrect';
                valid = false;
            }
        }

        if (formData.newPassword.trim() === '') {
            errors.password = 'New Password is required';
            valid = false;
        } else {
            const response = await axios.post('http://localhost:9000/mycloset/checkpassworduniqueness', {
                userId,
                newPassword: formData.newPassword
            });
            if (!response.data.unique) {
                errors.newPassword = 'New Password must be different from the current password';
                valid = false;
            }
        }

        if (formData.confirmNewPassword.trim() === '') {
            errors.password = 'Confirm New Password is required';
            valid = false;
        }  else if (formData.newPassword !== formData.confirmNewPassword) {
            errors.confirmNewPassword = "The passwords should match.";
            valid = false;
        }

        setFormErrors(errors);
    
        return valid;
    };

    const handleInputChangeLogin = async (event) => {
        const { name, value } = event.target;
        let errorMessage = '';
      
        switch (name) {
            case 'currentPassword':
                if (value.trim() === '') {
                    errorMessage = 'Current Password is required';
                } 
                break;
            case 'newPassword':
                if (value.trim() === '') {
                    errorMessage = 'New Password is required';
                } else if (value.length < 8) {
                    errorMessage = 'Password must be at least 8 characters long';
                } else if (value.length > 32) {
                    errorMessage = 'Password must be no more than 32 characters long';
                } else if (!/\d/.test(value)) {
                    errorMessage = 'New Password must contain at least one number';
                } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
                    errorMessage = 'New Password must contain at least one special character';
                } else if (!/[A-Z]/.test(value)) {
                    errorMessage = 'New Password must contain at least one uppercase character';
                } else if (!/[a-z]/.test(value)) {
                    errorMessage = 'New Password must contain at least one lowercase letter';
                }
                break;
            case 'confirmNewPassword':
                if (value.trim() === '') {
                    errorMessage = 'Confirm Password is required';
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

        const isValid = await validateLoginForm();

        if (!isValid) {
            toast.error('Failed to update password');
            return;
        }

        try {
            await axios.patch(`http://localhost:9000/mycloset/users/${userId}/password`, {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            toast.success('Password updated successfully!', {
                onClose: () => navigate(0) // Refresh the page
            });
            
        } catch (error) {
            toast.error('Failed to update password');
            console.error(error);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prevState => ({
            ...prevState,
            [field]: !prevState[field]
        }));
    };

    return (
        <FormContainer>
            <ToastContainer autoClose={2000}/>
            <StyledForm onSubmit={handleSubmit}>
                <Heading>Change Password</Heading>
                <PasswordFormItem>
                    <Label>Current Password</Label>
                    <div style={{ position: 'relative' }}>
                        <PasswordField type={showPassword.currentPassword ? 'text' : 'password'} name="currentPassword" onChange={handleInputChangeLogin}/>
                        <PasswordIcon icon={showPassword.currentPassword ? faEyeSlash : faEye} onClick={() => togglePasswordVisibility('currentPassword')} />
                    </div>
                    {formErrors.currentPassword && <ErrorMessage>{formErrors.currentPassword}</ErrorMessage>}
                </PasswordFormItem>
                <PasswordFormItem>
                    <Label>New Password</Label>
                    <div style={{ position: 'relative' }}>
                        <PasswordField type={showPassword.newPassword ? 'text' : 'password'} name="newPassword" onChange={handleInputChangeLogin} />
                        <PasswordIcon icon={showPassword.newPassword ? faEyeSlash : faEye} onClick={() => togglePasswordVisibility('newPassword')} />
                    </div>
                    {formErrors.newPassword && <ErrorMessage>{formErrors.newPassword}</ErrorMessage>}
                </PasswordFormItem>
                <PasswordFormItem>
                    <Label>Confirm New Password</Label>
                    <div style={{ position: 'relative' }}>
                        <PasswordField type={showPassword.confirmNewPassword ? 'text' : 'password'} name="confirmNewPassword" onChange={handleInputChangeLogin} />
                        <PasswordIcon icon={showPassword.confirmNewPassword ? faEyeSlash : faEye} onClick={() => togglePasswordVisibility('confirmNewPassword')} />
                    </div>
                    {formErrors.confirmNewPassword && <ErrorMessage>{formErrors.confirmNewPassword}</ErrorMessage>}
                </PasswordFormItem>
                <PasswordFormItem>
                    <EditButton type="submit">Change Password</EditButton>
                </PasswordFormItem>
            </StyledForm>
        </FormContainer>
    );
};

export default ChangePassword;
