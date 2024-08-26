import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Sidebar from "../components/Sidebar";
import OutfitStack from "../components/OutfitStack";
import { Container, Content } from "../styles/OutfitGenerator.styled";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Modal from "../components/Modal";

const PickCreatedOutfit = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(null);
  const [weatherFilters, setWeatherFilters] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [outfits, setOutfits] = useState([]);

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
        ? `http://localhost:9000/mycloset/filter-outfits-by-weather/${user_id}`
        : `http://localhost:9000/mycloset/filter-outfits/${user_id}`;

      const response = await axios.get(endpoint, {
        params: params,
      });

      console.log('Response Data:', response.data);

      if (response.data.length === 0) {
        toast.error('No matching outfits found');
      } else {
        setOutfits(response.data);
        setShouldFetch(true);
      }
    } catch (error) {
      console.error('Failed to fetch filtered outfits:', error);
      toast.error('No matching outfits found');
    }
  };

  const handleLike = async (outfitId) => {
    try {
      const token = Cookies.get("token");
      const decodedToken = jwtDecode(token);
      const user_id = decodedToken.id;
  
      // Add to outfit history
      await axios.post('http://localhost:9000/mycloset/outfit-histories', {
        outfit_id: outfitId,
        user_id,
      });
  
      // Update the isLiked status of the outfit
      await axios.patch(`http://localhost:9000/mycloset/outfits/${outfitId}/like`, {
        isLiked: true,
        lastWornAt: new Date(),
      });
  
      toast.success('Outfit liked!', {
        onClose: () => navigate("/outfitpicker")
      });
    } catch (error) {
      console.error('Error liking outfit:', error);
      toast.error('Failed to like outfit. Please try again.');
    }
  };
  const handleDislike = (outfitId) => {
    setOutfits((prevOutfits) => {
      const newOutfits = prevOutfits.filter(outfit => outfit.id !== outfitId);
      if (newOutfits.length === 0) {
        toast.info('No more outfits to show');
      }
      return newOutfits;
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
      <Content>
        <Sidebar 
          setFilters={setFilters} 
          handleGenerate={handleGenerate} 
          triggerModal={triggerModal} 
          weatherFilters={weatherFilters} 
          setWeatherFilters={setWeatherFilters} 
        />
        {shouldFetch && (
          <OutfitStack 
            onLike={handleLike} 
            onDislike={handleDislike} 
            outfits={outfits} 
          />
        )}
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

export default PickCreatedOutfit;
