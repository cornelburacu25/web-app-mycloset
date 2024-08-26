import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import OutfitCanvasPicker from '../components/OutfitCanvasPicker';
import { Container, Content, ButtonWrapper, LikeButton, DislikeButton, CanvasWrapper } from '../styles/OutfitGenerator.styled';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';

const OutfitGenerator = () => {
  const navigate = useNavigate();
  const [selectedClothings, setSelectedClothings] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filters, setFilters] = useState(null);
  const [weatherFilters, setWeatherFilters] = useState(null);
  const canvasRef = useRef(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const checkDuplicateOutfit = async (clothingIds) => {
    try {
      const response = await axios.post('http://localhost:9000/mycloset/outfits/check-duplicate', { clothingIds });
      return response.data.isDuplicate;
    } catch (error) {
      console.error('Error checking duplicate outfit:', error);
      return false;
    }
  };

  const handleGenerate = async () => {
    if (!filters && !weatherFilters) return;

    const token = Cookies.get("token");
    const decodedToken = jwtDecode(token);
    const user_id = decodedToken.id;

    try {
      const params = new URLSearchParams();
      const activeFilters = weatherFilters || filters;
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(`${key}[]`, v));
        } else if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([subKey, subValue]) => {
            params.append(`${key}[${subKey}]`, subValue);
          });
        } else {
          params.append(key, value);
        }
      });

      console.log('Request Params:', params.toString());

      const endpoint = weatherFilters
        ? `http://localhost:9000/mycloset/filter-clothings-by-weather/${user_id}`
        : `http://localhost:9000/mycloset/filter-clothings/${user_id}`;

      const response = await axios.get(endpoint, {
        params: params,
      });

      console.log('Response Data:', response.data);

      if (response.data.length === 0) {
        toast.error('No matching outfits found');
      } else {
        const validOutfits = [];
        for (const outfit of response.data) {
          const clothingIds = Object.values(outfit).map(item => item.id);
          const isDuplicate = await checkDuplicateOutfit(clothingIds);
          if (!isDuplicate) {
            validOutfits.push(outfit);
          }
        }

        if (validOutfits.length === 0) {
          toast.error('No matching outfits found');
        } else {
          setSelectedClothings(validOutfits);
          setCurrentIndex(0);
        }
      }
    } catch (error) {
      console.error('Failed to fetch filtered clothings:', error);
      toast.error('No matching outfits found');
    }
  };

  const uploadImage = (imageBlob) => {
    const formData = new FormData();
    formData.append('image', imageBlob);

    return axios.post('http://localhost:9000/mycloset/upload', formData)
      .then(uploadResponse => {
        console.log("Image uploaded successfully:", uploadResponse.data);
        const imageUrl = uploadResponse.data.link;
        return imageUrl;
      })
      .catch(uploadError => {
        console.error("Error uploading image:", uploadError);
        throw uploadError;
      });
  };

  const createOutfitAndHistory = async (isLiked) => {
    const token = Cookies.get("token");
    const decodedToken = jwtDecode(token);
    const user_id = decodedToken.id;

    const canvas = canvasRef.current?.querySelector('canvas');
    if (canvas) {
      canvas.toBlob(async (blob) => {
        try {
          const imageUrl = await uploadImage(blob);

          const outfitData = {
            name: 'Generated Outfit',
            description: `Outfit generated on ${new Date().toLocaleDateString()}`,
            ocassionType: 'casual',
            user_id,
            clothings: Object.values(selectedClothings[currentIndex]),
            link: imageUrl,
            isLiked
          };

          const response = await axios.post('http://localhost:9000/mycloset/outfits', outfitData);

          if (isLiked) {
            await axios.post('http://localhost:9000/mycloset/outfit-histories', {
              outfit_id: response.data.id,
              user_id
            });
          }

        } catch (error) {
          console.error(`Error ${isLiked ? 'liking' : 'disliking'} outfit:`, error);
          toast.error(`Failed to ${isLiked ? 'like' : 'dislike'} outfit. Please try again.`);
        }
      }, 'image/png');
    }
  };

  const handleDislike = async () => {
    if (currentIndex < selectedClothings.length - 1) {
      await createOutfitAndHistory(false);
      setCurrentIndex(currentIndex + 1);
    } else {
      toast.error('No more outfits to show');
    }
  };

  const handleLike = async () => {
    await createOutfitAndHistory(true);
    toast.success('Outfit liked!', {
      onClose: () => navigate("/outfitpicker")
    });
  };

  const handleLocationPermission = async (permission) => {
    setShowLocationModal(false);
    const token = Cookies.get("token");
    const decodedToken = jwtDecode(token);
    const user_id = decodedToken.id;

    if (permission === 'yes') {
      try {
        const geoResponse = await axios.get('http://localhost:9000/mycloset/geolocation');

        const { latitude, longitude } = geoResponse.data;
        const weatherResponse = await axios.get(`http://localhost:9000/mycloset/weather/location`, {
          params: { lat: latitude, lon: longitude }
        });

        const { avgTemperature, weatherCondition } = weatherResponse.data;

        // Use the weather data (avgTemperature and weatherCondition) as needed
        console.log('Weather Data:', { avgTemperature, weatherCondition });

        setWeatherFilters({
          temperature: avgTemperature,
          weatherCondition,
          shouldContainDress: false,
        });
      } catch (error) {
        console.error('Error fetching location-based weather data:', error);
      }
    } else {
      try {
        const userResponse = await axios.get(`http://localhost:9000/mycloset/users/${user_id}`);
        const { city } = userResponse.data;

        const weatherResponse = await axios.get(`http://localhost:9000/mycloset/weather/city`, {
          params: { city }
        });

        const { avgTemperature, weatherCondition } = weatherResponse.data;

        // Use the weather data (avgTemperature and weatherCondition) as needed
        console.log('Weather Data:', { avgTemperature, weatherCondition });

        setWeatherFilters({
          temperature: avgTemperature,
          weatherCondition,
          shouldContainDress: false,
        });
      } catch (error) {
        console.error('Error fetching city-based weather data:', error);
      }
    }
  };

  const triggerModal = () => {
    setShowLocationModal(true);
  };

  return (
    <Container>
      <ToastContainer autoClose={2000} />
      <h1>Choose the outfit you want to wear today!</h1>
      <Content centered={selectedClothings.length === 0}>
        <Sidebar setFilters={setFilters} handleGenerate={handleGenerate} triggerModal={triggerModal} weatherFilters={weatherFilters} setWeatherFilters={setWeatherFilters} />
        <CanvasWrapper ref={canvasRef} visible={selectedClothings.length > 0}>
          {selectedClothings.length > 0 && (
            <OutfitCanvasPicker width={300} height={400} selectedClothings={selectedClothings[currentIndex]} />
          )}
          <ButtonWrapper>
            {selectedClothings.length > 0 && (
              <>
                <LikeButton onClick={handleLike}>
                  <FontAwesomeIcon icon={faThumbsUp} />
                </LikeButton>
                <DislikeButton onClick={handleDislike}>
                  <FontAwesomeIcon icon={faThumbsDown} />
                </DislikeButton>
              </>
            )}
          </ButtonWrapper>
        </CanvasWrapper>
      </Content>
      {showLocationModal && (
        <Modal
          message="Do you allow MyCloset to use your location for making recommendations?"
          onConfirm={() => handleLocationPermission('yes')}
          onCancel={() => handleLocationPermission('no')}
        />
      )}
    </Container>
  );
};
export default OutfitGenerator;
