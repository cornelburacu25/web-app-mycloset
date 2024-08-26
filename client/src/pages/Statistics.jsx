import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie"
import MostOwnedCategoryChart from "../charts/MostOwnedCategoryChart";
import MostWornCategoryChart from "../charts/MostWornCategoryChart";
import MostOwnedColorsChart from "../charts/MostOwnedColorsChart";
import MostWornColorsChart from "../charts/MostWornColorsChart";
import styled from "styled-components";
import MostOwnedMaterialsChart from "../charts/MostOwnedMaterialsChart";
import MostWornMaterialsChart from "../charts/MostWornMaterialsChart";

const StatisticsContainer = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;


const Statistics = () => {
    const [userId, setUserId] = useState(null);
  
    useEffect(() => {
      const token = Cookies.get('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
      }
    }, []);
  
    if (!userId) {
      return <div>Loading...</div>; // Or some kind of loading indicator
    }
  
    return (
    <StatisticsContainer>
        <h2>Clothing Statistics</h2>
        <MostOwnedCategoryChart userId={userId} />
        <MostWornCategoryChart userId={userId} />
        <MostOwnedColorsChart userId={userId} />
        <MostWornColorsChart userId={userId} />
        <MostOwnedMaterialsChart userId={userId} />
        <MostWornMaterialsChart userId={userId} />
    </StatisticsContainer>
    );
  };

export default Statistics;