import React, { useState } from 'react';
import { FilterContainer, FilterButtonsContainer, FilterButton, IconButton, Dropdown, 
    ColorPicker, ColorDropdown, ColorBox, SelectedFiltersContainer, SelectedFilter, RemoveFilterButton, FilterWrapper, FilterTitle, AddClothingLink, FilterHeader, Separator } from '../styles/FilterBar.styled';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faFilter } from '@fortawesome/free-solid-svg-icons';

const FilterBar = ({ onFilter }) => {
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);
  const [lastWornAt, setLastWornAt] = useState(null);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

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

  const handleAddCategory = (e) => {
    const value = e.target.value;
    if (value && !categories.includes(value)) {
      setCategories([...categories, value]);
    }
    e.target.value = '';
  };

  const handleAddMaterial = (e) => {
    const value = e.target.value;
    if (value && !materials.includes(value)) {
      setMaterials([...materials, value]);
    }
    e.target.value = '';
  };

  const handleColorClick = (color) => {
    if (!colors.includes(color)) {
      setColors([...colors, color]);
    }
    setColorPickerVisible(false);
  };

  const removeFilter = (filterType, value) => {
    if (filterType === 'category') setCategories(categories.filter(cat => cat !== value));
    if (filterType === 'material') setMaterials(materials.filter(mat => mat !== value));
    if (filterType === 'color') setColors(colors.filter(col => col !== value));
  };

  const clearAllFilters = () => {
    setCategories([]);
    setMaterials([]);
    setColors([]);
    setLastWornAt(null);
    onFilter({ categories: [], materials: [], colors: [], lastWornAt: null });
  };

  const applyFilters = () => {
    onFilter({ categories, materials, colors, lastWornAt });
  };

  return (
      <FilterWrapper>
      <FilterHeader>
        <FilterTitle>Filters</FilterTitle>
        <AddClothingLink to="/myclothes/new">
          Add Clothing
        </AddClothingLink>
      </FilterHeader>
      <Separator />
      <FilterContainer>
        <FilterButtonsContainer>
          <Dropdown onChange={handleAddCategory}>
            <option value="">Category</option>
            <option value="pants">Pants</option>
            <option value="t-shirt">T-shirt</option>
            <option value="skirt">Skirt</option>
            <option value="dress">Dress</option>
            <option value="shorts">Shorts</option>
            <option value="shoes">Shoes</option>
            <option value="hat">Hat</option>
            <option value="longsleeve">Longsleeve</option>
            <option value="outwear">Outwear</option>
            <option value="shirt">Shirt</option>
          </Dropdown>
          <Dropdown onChange={handleAddMaterial}>
            <option value="">Material</option>
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
          </Dropdown>
          <ColorPicker>
            <FilterButton onClick={() => setColorPickerVisible(!colorPickerVisible)}>
              Pick Color
            </FilterButton>
            {colorPickerVisible && (
              <ColorDropdown>
                {Object.entries(colorOptions).map(([name, hex]) => (
                  <ColorBox key={name} style={{ backgroundColor: hex }} onClick={() => handleColorClick(name)} />
                ))}
              </ColorDropdown>
            )}
          </ColorPicker>
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
          {categories.map(cat => (
            <SelectedFilter key={cat}>
              {cat}
              <RemoveFilterButton onClick={() => removeFilter('category', cat)}>
                <FontAwesomeIcon icon={faXmark} />
              </RemoveFilterButton>
            </SelectedFilter>
          ))}
          {materials.map(mat => (
            <SelectedFilter key={mat}>
              {mat}
              <RemoveFilterButton onClick={() => removeFilter('material', mat)}>
                <FontAwesomeIcon icon={faXmark} />
              </RemoveFilterButton>
            </SelectedFilter>
          ))}
          {colors.map(col => (
            <SelectedFilter key={col}>
              <ColorBox style={{ backgroundColor: colorOptions[col] }} />
              <RemoveFilterButton onClick={() => removeFilter('color', col)}>
                <FontAwesomeIcon icon={faXmark} />
              </RemoveFilterButton>
            </SelectedFilter>
          ))}
          <FilterButton onClick={clearAllFilters}>Clear All</FilterButton>
        </SelectedFiltersContainer>
      </FilterContainer>
    </FilterWrapper>
  );
};

export default FilterBar;
