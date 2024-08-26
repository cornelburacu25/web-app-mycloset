import React, { useEffect, useState } from "react";
import { MiniCard } from "../components/MiniCard";
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { Container, Header, ScrollableContent, GridContainer, NavItem } from "../styles/ClothingsPanel.styled";
import DeselectButton from "./DeselectButton";

const ClothingsPanel = ( {onSelect, setSelectedClothings} ) => {
    const [clothings, setClothings] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedItems, setSelectedItems] = useState({
      hat: null,
      top: null,
      bottom: null,
      shoes: null,
      dress: null,
      outwear: null,
    });

    useEffect(() => {
      fetchClothings();
    }, [selectedCategory]);
  
    const fetchClothings = async () => {
      try {
        const token = Cookies.get("token");
        const decodedToken = jwtDecode(token);
        const user_id = decodedToken.id;
        const res = await fetch(`http://localhost:9000/mycloset/yourclothings/${user_id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch clothings');
        }
        const data = await res.json();
        console.log('Fetched clothings:', data);
        if (selectedCategory) {
          const filteredData = data.filter(clothing => selectedCategory.includes(clothing.category));
          setClothings(filteredData);
        } else {
            setClothings(data);
        }
      } catch (error) {
        console.error('Error fetching clothings', error);
      }
    };

    const handleNavItemClick = (category) => {
      setSelectedCategory(category);
  };

    const handleSelect = (clothing) => {
      const category = Object.keys(categoryMapping).find(key =>
        categoryMapping[key].includes(clothing.category)
      );
      setSelectedItems(prevSelectedItems => ({
        ...prevSelectedItems,
        [category]: clothing
      }));
      onSelect(clothing);
    };

    const categoryMapping = {
      Hat: ['hat'],
      Top: ['longsleeve', 'shirt', 't-shirt'],
      Bottom: ['shorts', 'pants', 'skirt'],
      Shoes: ['shoes'],
      Outwear: ['outwear'],
      Dress: ['dress']
  };
  
    return (
      <Container>
        <ToastContainer autoClose={2000} />
        <Header>
          {Object.keys(categoryMapping).map(category => (
                      <NavItem
                          key={category}
                          onClick={() => handleNavItemClick(categoryMapping[category])}
                          isSelected={selectedCategory === categoryMapping[category]}
                      >
                          {category}
                      </NavItem>
                  ))}
        </Header>
        <ScrollableContent>
          <GridContainer>
          {selectedCategory && (
                        <DeselectButton category={selectedCategory} setSelectedClothings={setSelectedClothings} />
                    )}
            {clothings.map((clothing, index) => (
              <MiniCard 
                key={index} 
                clothing={clothing}
                onSelect={handleSelect}
                isSelected={selectedItems[Object.keys(categoryMapping).find(key => categoryMapping[key].includes(clothing.category))]?.id === clothing.id} />
            ))}
          </GridContainer>
        </ScrollableContent>
      </Container>
    );
  }
  
  export default ClothingsPanel;