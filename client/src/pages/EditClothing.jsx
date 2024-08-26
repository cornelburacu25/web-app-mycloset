import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FormContainer, Button, ErrorMessage, GridContainer, ImageContainer, 
  StyledImage, InputField, TextAreaField, SelectField, 
  ColorPicker, FilterButton, ColorDropdown, ColorBox } from "../styles/ClothingForm.styled";import { CForm, CRow, CFormLabel, CCol } from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function capitalizeEachWord(str) {
  return str.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
  });
}

const EditClothing = () => {
  const { id } = useParams(); // Extract the clothing ID from the URL params
  const navigate = useNavigate();
  const [clothing, setClothing] = useState(null); // State to hold clothing data
  const [selectedColor, setSelectedColor] = useState('#FFFFFF'); // Default to white
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  const [formData, setFormData] = useState({
    link: '',
    title: '',
    category: '',
    description: '',
    material: '',
    price: '',
    size: '',
    brand_name: '',
  });

  const [formErrors, setFormErrors] = useState({
    title: '',
    category: '',
    description: '',
    material: '',
    price: '',
    size: '',
    brand_name: '',
  });

  const colorOptions = {
    blue: 'blue',
    red: 'red',
    yellow: 'yellow',
    green: 'green',
    pink: 'pink',
    purple: 'purple',
    brown: 'brown',
    white: 'white',
    black: 'black',
    cyan: 'cyan',
    orange: 'orange',
    gray: 'gray',
  };


  useEffect(() => {
    // Fetch the clothing data for the specified ID
    const fetchClothing = async () => {
      try {
        const res = await fetch(`http://localhost:9000/mycloset/clothings/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch clothing');
        }
        const data = await res.json();
        setClothing(data);
        setSelectedColor(data.color);
        console.log(data);
      } catch (error) {
        console.error('Error fetching clothing', error);
        setError('Failed to fetch clothing');
      }
    };

    fetchClothing();
  }, [id]);

  useEffect(() => {
    if (clothing) {
      setFormData({
        link: clothing.ClothingImage.url,
        title: clothing.title,
        category: clothing.category,
        description: clothing.description,
        color: clothing.color,
        material: clothing.material,
        price: clothing.price,
        size: clothing.size,
        brand_name: capitalizeEachWord(clothing.Brand.name),
      });
    }
  }, [clothing]);
  

  
  if (!clothing) {
    return <div>Loading...</div>;
  }

  const validateForm = () => {
    let valid = true;
    const errors = {};
  
    if (formData.title.trim() === '') {
      errors.title = 'Title is required';
      valid = false;
    }

    if (formData.category === '') {
      errors.category = 'Please select a category';
      valid = false;
    }

    if (formData.material === '') {
      errors.material = 'Please select a material';
      valid = false;
    }

    if (formData.brand_name.trim() === '') {
      errors.brand_name = 'Brand name is required';
      valid = false;
    }

    if (formData.size !== null && formData.size.trim() !== '') {
      const lowerValue = formData.size.trim().toLowerCase();
      if (!(['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'].includes(lowerValue) || (!isNaN(parseInt(lowerValue)) && parseInt(lowerValue) >= 20 && parseInt(lowerValue) <= 60))) {
        errors.size = 'Invalid size or invalid shoe size';
        valid = false;
      }
    }
    
  
    if (formData.price !== null && !(!formData.price.trim() || formData.price.trim().match(/^\d{1,8}(\.\d{1,2})?$/))) {
      errors.price = 'Invalid price';
      valid = false;
    }

    setFormErrors(errors);

    return valid;
  };

  const handleInputChange = (event) => {
    let valid = true;
    const { name, value } = event.target;
    let errorMessage = '';
  
    // Perform validation based on the field name
    switch (name) {
      case 'title':
        if (value.trim() === '') {
          errorMessage = 'Title is required';
          valid = false;
        }
        if (value.length > 30) {
          errorMessage = 'Title cannot exceed 30 characters';
          valid = false;
        }
        break;
      case 'description':
        if (value.length > 100) {
          errorMessage = 'Description cannot exceed 100 characters';
          valid = false;
        }
        break;
      case 'category':
        if (value === 'Choose...') {
          errorMessage = 'Please select a category';
          valid = false;
        }
        else {
          errorMessage = ''; 
        }
        break;
      case 'material':
        if (value === 'Choose...') {
          errorMessage = 'Please select a material';
          valid = false;
      } 
        else {
          errorMessage = ''; 
        }
        break;
      case 'price':
        if (value !== null && !(!value.trim() || value.trim().match(/^\d{1,8}(\.\d{1,2})?$/))) {
          errorMessage = 'Invalid price';  
          valid = false;
        }
        break;
        case 'size':
          if (value !== null) {
            const lowerValue = value.toLowerCase();
            if (!(['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'].includes(lowerValue) || (!isNaN(parseInt(lowerValue)) && parseInt(lowerValue) >= 20 && parseInt(lowerValue) <= 60))) {
              errorMessage = 'Invalid size or invalid shoe size';
            }
          }
          break;
      case 'brand_name':
        if (value.trim() === '') {
          errorMessage = 'Brand name is required';
          valid = false;
        }
        if (value.length > 50) {
          errorMessage = 'Brand cannot exceed 50 characters';
          valid = false;
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

    return valid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return; // Prevent form submission if there are validation errors
    }

    const clothingData = {
        title: formData.title,
        description: formData.description,
        color: selectedColor,
        category: formData.category,
        material: formData.material,
        price: formData.price,
        size: formData.size,
        brand_name: formData.brand_name,
      };
  
      try {
        axios.put(`http://localhost:9000/mycloset/clothings/${id}`, clothingData);
        toast.success('Clothing updated successfully!', {
          onClose: () => navigate('/myclothes') // Navigate after the toast message closes
        });
      } catch (error) {
        console.error("Error updating clothing:", error);
        toast.error('Failed to update clothing. Please try again.');
      }
    };

    const handleColorClick = (hex) => {
      setSelectedColor(hex);
      setColorPickerVisible(false);
    };


  return (
    <div>
      <ToastContainer autoClose={2000}/>
      <GridContainer>
      <ImageContainer>
        <div>
            <h3>Clothing Image</h3>
            <StyledImage src={ clothing.ClothingImage.url } alt="Selected" />
        </div>
        </ImageContainer>
    <FormContainer>
      <CForm onSubmit={handleSubmit}>
        <h3>Clothing Details</h3>
        <CRow className="mb-3">
          <CFormLabel className="col-sm-2 col-form-label">Title</CFormLabel>
          <CCol sm={10}>
            <InputField type="text" name="title" value={formData.title} onChange={handleInputChange} hasError={!!formErrors.title}/>
            {formErrors.title && <ErrorMessage>{formErrors.title}</ErrorMessage>}
          </CCol>
        </CRow>
        <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">Category</CFormLabel>
              <CCol sm={10}>
              <SelectField className="mb-3" name="category" value={formData.category} onChange={handleInputChange} hasError={!!formErrors.category}>
                  <option>Choose...</option>
                  <option value="hat">Hat</option>
                  <option value="outwear">Outwear</option>
                  <option value="t-shirt">T-shirt</option>
                  <option value="shirt">Shirt</option>
                  <option value="longsleeve">Longsleeve</option>
                  <option value="pants">Pants</option>
                  <option value="shorts">Shorts</option>
                  <option value="skirt">Skirt</option>
                  <option value="dress">Dress</option>
                  <option value="shoes">Shoes</option>
                </SelectField>
                {formErrors.category && <ErrorMessage>{formErrors.category}</ErrorMessage>}
              </CCol>
            </CRow>
        <CRow className="mb-3">
          <CFormLabel className="col-sm-2 col-form-label">Description</CFormLabel>
          <CCol sm={10}>
          <TextAreaField id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} style={{ resize: 'vertical', maxHeight: '120px' }} hasError={!!formErrors.description}/>
          {formErrors.description && <ErrorMessage>{formErrors.description}</ErrorMessage>}
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CFormLabel className="col-sm-2 col-form-label">Color</CFormLabel>
            <CCol sm={10}>
              <ColorPicker>
                <FilterButton type="button"
                    style={{ backgroundColor: selectedColor }}
                    onClick={() => setColorPickerVisible(!colorPickerVisible)}
                />
                {colorPickerVisible && (
                  <ColorDropdown>
                      {Object.entries(colorOptions).map(([name, hex]) => (
                        <ColorBox key={name} style={{ backgroundColor: hex }} onClick={() => handleColorClick(hex)} />
                      ))}
                    </ColorDropdown>
                  )}
            </ColorPicker>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CFormLabel className="col-sm-2 col-form-label">Material</CFormLabel>
          <CCol sm={10}>
          <SelectField className="mb-3" name="material" value={formData.material} onChange={handleInputChange} hasError={!!formErrors.material}>
            <option>Choose...</option>
            <option value="cotton">Cotton</option>
            <option value="polyester">Polyester</option>
            <option value="wool">Wool</option>
            <option value="denim">Denim</option>
            <option value="leather">Leather</option>
            <option value="nylon">Nylon</option>
            <option value="spandex">Spandex</option>
            <option value="silk">Silk</option>
            <option value="linen">Linen</option>
            <option value="viscose">Viscose</option>
            <option value="flannel">Flannel</option>
            <option value="suede">Suede</option>
            <option value="rubber">Rubber</option>
            <option value="satin">Satin</option>
            <option value="cashmere">Cashmere</option>
            <option value="other">Other</option>
          </SelectField>
          {formErrors.material && <ErrorMessage>{formErrors.material}</ErrorMessage>}
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CFormLabel className="col-sm-2 col-form-label">Price</CFormLabel>
          <CCol sm={10}>
            <InputField type="text" name="price" value={formData.price} onChange={handleInputChange} hasError={!!formErrors.price}/>
            {formErrors.price && <ErrorMessage>{formErrors.price}</ErrorMessage>}
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CFormLabel className="col-sm-2 col-form-label">Size</CFormLabel>
          <CCol sm={10}>
            <InputField type="text" name="size" value={formData.size} onChange={handleInputChange} hasError={!!formErrors.size}/>
            {formErrors.size && <ErrorMessage>{formErrors.size}</ErrorMessage>}
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CFormLabel className="col-sm-2 col-form-label">Brand</CFormLabel>
          <CCol sm={10}>
            <InputField type="text" name="brand_name" value={formData.brand_name} onChange={handleInputChange} hasError={!!formErrors.brand_name}/>
            {formErrors.brand_name && <ErrorMessage>{formErrors.brand_name}</ErrorMessage>}
          </CCol>
        </CRow>
        <Button type="submit">Submit</Button>
      </CForm>
    </FormContainer>
    </GridContainer>
  </div>
  );
};

export default EditClothing;
