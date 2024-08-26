import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormContainer, PasswordFormItem, Heading, StyledForm, Label, PasswordField, PasswordIcon, ErrorMessage, EditButton } from '../styles/ResetPassword.styled';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmNewPassword: false
  });

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmNewPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const validateResetForm = () => {
    let valid = true;
    const errors = {};

    if (formData.newPassword.trim() === '') {
      errors.newPassword = 'New Password is required';
      valid = false;
    } else if (!/\d/.test(formData.newPassword)) {
      errors.newPassword = 'New Password must contain at least one number';
      valid = false;
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.newPassword)) {
      errors.newPassword = 'New Password must contain at least one special character';
      valid = false;
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      errors.newPassword = 'New Password must contain at least one uppercase character';
      valid = false;
    } else if (!/[a-z]/.test(formData.newPassword)) {
      errors.newPassword = 'New Password must contain at least one lowercase letter';
      valid = false;
    }

    if (formData.confirmNewPassword.trim() === '') {
      errors.confirmNewPassword = 'Confirm Password is required';
      valid = false;
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      errors.confirmNewPassword = "The passwords should match.";
      valid = false;
    }

    setFormErrors(errors);

    return valid;
  };

  const handleInputChange = async (event) => {
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

    if (!validateResetForm()) {
      toast.error('Failed to update password');
      return;
    }

    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    try {
      await axios.post(`http://localhost:9000/mycloset/change-password?token=${token}`, {
        newPassword: formData.newPassword
      });

      toast.success('Password updated successfully!', {
        onClose: () => navigate('/login') 
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
      <ToastContainer autoClose={2000} />
      <StyledForm onSubmit={handleSubmit}>
        <Heading>Reset Password</Heading>
        <PasswordFormItem>
          <Label>New Password</Label>
          <div style={{ position: 'relative' }}>
            <PasswordField 
              type={showPassword.newPassword ? 'text' : 'password'} 
              name="newPassword" 
              onChange={handleInputChange} 
              hasError={!!formErrors.newPassword} 
            />
            <PasswordIcon 
              icon={showPassword.newPassword ? faEyeSlash : faEye} 
              onClick={() => togglePasswordVisibility('newPassword')} 
            />
          </div>
          {formErrors.newPassword && <ErrorMessage>{formErrors.newPassword}</ErrorMessage>}
        </PasswordFormItem>
        <PasswordFormItem>
          <Label>Confirm New Password</Label>
          <div style={{ position: 'relative' }}>
            <PasswordField 
              type={showPassword.confirmNewPassword ? 'text' : 'password'} 
              name="confirmNewPassword" 
              onChange={handleInputChange} 
              hasError={!!formErrors.confirmNewPassword} 
            />
            <PasswordIcon 
              icon={showPassword.confirmNewPassword ? faEyeSlash : faEye} 
              onClick={() => togglePasswordVisibility('confirmNewPassword')} 
            />
          </div>
          {formErrors.confirmNewPassword && <ErrorMessage>{formErrors.confirmNewPassword}</ErrorMessage>}
        </PasswordFormItem>
        <PasswordFormItem>
          <EditButton type="submit">Reset Password</EditButton>
        </PasswordFormItem>
      </StyledForm>
    </FormContainer>
  );
};

export default ResetPassword;
