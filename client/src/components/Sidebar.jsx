import React, { useState, useEffect } from 'react';
import {
  SidebarContainer,
  Section,
  Title,
  RadioGroup,
  RadioLabel,
  RadioInput,
  AccordionButton,
  AccordionContent,
  CheckboxGroup,
  CheckboxLabel,
  CheckboxInput,
  SelectGroup,
  SelectLabel,
  SelectInput,
  Separator,
  GenerateButton
} from '../styles/Sidebar.styled';
import Modal from './Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';


const Sidebar = ({ setFilters, handleGenerate, triggerModal, weatherFilters, setWeatherFilters }) => {
  const [weatherRecommendation, setWeatherRecommendation] = useState(null);
  const [shouldContainDress, setShouldContainDress] = useState(false);
  const [outfitTypeOpen, setOutfitTypeOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [materialPickerOpen, setMaterialPickerOpen] = useState(false);
  const [topCategories, setTopCategories] = useState([]);
  const [bottomCategories, setBottomCategories] = useState([]);
  const [colors, setColors] = useState({});
  const [materials, setMaterials] = useState({});
  const [typeRecommendations, setTypeRecommendations] = useState({
    dress: false,
    outwear: false,
    hat: false,
  });

  useEffect(() => {
    const typeRecommendationArray = [];
    if (typeRecommendations.dress) typeRecommendationArray.push('dress');
    if (typeRecommendations.outwear) typeRecommendationArray.push('outwear');
    if (typeRecommendations.hat) typeRecommendationArray.push('hat');
    if (!typeRecommendations.dress) {
      typeRecommendationArray.push('top', 'bottom');
    }

    const filters = {
      typeRecommendation: typeRecommendationArray,
      colorRecommendation: colors,
      materialRecommendation: materials,
      categoryRecommendation: {
        top: topCategories,
        bottom: bottomCategories,
      },
    };

    console.log('Setting Filters:', filters);
    setFilters(filters);
  }, [typeRecommendations, colors, materials, topCategories, bottomCategories, setFilters]);

  const handleTypeChange = (type) => {
    setTypeRecommendations((prev) => {
      const newState = { ...prev, [type]: !prev[type] };
      console.log(`Updated ${type}:`, newState[type]);
      return newState;
    });
  };

  const handleWeatherChange = (value) => {
    setWeatherRecommendation(value);
    if (value === 'yes') {
      triggerModal();
      setWeatherFilters((prev) => ({ ...prev, shouldContainDress: shouldContainDress }));
    } else {
      setWeatherFilters(null);
    }
  };

  const handleGenerateClick = () => {
    handleGenerate();
  };

  return (
    <SidebarContainer>
      <Title>OutfitGenerator</Title>
      <Section>
        <p>Weather based recommendations:</p>
        <RadioGroup>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="weather"
              value="yes"
              checked={weatherRecommendation === 'yes'}
              onChange={() => handleWeatherChange('yes')}
            />
            Yes
          </RadioLabel>
          <RadioLabel>
            <RadioInput
              type="radio"
              name="weather"
              value="no"
              checked={weatherRecommendation === 'no'}
              onChange={() => handleWeatherChange('no')}
            />
            No
          </RadioLabel>
        </RadioGroup>
        {weatherRecommendation === 'yes' && (
          <Section>
            <p>Should contain dress?</p>
            <RadioGroup>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="shouldContainDress"
                  value="yes"
                  checked={shouldContainDress === true}
                  onChange={() => {
                    setShouldContainDress(true);
                    setWeatherFilters((prev) => ({ ...prev, shouldContainDress: true }));
                  }}
                />
                Yes
              </RadioLabel>
              <RadioLabel>
                <RadioInput
                  type="radio"
                  name="shouldContainDress"
                  value="no"
                  checked={shouldContainDress === false}
                  onChange={() => {
                    setShouldContainDress(false);
                    setWeatherFilters((prev) => ({ ...prev, shouldContainDress: false }));
                  }}
                />
                No
              </RadioLabel>
            </RadioGroup>
          </Section>
          
        )}
        {weatherRecommendation === 'no' && (
          <>
            <AccordionButton onClick={() => setOutfitTypeOpen(!outfitTypeOpen)}>
              Outfit Type <FontAwesomeIcon icon={outfitTypeOpen ? faArrowUp : faArrowDown} />
            </AccordionButton>
            {outfitTypeOpen && (
              <>
                <AccordionContent isOpen={outfitTypeOpen}>
                  <CheckboxGroup>
                    <p>Should contain dress?</p>
                    <RadioGroup>
                      <RadioLabel>
                        <RadioInput
                          type="radio"
                          name="dress"
                          value="yes"
                          checked={typeRecommendations.dress === true}
                          onChange={() => handleTypeChange('dress')}
                        />
                        Yes
                      </RadioLabel>
                      <RadioLabel>
                        <RadioInput
                          type="radio"
                          name="dress"
                          value="no"
                          checked={typeRecommendations.dress === false}
                          onChange={() => handleTypeChange('dress')}
                        />
                        No
                      </RadioLabel>
                    </RadioGroup>
                    <p>Add additional clothes?</p>
                    <CheckboxLabel>
                      <CheckboxInput
                        type="checkbox"
                        checked={typeRecommendations.outwear}
                        onChange={() => handleTypeChange('outwear')}
                      />
                      Outwear
                    </CheckboxLabel>
                    <CheckboxLabel>
                      <CheckboxInput
                        type="checkbox"
                        checked={typeRecommendations.hat}
                        onChange={() => handleTypeChange('hat')}
                      />
                      Hat
                    </CheckboxLabel>
                  </CheckboxGroup>
                </AccordionContent>
                <Separator />
              </>
            )}
            {outfitTypeOpen && (
              <>
                <AccordionButton onClick={() => setCategoryOpen(!categoryOpen)}>
                  CategoryType <FontAwesomeIcon icon={categoryOpen ? faArrowUp : faArrowDown} />
                </AccordionButton>
                {categoryOpen && (
                  <>
                    <AccordionContent isOpen={categoryOpen}>
                      <CheckboxGroup>
                        <p>Should the top be:</p>
                        <CheckboxLabel>
                          <CheckboxInput
                            type="checkbox"
                            onChange={(e) => {
                              const value = 'longsleeve';
                              setTopCategories(e.target.checked ? [...topCategories, value] : topCategories.filter(item => item !== value));
                            }}
                          />
                          Longsleeve
                        </CheckboxLabel>
                        <CheckboxLabel>
                          <CheckboxInput
                            type="checkbox"
                            onChange={(e) => {
                              const value = 't-shirt';
                              setTopCategories(e.target.checked ? [...topCategories, value] : topCategories.filter(item => item !== value));
                            }}
                          />
                          T-shirt
                        </CheckboxLabel>
                        <CheckboxLabel>
                          <CheckboxInput
                            type="checkbox"
                            onChange={(e) => {
                              const value = 'shirt';
                              setTopCategories(e.target.checked ? [...topCategories, value] : topCategories.filter(item => item !== value));
                            }}
                          />
                          Shirt
                        </CheckboxLabel>
                        <p>Should the bottom be:</p>
                        <CheckboxLabel>
                          <CheckboxInput
                            type="checkbox"
                            onChange={(e) => {
                              const value = 'pants';
                              setBottomCategories(e.target.checked ? [...bottomCategories, value] : bottomCategories.filter(item => item !== value));
                            }}
                          />
                          Pants
                        </CheckboxLabel>
                        <CheckboxLabel>
                          <CheckboxInput
                            type="checkbox"
                            onChange={(e) => {
                              const value = 'shorts';
                              setBottomCategories(e.target.checked ? [...bottomCategories, value] : bottomCategories.filter(item => item !== value));
                            }}
                          />
                          Shorts
                        </CheckboxLabel>
                        <CheckboxLabel>
                          <CheckboxInput
                            type="checkbox"
                            onChange={(e) => {
                              const value = 'skirt';
                              setBottomCategories(e.target.checked ? [...bottomCategories, value] : bottomCategories.filter(item => item !== value));
                            }}
                          />
                          Skirt
                        </CheckboxLabel>
                      </CheckboxGroup>
                    </AccordionContent>
                    <Separator />
                  </>
                )}
                <AccordionButton onClick={() => setColorPickerOpen(!colorPickerOpen)}>
                  ColorPicker <FontAwesomeIcon icon={colorPickerOpen ? faArrowUp : faArrowDown} />
                </AccordionButton>
                {colorPickerOpen && (
                  <>
                    <AccordionContent isOpen={colorPickerOpen}>
                      <SelectGroup>
                        {!typeRecommendations.dress && (
                          <>
                            <SelectLabel>Top</SelectLabel>
                            <SelectInput
                              onChange={(e) => setColors(prev => ({ ...prev, top: e.target.value }))}
                            >
                              <option value="">Select a color</option>
                              <option value="red">Red</option>
                              <option value="blue">Blue</option>
                              <option value="yellow">Yellow</option>
                              <option value="green">Green</option>
                              <option value="pink">Pink</option>
                              <option value="purple">Purple</option>
                              <option value="brown">Brown</option>
                              <option value="white">White</option>
                              <option value="black">Black</option>
                              <option value="cyan">Cyan</option>
                              <option value="orange">Orange</option>
                              <option value="gray">Gray</option>
                            </SelectInput>
                            <SelectLabel>Bottom</SelectLabel>
                            <SelectInput
                              onChange={(e) => setColors(prev => ({ ...prev, bottom: e.target.value }))}
                            >
                              <option value="">Select a color</option>
                              <option value="red">Red</option>
                              <option value="blue">Blue</option>
                              <option value="yellow">Yellow</option>
                              <option value="green">Green</option>
                              <option value="pink">Pink</option>
                              <option value="purple">Purple</option>
                              <option value="brown">Brown</option>
                              <option value="white">White</option>
                              <option value="black">Black</option>
                              <option value="cyan">Cyan</option>
                              <option value="orange">Orange</option>
                              <option value="gray">Gray</option>
                            </SelectInput>
                          </>
                        )}
                        {typeRecommendations.dress && (
                          <>
                            <SelectLabel>Dress</SelectLabel>
                            <SelectInput
                              onChange={(e) => setColors(prev => ({ ...prev, dress: e.target.value }))}
                            >
                              <option value="">Select a color</option>
                              <option value="red">Red</option>
                              <option value="blue">Blue</option>
                              <option value="yellow">Yellow</option>
                              <option value="green">Green</option>
                              <option value="pink">Pink</option>
                              <option value="purple">Purple</option>
                              <option value="brown">Brown</option>
                              <option value="white">White</option>
                              <option value="black">Black</option>
                              <option value="cyan">Cyan</option>
                              <option value="orange">Orange</option>
                              <option value="gray">Gray</option>
                            </SelectInput>
                          </>
                        )}
                        {typeRecommendations.outwear && (
                          <>
                            <SelectLabel>Outwear</SelectLabel>
                            <SelectInput
                              onChange={(e) => setColors(prev => ({ ...prev, outwear: e.target.value }))}
                            >
                              <option value="">Select a color</option>
                              <option value="red">Red</option>
                              <option value="blue">Blue</option>
                              <option value="yellow">Yellow</option>
                              <option value="green">Green</option>
                              <option value="pink">Pink</option>
                              <option value="purple">Purple</option>
                              <option value="brown">Brown</option>
                              <option value="white">White</option>
                              <option value="black">Black</option>
                              <option value="cyan">Cyan</option>
                              <option value="orange">Orange</option>
                              <option value="gray">Gray</option>
                            </SelectInput>
                          </>
                        )}
                        {typeRecommendations.hat && (
                          <>
                            <SelectLabel>Hat</SelectLabel>
                            <SelectInput
                              onChange={(e) => setColors(prev => ({ ...prev, hat: e.target.value }))}
                            >
                              <option value="">Select a color</option>
                              <option value="red">Red</option>
                              <option value="blue">Blue</option>
                              <option value="yellow">Yellow</option>
                              <option value="green">Green</option>
                              <option value="pink">Pink</option>
                              <option value="purple">Purple</option>
                              <option value="brown">Brown</option>
                              <option value="white">White</option>
                              <option value="black">Black</option>
                              <option value="cyan">Cyan</option>
                              <option value="orange">Orange</option>
                              <option value="gray">Gray</option>
                            </SelectInput>
                          </>
                        )}
                      </SelectGroup>
                    </AccordionContent>
                    <Separator />
                  </>
                )}
                <AccordionButton onClick={() => setMaterialPickerOpen(!materialPickerOpen)}>
                  MaterialPicker <FontAwesomeIcon icon={materialPickerOpen ? faArrowUp : faArrowDown} />
                </AccordionButton>
                {materialPickerOpen && (
                  <>
                    <AccordionContent isOpen={materialPickerOpen}>
                      <SelectGroup>
                        {!typeRecommendations.dress && (
                          <>
                            <SelectLabel>Top</SelectLabel>
                            <SelectInput
                              onChange={(e) => setMaterials(prev => ({ ...prev, top: e.target.value }))}
                            >
                              <option value="">Select a material</option>
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
                            </SelectInput>
                            <SelectLabel>Bottom</SelectLabel>
                            <SelectInput
                              onChange={(e) => setMaterials(prev => ({ ...prev, bottom: e.target.value }))}
                            >
                              <option value="">Select a material</option>
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
                            </SelectInput>
                          </>
                        )}
                        {typeRecommendations.dress && (
                          <>
                            <SelectLabel>Dress</SelectLabel>
                            <SelectInput
                              onChange={(e) => setMaterials(prev => ({ ...prev, dress: e.target.value }))}
                            >
                              <option value="">Select a material</option>
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
                            </SelectInput>
                          </>
                        )}
                        {typeRecommendations.outwear && (
                          <>
                            <SelectLabel>Outwear</SelectLabel>
                            <SelectInput
                              onChange={(e) => setMaterials(prev => ({ ...prev, outwear: e.target.value }))}
                            >
                              <option value="">Select a material</option>
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
                            </SelectInput>
                          </>
                        )}
                        {typeRecommendations.hat && (
                          <>
                            <SelectLabel>Hat</SelectLabel>
                            <SelectInput
                              onChange={(e) => setMaterials(prev => ({ ...prev, hat: e.target.value }))}
                            >
                              <option value="">Select a material</option>
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
                            </SelectInput>
                          </>
                        )}
                      </SelectGroup>
                    </AccordionContent>
                  </>
                )}
              </>
            )}
          </>
        )}
      </Section>
      <GenerateButton onClick={handleGenerateClick}>Generate</GenerateButton>
    </SidebarContainer>
  );
};

export default Sidebar;
