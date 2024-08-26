import React from 'react';
import { Stage, Layer, Image } from 'react-konva';
import useImage from 'use-image';

const categoryPositions = {
  hat: { x: 43, y: -10, width: 70, height: 70 },
  top: { x: 20, y: 30, width: 120, height: 120 },
  bottom: { x: 15, y: 130, width: 130, height: 150 },
  shoes: { x: 50, y: 265, width: 70, height: 70 },
  outwear: { x: 140, y: 20, width: 120, height: 120 },
  dress: { x: 20, y: 50, width: 140, height: 200 },
};

const OutfitCanvas = ({ width, height, selectedClothings }) => {
  console.log('Selected Clothings:', selectedClothings);
  return (
    <Stage width={width} height={height}>
      <Layer>
        {Object.keys(categoryPositions).map((category) => {
          const clothing = selectedClothings.find(
            (item) => item && categoryMapping[category].includes(item.category)
          );
        console.log(`Category: ${category}, Clothing:`, clothing);
          return (
            clothing && (
              <ClothingImage
                key={category}
                src={clothing.ClothingImage.url}
                {...categoryPositions[category]}
              />
            )
          );
        })}
      </Layer>
    </Stage>
  );
};

const ClothingImage = ({ src, x, y, width, height }) => {
  const [image] = useImage(src, 'anonymous');
  return <Image image={image} x={x} y={y} width={width} height={height} draggable />;
};

const categoryMapping = {
  hat: ['hat'],
  top: ['longsleeve', 'shirt', 't-shirt'],
  bottom: ['shorts', 'pants', 'skirt'],
  shoes: ['shoes'],
  outwear: ['outwear'],
  dress: ['dress'],
};

export default OutfitCanvas;
