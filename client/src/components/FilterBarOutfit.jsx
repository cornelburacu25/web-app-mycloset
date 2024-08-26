import React, { useState } from 'react';
import { FilterContainer, FilterButtonsContainer, FilterButton, IconButton, Dropdown, 
    SelectedFiltersContainer, SelectedFilter, RemoveFilterButton, FilterWrapper, FilterTitle, AddClothingLink, FilterHeader, Separator } from '../styles/FilterBar.styled';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faFilter } from '@fortawesome/free-solid-svg-icons';

const FilterBarOutfit = ({ onFilter }) => {
    const [occasions, setOccasions] = useState([]);
    const [lastWornAt, setLastWornAt] = useState(null);
    const [topCategories, setTopCategories] = useState([]);
    const [bottomCategories, setBottomCategories] = useState([]);
    const [dressFilter, setDressFilter] = useState(false);
    const [favoriteFilter, setFavoriteFilter] = useState(false);
  
    const handleAddOccasion = (e) => {
      const value = e.target.value;
      if (value && !occasions.includes(value)) {
        setOccasions([...occasions, value]);
      }
      e.target.value = '';
    };
  
    const handleAddTopCategory = (e) => {
      const value = e.target.value;
      if (value && !topCategories.includes(value)) {
        setTopCategories([...topCategories, value]);
        setDressFilter(false);
      }
    };
  
    const handleAddBottomCategory = (e) => {
      const value = e.target.value;
      if (value && !bottomCategories.includes(value)) {
        setBottomCategories([...bottomCategories, value]);
        setDressFilter(false);
      }
    };
  
    const handleAddDressFilter = () => {
      setDressFilter(true);
      setTopCategories([]);
      setBottomCategories([]);
    };
  
    const handleAddFavoriteFilter = () => {
      setFavoriteFilter(true);
    };
  
    const removeFilter = (filterType, value) => {
      if (filterType === 'occasion') setOccasions(occasions.filter(occ => occ !== value));
      if (filterType === 'topCategory') setTopCategories(topCategories.filter(cat => cat !== value));
      if (filterType === 'bottomCategory') setBottomCategories(bottomCategories.filter(cat => cat !== value));
      if (filterType === 'dressFilter') setDressFilter(false);
      if (filterType === 'favoriteFilter') setFavoriteFilter(false);
    };
  
    const clearAllFilters = () => {
      setOccasions([]);
      setTopCategories([]);
      setBottomCategories([]);
      setDressFilter(false);
      setFavoriteFilter(false);
      setLastWornAt(null);
      onFilter({ occasions: [], lastWornAt: null, clothingCategories: [], favorite: null });
    };
  
    const applyFilters = () => {
      const clothingCategories = [];
      if (topCategories.length > 0) clothingCategories.push(...topCategories);
      if (bottomCategories.length > 0) clothingCategories.push(...bottomCategories);
      if (dressFilter) clothingCategories.push('dress');
  
      onFilter({ occasions, lastWornAt, clothingCategories, favorite: favoriteFilter });
    };
  
    return (
        <FilterWrapper>
        <FilterHeader>
          <FilterTitle>Filters</FilterTitle>
          <AddClothingLink to="/myoutfits/new">
            Add Outfit
          </AddClothingLink>
        </FilterHeader>
        <Separator />
        <FilterContainer>
          <FilterButtonsContainer>
            <Dropdown onChange={handleAddOccasion}>
              <option value="">Occasion</option>
              <option value="formal">Formal</option>
              <option value="semi-formal">Semi-Formal</option>
              <option value="casual">Casual</option>
              <option value="professional">Professional</option>
              <option value="outdoor activities">Outdoor Activities</option>
              <option value="home">Home</option>
              <option value="cultural">Cultural</option>
              <option value="recreational">Recreational</option>
              <option value="celebratory">Celebratory</option>
            </Dropdown>
            <Dropdown onChange={handleAddTopCategory}>
              <option value="">Top Category</option>
              <option value="longsleeve">Longsleeve</option>
              <option value="shirt">Shirt</option>
              <option value="t-shirt">T-shirt</option>
            </Dropdown>
            <Dropdown onChange={handleAddBottomCategory}>
              <option value="">Bottom Category</option>
              <option value="pants">Pants</option>
              <option value="skirt">Skirt</option>
              <option value="shorts">Shorts</option>
            </Dropdown>
            <FilterButton onClick={handleAddDressFilter}>
              Dress
            </FilterButton>
            <FilterButton onClick={handleAddFavoriteFilter}>
              Favorite
            </FilterButton>
            <DatePicker
              selected={lastWornAt}
              onChange={(date) => setLastWornAt(date)}
              placeholderText="Last Worn At"
            />
            <IconButton onClick={applyFilters}>
              <FontAwesomeIcon icon={faFilter} style={{ color: '#000' }} />
            </IconButton>
          </FilterButtonsContainer>
          <Separator />
          <SelectedFiltersContainer>
            {occasions.map(occ => (
              <SelectedFilter key={occ}>
                {occ}
                <RemoveFilterButton onClick={() => removeFilter('occasion', occ)}>
                  <FontAwesomeIcon icon={faXmark} />
                </RemoveFilterButton>
              </SelectedFilter>
            ))}
            {topCategories.map(cat => (
              <SelectedFilter key={cat}>
                {cat}
                <RemoveFilterButton onClick={() => removeFilter('topCategory', cat)}>
                  <FontAwesomeIcon icon={faXmark} />
                </RemoveFilterButton>
              </SelectedFilter>
            ))}
            {bottomCategories.map(cat => (
              <SelectedFilter key={cat}>
                {cat}
                <RemoveFilterButton onClick={() => removeFilter('bottomCategory', cat)}>
                  <FontAwesomeIcon icon={faXmark} />
                </RemoveFilterButton>
              </SelectedFilter>
            ))}
            {dressFilter && (
              <SelectedFilter>
                Dress
                <RemoveFilterButton onClick={() => removeFilter('dressFilter', 'dress')}>
                  <FontAwesomeIcon icon={faXmark} />
                </RemoveFilterButton>
              </SelectedFilter>
            )}
            {favoriteFilter && (
              <SelectedFilter>
                Favorite
                <RemoveFilterButton onClick={() => removeFilter('favoriteFilter', 'favorite')}>
                  <FontAwesomeIcon icon={faXmark} />
                </RemoveFilterButton>
              </SelectedFilter>
            )}
            <FilterButton onClick={clearAllFilters}>Clear All</FilterButton>
          </SelectedFiltersContainer>
        </FilterContainer>
      </FilterWrapper>
    );
  };

export default FilterBarOutfit;
