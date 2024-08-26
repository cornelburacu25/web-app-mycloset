import React, { useState, useEffect } from "react"
import ChoiceCard from "../components/ChoiceCard";
import { OutfitCard } from "../components/OutfitCard";
import { CardContainer } from "../styles/OutfitPicker.styled";
import axios from 'axios'
import Cookies from 'js-cookie';
import {jwtDecode} from "jwt-decode";

const OutfitPicker = () => {
  const [selectedOutfit, setSelectedOutfit] = useState(null);

  useEffect(() => {
    const checkTodayOutfit = async () => {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const decodedToken = jwtDecode(token);
      const user_id = decodedToken.id;
      const today = new Date();
      const formattedToday = today.toISOString().split("T")[0]; // YYYY-MM-DD

      try {
        const response = await axios.get(`http://localhost:9000/mycloset/outfit-histories/${user_id}`);
        const outfitHistory = response.data;

        if (outfitHistory && outfitHistory.wornAt.split("T")[0] === formattedToday) {
          setSelectedOutfit(outfitHistory.Outfit);
        }
      } catch (error) {
        console.error("Error fetching outfit histories:", error);
      }
    };

    checkTodayOutfit();
  }, []);

  if (selectedOutfit) {
    return (
      <div style={{ justifyContent: 'center'}}>
        <h1>Outfit Picker</h1>
        <h3 styled>The outfit of the day</h3>
        <div style={{ justifyContent: 'center', display: 'flex'}}>
          <OutfitCard outfit={selectedOutfit}  />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Outfit Picker</h1>
      <CardContainer>
        <ChoiceCard title="Pick a new outfit" link="/outfitgenerator" />
        <ChoiceCard title="Pick a built outfit" link="/pick-a-created-outfit" />
        <ChoiceCard title="Pick a disliked outfit" link="/pick-a-disliked-outfit" />
        <ChoiceCard title="Build it yourself" link="/build-it-yourself" />
      </CardContainer>
    </div>
  );
};
  export default OutfitPicker