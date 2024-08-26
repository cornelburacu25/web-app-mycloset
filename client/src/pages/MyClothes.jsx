import React, { useEffect, useState } from "react"
import { Card } from "../components/Card"
import { GridContainer} from "../styles/CardRowCol.styled"
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie'
import { jwtDecode } from "jwt-decode";
import FilterBar from "../components/FilterBar";

function MyClothes() {
  const [clothings, setClothings] = useState([]);

  useEffect(() => {
    fetchClothings({});
  }, []);

  const fetchClothings = async (filters) => {
    try {
      const token = Cookies.get("token");
      const decodedToken = jwtDecode(token);
      const user_id = decodedToken.id;

      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`http://localhost:9000/mycloset/filter-clothings-by-filters/${user_id}?${query}`);
      if (!res.ok) {
        throw new Error('Failed to fetch clothings');
      }
      const data = await res.json();
      console.log('Fetched clothings:', data);
      setClothings(data);
    } catch (error) {
      console.error('Error fetching clothings', error);
    }
  };

  return (
    <div>
      <ToastContainer autoClose={2000} />
      <h1>My clothes</h1>
      <FilterBar onFilter={fetchClothings} />
      <GridContainer>
        {clothings.map((clothing, index) => (
          <Card key={index} clothing={clothing} />
        ))}
      </GridContainer>
    </div>
  );
}
  
  export default MyClothes