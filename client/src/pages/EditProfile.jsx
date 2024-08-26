import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Popconfirm } from "antd";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { FormContainer, InputField, SelectField, StyledDeleteButton, EditButton, ErrorMessage, 
    StyledForm, FormGrid, FormItem, Heading, Label, Content, EditProfileContainer, ButtonContainer } from "../styles/EditProfile.styled";


const EditProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        gender: '',
        country: '',
        city: '',
        phone_number: '',
    });

    const [currentEmail, setCurrentEmail] = useState('');
    const [currentUsername, setCurrentUsername] = useState('');
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = Cookies.get("token");
                const decodedToken = jwtDecode(token);
                const user_id = decodedToken.id;

                const response = await axios.get(`http://localhost:9000/mycloset/users/${user_id}`);
                setFormData(response.data);
                setCurrentUsername(response.data.username);
                setCurrentEmail(response.data.email);
            } catch (error) {
                toast.error("Failed to fetch user data");
                console.error(error);
            }
        };

        fetchUserData();
    }, []);

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

    const handleInputChangeLogin = async (event) => {
        const { name, value } = event.target;
        let errorMessage = '';
      
        switch (name) {
            case 'username':
                if (value.trim() === '') {
                    errorMessage = 'Username is required';
                } else if (value !== currentUsername) { // Skip validation if the input username matches the current username
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
                } else if (value !== currentEmail) { // Skip validation if the input email matches the current email
                    const emailAvailable = await checkEmailAvailability(value);
                    if (!emailAvailable) {
                        errorMessage = 'Email is already taken';
                    }
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

    const validateForm = () => {
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        try {
            const token = Cookies.get("token");
            const decodedToken = jwtDecode(token);
            const user_id = decodedToken.id;

            await axios.put(`http://localhost:9000/mycloset/users/${user_id}`, formData);
            toast.success('Account updated successfully!');
        } catch (error) {
            toast.error("Failed to update account");
            console.error('Update failed:', error);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const token = Cookies.get("token");
            const decodedToken = jwtDecode(token);
            const user_id = decodedToken.id;

            await axios.delete(`http://localhost:9000/mycloset/users/${user_id}`);
            Cookies.remove("token");
            toast.success('Account deleted successfully!', {
                onClose: () => navigate("/register")
            });
        } catch (error) {
            toast.error("Failed to delete account");
            console.error('Delete failed:', error);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false); // Close the delete modal
    };

    return (
        <EditProfileContainer>
          <Content>
            <FormContainer>
              <ToastContainer autoClose={2000}/>
              <StyledForm onSubmit={handleSubmit}>
                <Heading>Edit Profile</Heading>
                <FormGrid>
                  <FormItem>
                    <Label>First Name</Label>
                    <InputField value={formData.firstName} onChange={handleInputChangeLogin} name="firstName" hasError={formErrors.firstName} />
                    {formErrors.firstName && <ErrorMessage>{formErrors.firstName}</ErrorMessage>}
                  </FormItem>
                  <FormItem>
                    <Label>Last Name</Label>
                    <InputField value={formData.lastName} onChange={handleInputChangeLogin} name="lastName" hasError={formErrors.lastName} />
                    {formErrors.lastName && <ErrorMessage>{formErrors.lastName}</ErrorMessage>}
                  </FormItem>
                  <FormItem>
                    <Label>Username</Label>
                    <InputField value={formData.username} onChange={handleInputChangeLogin} name="username" hasError={formErrors.username} />
                    {formErrors.username && <ErrorMessage>{formErrors.username}</ErrorMessage>}
                  </FormItem>
                  <FormItem>
                    <Label>Email</Label>
                    <InputField value={formData.email} onChange={handleInputChangeLogin} name="email" hasError={formErrors.email} />
                    {formErrors.email && <ErrorMessage>{formErrors.email}</ErrorMessage>}
                  </FormItem>
                  <FormItem>
                    <Label>Gender</Label>
                    <SelectField name="gender" value={formData.gender} onChange={handleInputChangeLogin} hasError={!!formErrors.gender}>
                      <option>Choose...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </SelectField>
                    {formErrors.gender && <ErrorMessage>{formErrors.gender}</ErrorMessage>}
                  </FormItem>
                  <FormItem>
                    <Label>Country</Label>
                    <InputField value={formData.country} onChange={handleInputChangeLogin} name="country" hasError={formErrors.country} />
                    {formErrors.country && <ErrorMessage>{formErrors.country}</ErrorMessage>}
                  </FormItem>
                  <FormItem>
                    <Label>City</Label>
                    <InputField value={formData.city} onChange={handleInputChangeLogin} name="city" hasError={formErrors.city} />
                    {formErrors.city && <ErrorMessage>{formErrors.city}</ErrorMessage>}
                  </FormItem>
                  <FormItem>
                    <Label>Phone Number</Label>
                    <InputField value={formData.phone_number} onChange={handleInputChangeLogin} name="phone_number" hasError={formErrors.phone_number} />
                    {formErrors.phone_number && <ErrorMessage>{formErrors.phone_number}</ErrorMessage>}
                  </FormItem>
                </FormGrid>
                <ButtonContainer>
                    <EditButton type="submit">Update</EditButton>
                    <Popconfirm
                        title="Delete your account"
                        description="Are you sure to delete your account?"
                        onConfirm={handleDeleteAccount}
                        onCancel={handleDeleteCancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <StyledDeleteButton danger>Delete</StyledDeleteButton>
                    </Popconfirm>
                </ButtonContainer>
              </StyledForm>
            </FormContainer>
          </Content>
        </EditProfileContainer>
      );
};

export default EditProfile;
