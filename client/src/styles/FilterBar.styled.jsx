import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

export const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  @media (max-width: 767px) {
    gap: 5px;
  }
`;

export const FilterTitle = styled.h2`
margin: 0;
font-size: 18px;
color: #000;

@media (min-width: 768px) {
  text-align: left;  
}

@media (max-width: 767px) {
  text-align: center;  
}
`;

export const Separator = styled.div`
  height: 1px;
  width: 100%;
  background-color: #ddd;
`;

export const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
  color: #000;

  @media (min-width: 768px) {
    align-items: flex-start;  /* Align items to the left on larger screens */
  }

  @media (max-width: 767px) {
    align-items: center;  /* Center items on smaller screens */
  }
`;

export const FilterButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
`;

export const FilterButton = styled.button`
  background-color: #3b3b3b;
  color: #fff;
  border: none;
  padding: 5px;
  border-radius: 20px;
  cursor: pointer;
  &:hover {
    background-color: #4c4c4c;
  }
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Dropdown = styled.select`
  background-color: #3b3b3b;
  color: #fff;
  border: none;
  padding: 5px;
  border-radius: 20px;
  cursor: pointer;
`;

export const ColorPicker = styled.div`
  position: relative;
  display: inline-block;
`;

export const ColorDropdown = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  position: absolute;
  background-color: #3b3b3b;
  padding: 10px;
  border-radius: 4px;
  z-index: 100;
`;

export const ColorBox = styled.div`
  width: 15px;
  height: 15px;
  cursor: pointer;
  border: 1px solid #fff;
`;

export const SelectedFiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
  color: #000;
`;

export const SelectedFilter = styled.div`
  display: flex;
  align-items: center;
  background-color: #4c4c4c;
  padding: 5px;
  border-radius: 20px;
  color: #fff;
  font-size: 12px;
`;

export const RemoveFilterButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  margin-left: 5px;
  cursor: pointer;
`;

export const AddClothingLink = styled(Link)`
  background-color: black;
  color: white;
  padding: 0.2rem 0.6rem;  /* Adjusted padding to make the button smaller */
  border-radius: 15px;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;

  &:hover {
    color: white;
  }

  @media (max-width: 767px) {
    align-self: center;
  }
`;
