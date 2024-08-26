import React, { useState, useEffect } from "react"
import { OutfitCard } from "../components/OutfitCard";
import { GridContainer } from "../styles/CardRowCol.styled";
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode';
import FilterBarOutfit from "../components/FilterBarOutfit";

function MyOutfits() {
  
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    fetchOutfits({});
  }, []);

  const fetchOutfits = async (filters) => {
    try {
      const token = Cookies.get("token");
      const decodedToken = jwtDecode(token);
      const user_id = decodedToken.id;

      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`http://localhost:9000/mycloset/filter-outfits-by-filters/${user_id}?${query}`);
      if (!res.ok) {
        throw new Error('Failed to fetch outfits');
      }
      const data = await res.json();
      console.log('Fetched outfits:', data);
      setOutfits(data);
    } catch (error) {
      console.error('Error fetching outfits', error);
    }
  };
  
  return (
    <div>
      <ToastContainer autoClose={2000} />
      <h1>My outfits</h1>
      <FilterBarOutfit onFilter={fetchOutfits} />
      <GridContainer>
        {outfits.map((outfit, index) => (
          <OutfitCard key={index} outfit={outfit}/>
        ))}
      </GridContainer>
    </div>
  );
}

export default MyOutfits;
