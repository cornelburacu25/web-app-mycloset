import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import { ButtonContainer } from '../styles/DeselectButton.styled';

const DeselectButton = ({ category, setSelectedClothings }) => {
  const handleDeselect = () => {
    setSelectedClothings(prevSelected =>
      prevSelected.filter(clothing =>
        !category.includes(clothing.category)
      )
    );
  };

  return (
    <ButtonContainer onClick={handleDeselect}>
      <FontAwesomeIcon icon={faRectangleXmark} size="3x" />
    </ButtonContainer>
  );
};

export default DeselectButton;
