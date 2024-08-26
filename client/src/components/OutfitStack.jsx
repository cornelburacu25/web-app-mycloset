import React, { useState, useEffect } from "react";
import { StackContainer, CardWrapper } from "../styles/OutfitStack.styled";
import { OutfitChoiceCard } from "./OutfitChoiceCard";

const OutfitStack = ({ onLike, onDislike, outfits }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState('');
  const [filteredOutfits, setFilteredOutfits] = useState(outfits);

  useEffect(() => {
    setFilteredOutfits(outfits);
    setCurrentIndex(0);  // Reset index when new outfits are fetched
  }, [outfits]);

  const handleLike = (outfitId) => {
    setAnimate('out-left');
    setTimeout(() => {
      onLike(outfitId);
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % filteredOutfits.length;
        return newIndex;
      });
      setAnimate('in-right');
    }, 500);
  };

  const handleDislike = (outfitId) => {
    setAnimate('out-right');
    setTimeout(() => {
      onDislike(outfitId);
      setFilteredOutfits((prevOutfits) => {
        const newOutfits = prevOutfits.filter(outfit => outfit.id !== outfitId);
        
        return newOutfits;
      });
      setAnimate('in-left');
    }, 500);
  };

  if (!filteredOutfits || filteredOutfits.length === 0) {
    return <p>No outfits found</p>;
  }

  const currentOutfit = filteredOutfits[currentIndex];

  return (
    <StackContainer>
      {currentOutfit && (
        <CardWrapper key={currentOutfit.id} animate={animate}>
          <OutfitChoiceCard
            outfit={currentOutfit}
            onLike={() => handleLike(currentOutfit.id)}
            onDislike={() => handleDislike(currentOutfit.id)}
          />
        </CardWrapper>
      )}
    </StackContainer>
  );
};
  
export default OutfitStack;
