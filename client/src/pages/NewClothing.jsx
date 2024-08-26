import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FormContainer, Button, ErrorMessage, GridContainer, ImageContainer, 
  StyledImage, InputField, TextAreaField, SelectField, ColorPicker, FilterButton, ColorDropdown, ColorBox } from "../styles/ClothingForm.styled";
import { CForm, CRow, CFormLabel, CCol } from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const NewClothing = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [link, setLink] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FFFFFF'); // Default to white
  const navigate = useNavigate();
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [formData, setFormData] = useState({
    link,
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
    if (processedImage) {
      getClassification('http://127.0.0.1:8000/classify/', 'category');
      getClassification('http://127.0.0.1:8000/classify-color/', 'color');
    }
  }, [processedImage]);

  useEffect(() => {
    // Log the link whenever it changes
    console.log("Link updated:", link);
  }, [link]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check the file type
      if (!['image/jpeg', 'image/png', 'image/bmp', 'image/bmp'].includes(file.type)) {
        // Display an error message if the file type is not supported
        toast.error('Only JPEG, PNG, JPG and BMP formats are supported.');
        return;
      }

      // Proceed with processing the image if it's of a supported format
      setSelectedImage(file);
      processImage(file);
    }
  };

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
      case 'category':
          if (value === 'Choose...') {
            errorMessage = 'Please select a category';
            valid = false;
          }
          else {
            errorMessage = ''; // Clear the error message if a valid material is chosen
          }
          break;
      case 'description':
        if (value.length > 100) {
          errorMessage = 'Description cannot exceed 100 characters';
          valid = false;
        }
        break;
      case 'material':
        if (value === 'Choose...') {
          errorMessage = 'Please select a material';
          valid = false;
        }
        else {
          errorMessage = ''; // Clear the error message if a valid material is chosen
        }
        break;
        case 'price':
          if (value !== null && !(!value.trim() || value.trim().match(/^\d{1,8}(\.\d{1,2})?$/))) {
            errorMessage = 'Invalid price';  
            valid = false;
          }
          break;
        case 'size':
        if (value !== null && value.trim() !== '') {
          const lowerValue = value.trim().toLowerCase();
          if (!(['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'].includes(lowerValue) || (!isNaN(parseInt(lowerValue)) && parseInt(lowerValue) >= 20 && parseInt(lowerValue) <= 60))) {
            errorMessage = 'Invalid size or invalid shoe size';
            valid = false;
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

  const processImage = (image) => {
    const _formData = new FormData();
    _formData.append('image_file', image);
    setProcessing(true);

    axios.post('http://127.0.0.1:8000/remove_background/', _formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'arraybuffer'
    })
      .then(removeBackgroundResponse => {
        const processedImageBlob = new Blob([removeBackgroundResponse.data], { type: 'image/png' });

        // Upload the processed image to the server
        const uploadFormData = new FormData();
        uploadFormData.append('image', processedImageBlob);

        axios.post('http://localhost:9000/mycloset/upload', uploadFormData)
          .then(uploadResponse => {
            console.log("Processed image uploaded successfully:", uploadResponse.data);
            // Extract the link value from the upload response
            let link = uploadResponse.data.link; // Assuming the response contains a 'link' property
            // Now you can use the 'link' value as needed
            // Set the link state variable
            setLink(link);
            // Set the processedImage state with the URL of the processed image
            setProcessedImage(URL.createObjectURL(processedImageBlob));
          })
          .catch(uploadError => {
            console.error("Error uploading processed image:", uploadError);
            // Optionally, you can handle errors here
          });

        setProcessing(false);
      })
      .catch(removeBackgroundError => {
        console.error("Error removing background:", removeBackgroundError);
        setProcessing(false);
      });
  };

  const getClassification = (endpoint, field) => {
    fetch(processedImage)
      .then(response => response.blob())
      .then(blob => {
        const _formData = new FormData();
        _formData.append('image_file', blob);

        axios.post(endpoint, _formData)
          .then(classifyResponse => {
            setFormData(_formData => ({
              ..._formData,
              [field]: classifyResponse.data
            }));
            if (field === 'color') {
              setSelectedColor(classifyResponse.data); // Update color based on the returned color
            }
          })
          .catch(classifyError => {
            console.error("Error classifying image:", classifyError);
          });
      })
      .catch(fetchError => {
        console.error("Error fetching processed image:", fetchError);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return; // Prevent form submission if there are validation errors
    }

    const token = Cookies.get("token");
    const decodedToken = jwtDecode(token);
    const user_id = decodedToken.id;

    const clothingData = {
      link: link,
      title: formData.title,
      category: formData.category,
      description: formData.description,
      color: selectedColor,
      material: formData.material,
      price: formData.price,
      size: formData.size,
      brand_name: formData.brand_name,
      numberOfWears: 0,
      user_id: user_id,
    };

    try {
      axios.post('http://localhost:9000/mycloset/clothings', clothingData);
      toast.success('Clothing added successfully!', {
        onClose: () => navigate("/myclothes") // Navigate after the toast message closes
      });
    } catch (error) {
      console.error("Error adding clothing:", error);
      toast.error('Failed to add clothing. Please try again.');
    }
  };


    const handleColorClick = (hex) => {
      setSelectedColor(hex);
      setColorPickerVisible(false);
    };

   
 
  return (
    <div>
      <ToastContainer autoClose={2000} />
      <GridContainer>
        <ImageContainer>
          {/* Check if image is being processed */}
          {processing ? (
            <p>Processing...</p>
          ) : (
            <>
              {/* Check if processed image is available */}
              {processedImage ? (
                <div>
                  <h3>Processed Image:</h3>
                  <StyledImage src={processedImage} alt="Processed" />
                </div>
              ) : (
                // Check if selected image is available
                selectedImage && (
                  <div>
                    <h3>Selected Image:</h3>
                    <StyledImage src={URL.createObjectURL(selectedImage)} alt="Selected" />
                  </div>
                )
              )}
            </>
          )}

          {/* Input for selecting an image */}
          <input
            type="file"
            name="myImage"
            onChange={handleImageChange}
            accept="image/*"
            style={{ marginTop: '20px' }}
          />
        </ImageContainer>
        <FormContainer>
          <CForm onSubmit={handleSubmit}>
            <h3>Clothing Details</h3>
            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">Title</CFormLabel>
              <CCol sm={10}>
                <InputField type="text" name="title" value={formData.title} onChange={handleInputChange} hasError={!!formErrors.title} />
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
                <TextAreaField id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} style={{ resize: 'vertical', maxHeight: '120px' }} hasError={!!formErrors.description} />
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
                <SelectField className="mb-3" name="material" onChange={handleInputChange} hasError={!!formErrors.material}>
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
                <InputField type="text" name="price" value={formData.price} onChange={handleInputChange} hasError={!!formErrors.price} />
                {formErrors.price && <ErrorMessage>{formErrors.price}</ErrorMessage>}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">Size</CFormLabel>
              <CCol sm={10}>
                <InputField type="text" name="size" value={formData.size} onChange={handleInputChange} hasError={!!formErrors.size} />
                {formErrors.size && <ErrorMessage>{formErrors.size}</ErrorMessage>}
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel className="col-sm-2 col-form-label">Brand</CFormLabel>
              <CCol sm={10}>
                <InputField type="text" name="brand_name" value={formData.brand_name} onChange={handleInputChange} hasError={!!formErrors.brand_name} />
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

export default NewClothing;
