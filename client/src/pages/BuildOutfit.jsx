import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {jwtDecode} from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { InputField, TextAreaField, SelectField, GridContainer, FormContainer, Button, CanvasContainer, ErrorMessage } from '../styles/NewOutfit.styled';
import { CForm, CRow, CCol, CFormLabel } from '@coreui/react';
import OutfitCanvas from '../components/OutfitCanvas';
import ClothingsPanel from '../components/ClothingsPanel';

const BuildOutfit = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        ocassionType: '',
    });

    const [formErrors, setFormErrors] = useState({
        name: '',
        description: '',
        ocassionType: '',
        clothing: '',
    });

    const [selectedClothings, setSelectedClothings] = useState([]);
    const [link, setLink] = useState('');

    const categoryMapping = {
        hat: ['hat'],
        top: ['longsleeve', 'shirt', 't-shirt'],
        bottom: ['shorts', 'pants', 'skirt'],
        shoes: ['shoes'],
        outwear: ['outwear'],
        dress: ['dress'],
    };

    const checkDuplicateOutfit = async (clothingIds) => {
        try {
            const response = await axios.post('http://localhost:9000/mycloset/outfits/check-duplicate', { clothingIds });
            return response.data.isDuplicate;
        } catch (error) {
            console.error('Error checking duplicate outfit:', error);
            return false;
        }
    };

    const validateClothingSelection = async () => {
        const hasTopBottomShoes = ['top', 'bottom', 'shoes'].every(category =>
            selectedClothings.some(clothing =>
                categoryMapping[category].includes(clothing.category)
            )
        );

        const hasDressShoes = ['dress', 'shoes'].every(category =>
            selectedClothings.some(clothing =>
                categoryMapping[category].includes(clothing.category)
            )
        );

        if (!hasTopBottomShoes && !hasDressShoes) {
            return "You haven't selected enough clothings for an outfit!";
        }

        // Check for duplicate outfit
        const clothingIds = selectedClothings.map(clothing => clothing.id);
        const isDuplicate = await checkDuplicateOutfit(clothingIds);
        if (isDuplicate) {
            return 'The selected outfit is duplicated';
        }

        return '';
    };

    const validateForm = async () => {
        let valid = true;
        const errors = {};

        if (formData.name === '') {
            errors.name = 'Name is required';
            valid = false;
        }

        if (formData.ocassionType === '') {
            errors.ocassionType = 'Please select an ocassion';
            valid = false;
        }

        const clothingError = await validateClothingSelection();
        if (clothingError) {
            errors.clothing = clothingError;
            valid = false;
        }

        setFormErrors(errors);

        return valid;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        // Perform validation based on the field name
        let errorMessage = '';
        switch (name) {
            case 'name':
                if (value.trim() === '') {
                    errorMessage = 'Name is required';
                } else if (value.length > 30) {
                    errorMessage = 'Name cannot exceed 30 characters';
                }
                break;
            case 'description':
                if (value.length > 100) {
                    errorMessage = 'Description cannot exceed 100 characters';
                }
                break;
            case 'ocassionType':
                if (value === 'Choose...') {
                    errorMessage = 'Please select an ocassion';
                } else {
                    errorMessage = ''; // Clear the error message if a valid ocassion is chosen
                }
                break;
            default:
                break;
        }

        // Update form data and errors
        setFormData({
            ...formData,
            [name]: value
        });

        setFormErrors({
            ...formErrors,
            [name]: errorMessage
        });
    };

    const uploadImage = (imageBlob) => {
        const formData = new FormData();
        formData.append('image', imageBlob);

        return axios.post('http://localhost:9000/mycloset/upload', formData)
            .then(uploadResponse => {
                console.log("Image uploaded successfully:", uploadResponse.data);
                // Extract the link value from the upload response
                const imageUrl = uploadResponse.data.link; // Assuming the response contains a 'link' property
                // Set the link state variable
                return imageUrl;
            })
            .catch(uploadError => {
                console.error("Error uploading image:", uploadError);
                throw uploadError; // Rethrow error to be handled in handleSubmit
            });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const isValid = await validateForm();

        if (!isValid) {
            return; // Prevent form submission if there are validation errors
        }

        const token = Cookies.get("token");
        const decodedToken = jwtDecode(token);
        const user_id = decodedToken.id;

        // Capture the canvas and upload the image
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.toBlob(async (blob) => {
                try {
                    const imageUrl = await uploadImage(blob);

                    const outfitData = {
                        ...formData,
                        user_id,
                        clothings: selectedClothings,
                        link: imageUrl,
                        isLiked: true,
                    };

                    const createOutfitResponse = await axios.post('http://localhost:9000/mycloset/outfits', outfitData);
                    const outfitId = createOutfitResponse.data.id;
    
                    // Then, add the outfit to the outfit histories
                    await axios.post('http://localhost:9000/mycloset/outfit-histories', {
                        outfit_id: outfitId,
                        user_id,
                    });

                    toast.success('Outfit added successfully!', {
                        onClose: () => navigate("/outfitpicker") // Navigate after the toast message closes
                    });
                } catch (error) {
                    console.error("Error adding outfit:", error);
                    toast.error('Failed to add outfit. Please try again.');
                }
            }, 'image/png');
        }
    };

    const handleSelectClothing = (clothing) => {
        // Find the category of the selected clothing
        const category = Object.keys(categoryMapping).find(key =>
            categoryMapping[key].includes(clothing.category)
        );

        if (category === 'dress') {
            // If a dress is selected, deselect any selected tops or bottoms
            setSelectedClothings(prevSelected => prevSelected.filter(item =>
                !['top', 'bottom'].includes(Object.keys(categoryMapping).find(key =>
                    categoryMapping[key].includes(item.category)
                ))
            ));
        } else if (['top', 'bottom'].includes(category)) {
            // If a top or bottom is selected, deselect any selected dress
            setSelectedClothings(prevSelected => prevSelected.filter(item =>
                !['dress'].includes(Object.keys(categoryMapping).find(key =>
                    categoryMapping[key].includes(item.category)
                ))
            ));
        }

        // Check if there's already a selected clothing of the same category
        const existingClothingIndex = selectedClothings.findIndex(item =>
            categoryMapping[category].includes(item.category)
        );

        if (existingClothingIndex !== -1) {
            // If a clothing of the same category is already selected, replace it with the new one
            setSelectedClothings(prevSelected => {
                const updatedSelected = [...prevSelected];
                updatedSelected[existingClothingIndex] = clothing;
                return updatedSelected;
            });
        } else {
            // If no clothing of the same category is selected, add the new one
            setSelectedClothings(prevSelected => [...prevSelected, clothing]);
        }
    };

    const containerRef = useRef(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateCanvasSize = () => {
            if (containerRef.current) {
                setCanvasSize({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                });
            }
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        return () => window.removeEventListener('resize', updateCanvasSize);
    }, []);

    return (
        <div>
            <ToastContainer autoClose={2000} />
            <GridContainer>
                <FormContainer>
                    <CForm onSubmit={handleSubmit}>
                        <h3>Outfit details</h3>
                        <CRow className="mb-3">
                            <CFormLabel className="col-sm-2 col-form-label">Name</CFormLabel>
                            <CCol sm={10}>
                                <InputField type="text" name="name" value={formData.name} onChange={handleInputChange} hasError={!!formErrors.name} />
                                {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel className="col-sm-2 col-form-label">Description</CFormLabel>
                            <CCol sm={10}>
                                <TextAreaField id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} style={{ resize: 'vertical', maxHeight: '120px' }} hasError={!!formErrors.description} />
                                {formErrors.description && <ErrorMessage>{formErrors.description}</ErrorMessage>}
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel className="col-sm-2 col-form-label">Ocassion</CFormLabel>
                            <CCol sm={10}>
                                <SelectField className="mb-3" name="ocassionType" onChange={handleInputChange} hasError={!!formErrors.ocassionType}>
                                    <option>Choose...</option>
                                    <option value="formal">Formal</option>
                                    <option value="semi-formal">Semi-Formal</option>
                                    <option value="casual">Casual</option>
                                    <option value="professional">Professional</option>
                                    <option value="outdoor activities">Outdoor Activities</option>
                                    <option value="home">Home</option>
                                    <option value="cultural">Cultural</option>
                                    <option value="recreational">Recreational</option>
                                    <option value="celebratory">Celebratory</option>
                                </SelectField>
                                {formErrors.ocassionType && <ErrorMessage>{formErrors.ocassionType}</ErrorMessage>}
                            </CCol>
                        </CRow>
                        <Button type="submit">Submit</Button>
                    </CForm>
                </FormContainer>
                <CanvasContainer ref={containerRef}>
                    <OutfitCanvas width={canvasSize.width} height={canvasSize.height} selectedClothings={selectedClothings} />
                    {formErrors.clothing && <ErrorMessage>{formErrors.clothing}</ErrorMessage>}
                </CanvasContainer>
                <ClothingsPanel onSelect={handleSelectClothing} setSelectedClothings={setSelectedClothings}/>
            </GridContainer>
        </div>
    );
};

export default BuildOutfit;
