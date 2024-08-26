const { response } = require("express");
const { Clothing, Brand, ClothingImage, sequelize, ClothingOutfit, OutfitHistory, Outfit } = require("../../config/database");
const { uploadToImgur } = require("../image/uploadImage");
const { Op, json } = require("sequelize");


//Create clothing 
const createClothing = async (req, res) => {
  try {
    const {
      link,
      title,
      category,
      description,
      color,
      material,
      price,
      size,
      brand_name,
      numberOfWears,
      user_id,
    } = req.body;

    const lowercaseBrandName = brand_name.toLowerCase();

    console.log('Request Body:', req.body);

    let brand = await Brand.findOne({
      where: {
        name: lowercaseBrandName,
      }
    });

    if (!brand) {
      brand = await Brand.create({
        name: lowercaseBrandName,
      });
    }

    // Create image and upload it to Imgur
    if (!link) {
      throw new Error("No image file provided");
    }

    let lowercaseSize = null;
    if (size != null) {
      lowercaseSize = size.toLowerCase();
    }

    const updatedSize = size === '' ? null : lowercaseSize;
    const updatedPrice = price === '' ? null : price;

    // Create the clothing image record
    const clothingImage = await ClothingImage.create({
      url: link,
      label: category, 
    });

    const clothing = await Clothing.create({
      title,
      category,
      description,
      color,
      material,
      price: updatedPrice,
      size: updatedSize,
      brand_id: brand.id,
      numberOfWears,
      user_id,
      clothing_image_id: clothingImage.id,
    });

    res.status(201).json({ clothing });
  } catch (error) {
    console.error('Failed to create clothing', error);
    res.status(500).json({
      message: error.message,
    });
  }
};


const getAllClothings = async (req, res) => {
    try {
        const clothings = await Clothing.findAll({
            include: [{
                model: ClothingImage,
                attributes: ['url'],
            },
            {
                model: Brand,
                attributes: ['name'],
            }]
        });
        res.json(clothings);
    } catch (error) {
        console.log(error);
        res
            .status(500)
            ,json({error: "Failed to fetch clothings", message: error.message});
    }
};

const getAllClothingsForUser = async (req, res) => {
  try {
    const { user_id } = req.params; // Assuming user_id is passed as a parameter
    console.log(user_id);
    
    let clothings = [];
    const userClothings = await Clothing.findAll({
        where: {
            user_id: user_id
        },
        include: [{
            model: ClothingImage,
            attributes: ['url'],
        },
        {
            model: Brand,
            attributes: ['name'],
        }]
    });

    

    if (clothings.length === 0) {
      return res.json(userClothings);
  } else {
    clothings = userClothings;
  }

    res.json(clothings);
} catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch clothings", message: error.message });
}
};

const getClothingById = async (req, res) => {
    const { id } = req.params;
    try {
        const clothing = await Clothing.findByPk(id, {
            include: [
              {
                model: ClothingImage,
                attributes: ['url'],
              },
              {
                model: Brand,
                attributes: ['name'],
              }
            ],
          });
      if (clothing) {
        res.json(clothing);
      } else {
        console.log(error);
        res.status(404).json({ error: "Clothing not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch clothing", message: error.message });
    }
  };
  
  const updateClothing = async (req, res) => {
    const { id } = req.params;
    const { title, description, material, price, size, brand_name, color, category } = req.body;
    
    try {
      const clothing = await Clothing.findByPk(id);
      
      if (clothing) {
        let brand = await Brand.findOne({
          where: {
            name: brand_name,
          }
        });
  
        if (!brand) {
          brand = await Brand.create({
            name: brand_name,
          });
        }
  
        let lowercaseSize = null;
        if (size != null) {
          lowercaseSize = size.toLowerCase();
        }
  
        const updatedSize = size === '' ? null : lowercaseSize;
        const updatedPrice = price === '' ? null : price;
  
        await clothing.update({
          title,
          description,
          material,
          price: updatedPrice,
          size: updatedSize,
          brand_id: brand.id,
          color,
          category,
          updated_at: Date.now(),
        });
        
        res.json(clothing);
      } else {
        res.status(404).json({ error: "Clothing not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to update clothing", message: error.message });
    }
  };
  
  
  const deleteClothing = async (req, res) => {
    const { id } = req.params;
    
    const transaction = await sequelize.transaction();
    
    try {
        // Find the clothing by its ID
        const clothing = await Clothing.findByPk(id);
        if (!clothing) {
            return res.status(404).json({ error: "Clothing not found" });
        }

        // Store the clothing image ID in a variable
        const clothingImageId = clothing.clothing_image_id;

        // Find all outfits that contain this clothing item
        const clothingOutfits = await ClothingOutfit.findAll({ where: { clothing_id: id } });
        const outfitIds = clothingOutfits.map(co => co.outfit_id);

        // Delete related entries in the OutfitHistories table
        await OutfitHistory.destroy({
            where: { outfit_id: outfitIds },
            transaction
        });

        // Delete related entries in the ClothingOutfits table
        await ClothingOutfit.destroy({
            where: { outfit_id: outfitIds },
            transaction
        });

        // Delete the outfits
        await Outfit.destroy({
            where: { id: outfitIds },
            transaction
        });

        // Delete the clothing item
        await clothing.destroy({ transaction });

        // If the clothing image ID exists, delete the associated clothing image
        if (clothingImageId) {
            const clothingImage = await ClothingImage.findByPk(clothingImageId);
            if (clothingImage) {
                await clothingImage.destroy({ transaction });
            }
        }

        await transaction.commit();

        // Send success response
        return res.status(200).json({ message: "Clothing and related outfits deleted successfully" });
    } catch (error) {
        await transaction.rollback();
        console.error("Failed to delete clothing:", error);
        return res.status(500).json({ error: "Failed to delete clothing", message: error.message });
    }
};

// Helper function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};


const filterClothings = async (req, res) => {
  try {
    const { user_id } = req.params;
    const {
      typeRecommendation = [],
      colorRecommendation = {},
      materialRecommendation = {},
      categoryRecommendation = { top: [], bottom: [] }
    } = req.query;

    const filters = {
      user_id: user_id
    };

    const baseQuery = {
      where: {
        ...filters,
        category: { [Op.in]: ['longsleeve', 't-shirt', 'shirt', 'pants', 'skirt', 'shorts', 'shoes', 'dress', 'hat', 'outwear'] }
      },
      include: [{
        model: ClothingImage,
        attributes: ['url']
      }]
    };

    // Fetch all matching clothes
    const clothings = await Clothing.findAll(baseQuery);

    // Helper function to filter by color and material
    const filterByColorAndMaterial = (items, color, material) => {
      return items.filter(item =>
        (!color || item.color === color) &&
        (!material || item.material === material)
      );
    };

    // Organize clothings by category
    const categorizedClothings = clothings.reduce((acc, clothing) => {
      if (!acc[clothing.category]) {
        acc[clothing.category] = [];
      }
      acc[clothing.category].push(clothing);
      return acc;
    }, {});

    // Define top and bottom categories
    const topCategories = ['longsleeve', 't-shirt', 'shirt'];
    const bottomCategories = ['pants', 'skirt', 'shorts'];

    // Filter tops and bottoms by category recommendation if specified
    const filteredTopItems = filterByColorAndMaterial(
      topCategories.flatMap(category => categorizedClothings[category] || []),
      colorRecommendation.top,
      materialRecommendation.top
    ).filter(item => categoryRecommendation.top.length === 0 || categoryRecommendation.top.includes(item.category));

    const filteredBottomItems = filterByColorAndMaterial(
      bottomCategories.flatMap(category => categorizedClothings[category] || []),
      colorRecommendation.bottom,
      materialRecommendation.bottom
    ).filter(item => categoryRecommendation.bottom.length === 0 || categoryRecommendation.bottom.includes(item.category));

    const shoesItems = filterByColorAndMaterial(categorizedClothings['shoes'] || [], colorRecommendation.shoes, materialRecommendation.shoes);
    const dressItems = filterByColorAndMaterial(categorizedClothings['dress'] || [], colorRecommendation.dress, materialRecommendation.dress);
    const hatItems = filterByColorAndMaterial(categorizedClothings['hat'] || [], colorRecommendation.hat, materialRecommendation.hat);
    const outwearItems = filterByColorAndMaterial(categorizedClothings['outwear'] || [], colorRecommendation.outwear, materialRecommendation.outwear);

    // Check if outwear or hat are specified but not available
    if ((typeRecommendation.includes('hat') && hatItems.length === 0) || 
        (typeRecommendation.includes('outwear') && outwearItems.length === 0)) {
      return res.status(404).json({ error: 'No matching outfits found' });
    }

    // Generate outfit combinations
    const generateOutfits = (topItems, bottomItems, shoesItems, dressItems, hatItems, outwearItems, typeRecommendation) => {
      let outfits = [];

      const addOutwearAndHat = (outfit, outwearItem, hatItem) => {
        if (typeRecommendation.includes('outwear') && outwearItem) {
          outfit.outwear = outwearItem;
        }
        if (typeRecommendation.includes('hat') && hatItem) {
          outfit.hat = hatItem;
        }
        return outfit;
      };

      if (typeRecommendation.includes('dress')) {
        // Handle dress + shoes outfits
        dressItems.forEach(dress => {
          shoesItems.forEach(shoes => {
            (typeRecommendation.includes('outwear') ? outwearItems : [null]).forEach(outwearItem => {
              (typeRecommendation.includes('hat') ? hatItems : [null]).forEach(hatItem => {
                let outfit = {
                  dress: dress,
                  shoes: shoes,
                };
                outfit = addOutwearAndHat(outfit, outwearItem, hatItem);
                outfits.push(outfit);
              });
            });
          });
        });
      } else {
        // Handle top + bottom + shoes outfits
        topItems.forEach(top => {
          bottomItems.forEach(bottom => {
            shoesItems.forEach(shoes => {
              (typeRecommendation.includes('outwear') ? outwearItems : [null]).forEach(outwearItem => {
                (typeRecommendation.includes('hat') ? hatItems : [null]).forEach(hatItem => {
                  let outfit = {
                    top: top,
                    bottom: bottom,
                    shoes: shoes,
                  };
                  outfit = addOutwearAndHat(outfit, outwearItem, hatItem);
                  outfits.push(outfit);
                });
              });
            });
          });
        });
      }

      return outfits;
    };

    const outfits = generateOutfits(filteredTopItems, filteredBottomItems, shoesItems, dressItems, hatItems, outwearItems, typeRecommendation);

    if (outfits.length === 0) {
      return res.status(404).json({ error: 'No matching outfits found' });
    }

    // Shuffle the outfits array to randomize the order
    const shuffledOutfits = shuffleArray(outfits);

    res.json(shuffledOutfits);
  } catch (error) {
    console.error('Failed to filter clothings:', error);
    res.status(500).json({ error: 'Failed to filter clothings', message: error.message });
  }
};


const getFilteredClothingsByWeather = async (user_id, temperature, weatherCondition, shouldContainDress) => {
  try {
    const temperatureRanges = [
      { max: Infinity, min: 25, clothing: { 
          top: [{ category: 't-shirt', materials: ['cotton', 'linen', 'nylon', 'spandex', 'silk', 'satin', 'viscose' ] }, { category: 'shirt', materials: ['cotton', 'linen', 'nylon', 'silk', 'satin', 'viscose'] }],
          bottom: [{ category: 'shorts', materials: ['cotton', 'linen', 'nylon', 'polyester', 'spandex', 'viscose', 'silk' ] }, { category: 'skirt', materials: ['cotton', 'linen', 'nylon', 'polyester', 'silk', 'satin', 'viscose' ] }],
          hat: [{ category: 'hat', materials: ['cotton', 'linen', 'polyester'] }],
          shoes: [{ category: 'shoes', materials: ['cotton', 'linen', 'nylon', 'polyester', 'rubber', 'leather', 'suede'] }],
          dress: [{ category: 'dress', materials: ['cotton', 'linen', 'nylon', 'polyester', 'spandex', 'silk', 'satin', 'viscose' ] }]
        }
      },
      { max: 25, min: 20, clothing: { 
          top: [{ category: 't-shirt', materials: ['cotton', 'silk', 'nylon', 'spandex', 'silk', 'linen', 'satin', 'viscose' ] }, { category: 'shirt', materials: ['cotton', 'linen', 'nylon', 'silk', 'satin', 'viscose' ] }],
          bottom: [{ category: 'shorts', materials: ['cotton', 'linen', 'nylon', 'polyester', 'denim', 'leather', 'suede', 'spandex', 'linen', 'viscose', 'silk' ] }, { category: 'skirt', materials: ['cotton', 'linen', 'nylon', 'polyester', 'denim', 'leather', 'suede', 'silk', 'satin', 'viscose' ] }, { category: 'pants', materials: ['cotton', 'linen', 'nylon', 'spandex', 'viscose', 'silk' ] }],
          dress: [{ category: 'dress', materials: ['cotton', 'linen', 'nylon', 'polyester', 'spandex', 'silk', 'satin', 'viscose' ] }],
          shoes: [{ category: 'shoes', materials: ['cotton', 'linen', 'nylon', 'polyester', 'rubber', 'leather', 'suede' ] }]
        }
      },
      { max: 20, min: 15, clothing: { 
          top: [{ category: 'longsleeve', materials: ['cotton', 'wool', 'cashmere', 'polyester', 'spandex', 'silk', 'linen', 'viscose'] }, { category: 't-shirt', materials: ['cotton', 'wool', 'spandex', 'silk', 'linen'] }, { category: 'shirt', materials: ['cotton', 'denim', 'wool', 'silk', 'linen'] }],
          bottom: [{ category: 'pants', materials: ['denim', 'cotton', 'leather', 'suede', 'spandex', 'linen', 'silk'] }, { category: 'skirt', materials: ['denim', 'cotton', 'leather', 'suede', 'silk', 'linen'] }],
          shoes: [{ category: 'shoes', materials: ['leather', 'suede', 'denim', 'wool', 'polyester', 'linen', 'rubber'] }],
          outwear: [{ category: 'outwear', materials: ['denim', 'leather', 'suede', 'silk', 'linen', 'cotton'] }],
          dress: [{ category: 'dress', materials: ['cotton', 'wool', 'leather', 'suede', 'spandex', 'silk', 'linen'] }]
        }
      },
      { max: 15, min: 10, clothing: { 
          top: [{ category: 'longsleeve', materials: ['wool', 'cashmere', 'spandex', 'flannel', 'cotton'] }, { category: 't-shirt', materials: ['wool', 'cashmere', 'spandex', 'flannel', 'cotton'] }, { category: 'shirt', materials: ['denim', 'wool', 'flannel', 'cotton'] }],
          bottom: [{ category: 'pants', materials: ['denim', 'wool', 'leather', 'suede', 'spandex', 'flannel'] }, { category: 'skirt', materials: ['denim', 'wool', 'cashmere', 'leather', 'suede', 'flannel'] }],
          shoes: [{ category: 'shoes', materials: ['leather', 'suede', 'denim', 'wool', 'polyester', 'rubber'] }],
          outwear: [{ category: 'outwear', materials: ['wool', 'leather', 'suede', 'denim', 'spandex', 'silk', 'cotton'] }],
          dress: [{ category: 'dress', materials: ['wool', 'denim', 'cashmere', 'leather', 'suede', 'flannel'] }]
        }
      },
      { max: 10, min: 5, clothing: { 
          top: [{ category: 'longsleeve', materials: ['wool', 'cashmere', 'spandex', 'flannel'] }],
          bottom: [{ category: 'pants', materials: ['wool', 'denim', 'flannel', 'leather', 'suede'] }],
          shoes: [{ category: 'shoes', materials: ['leather', 'suede', 'denim', 'wool', 'polyester', 'rubber'] }],
          outwear: [{ category: 'outwear', materials: ['wool', 'leather', 'suede', 'flannel'] }]
        }
      },
      { max: 5, min: 0, clothing: { 
          top: [{ category: 'longsleeve', materials: ['wool', 'cashmere', 'flannel'] }],
          bottom: [{ category: 'pants', materials: ['wool', 'denim', 'flannel', 'leather', 'suede'] }],
          shoes: [{ category: 'shoes', materials: ['leather', 'suede', 'cashmere', 'wool', 'polyester', 'rubber'] }],
          hat: [{ category: 'hat', materials: ['wool'] }],
          outwear: [{ category: 'outwear', materials: ['wool', 'flannel'] }]
        }
      },
      { max: 0, min: -Infinity, clothing: { 
          top: [{ category: 'longsleeve', materials: ['wool', 'cashmere', 'flannel'] }],
          bottom: [{ category: 'pants', materials: ['wool', 'flannel'] }],
          shoes: [{ category: 'shoes', materials: ['leather', 'suede', 'cashmere', 'wool', 'polyester', 'rubber'] }],
          hat: [{ category: 'hat', materials: ['wool'] }],
          outwear: [{ category: 'outwear', materials: ['wool', 'flannel'] }]
        }
      }
    ];


    // Adjust temperature ranges based on weather conditions
    if (weatherCondition === 'Adverse') {
      temperatureRanges.forEach(range => {
        if (!range.clothing.outwear) {
          range.clothing.outwear = [{ category: 'outwear', materials: ['nylon', 'polyester'] }];
        } else {
          range.clothing.outwear.forEach(outwearItem => {
            const additionalMaterials = ['nylon', 'polyester'].filter(material => !outwearItem.materials.includes(material));
            outwearItem.materials.push(...additionalMaterials);
          });
        }
      });
    }

    // Determine clothing recommendations based on temperature
    const currentRange = temperatureRanges.find(range => temperature > range.min && temperature <= range.max);
    if (!currentRange) {
      throw new Error('Temperature range not found');
    }

    const { top, bottom, dress, hat, shoes, outwear } = currentRange.clothing;

    const filters = {
      user_id: user_id
    };

    // Fetch all matching clothes
    const baseQuery = {
      where: {
        ...filters,
        user_id: user_id,
        category: { [Op.in]: ['longsleeve', 't-shirt', 'shirt', 'pants', 'skirt', 'shorts', 'shoes', 'dress', 'hat', 'outwear'] },
      },
      include: [{
        model: ClothingImage,
        attributes: ['url']
      }]
    };

    const clothings = await Clothing.findAll(baseQuery);

    const filterByCategoryAndMaterial = (items, categories) => {
      if (!items || !categories) return [];
      return items.filter(item =>
        categories.some(category =>
          item.category === category.category &&
          category.materials.includes(item.material)
        )
      );
    };

    const categorizedClothings = clothings.reduce((acc, clothing) => {
      if (!acc[clothing.category]) {
        acc[clothing.category] = [];
      }
      acc[clothing.category].push(clothing);
      return acc;
    }, {});

    const filteredTopItems = filterByCategoryAndMaterial((categorizedClothings['t-shirt'] || []).concat(categorizedClothings['shirt'] || [], categorizedClothings['longsleeve'] || []), top);
    const filteredBottomItems = filterByCategoryAndMaterial((categorizedClothings['pants'] || []).concat(categorizedClothings['skirt'] || [], categorizedClothings['shorts'] || []), bottom);
    const filteredDressItems = filterByCategoryAndMaterial(categorizedClothings['dress'], dress);
    const filteredHatItems = filterByCategoryAndMaterial(categorizedClothings['hat'], hat);
    const filteredShoesItems = filterByCategoryAndMaterial(categorizedClothings['shoes'], shoes);
    let filteredOutwearItems = filterByCategoryAndMaterial(categorizedClothings['outwear'], outwear);

    // Ensure all relevant outerwear items are included
    if (weatherCondition === 'Adverse') {
      const additionalOutwearItems = clothings.filter(item => 
        item.category === 'outwear' && 
        ['nylon', 'polyester'].includes(item.material) && 
        !filteredOutwearItems.includes(item)
      );
      filteredOutwearItems = [...filteredOutwearItems, ...additionalOutwearItems];
    }

    // Log the filtered outwear items to debug
    console.log('Filtered Outwear Items:', filteredOutwearItems);

    // Generate outfit combinations
    const generateOutfits = (topItems, bottomItems, shoesItems, dressItems, hatItems, outwearItems, shouldContainDress) => {
      let outfits = [];

      const addOutwearAndHat = (outfit, outwearItem, hatItem) => {
        if (outwearItem) {
          outfit.outwear = outwearItem;
        }
        if (hatItem) {
          outfit.hat = hatItem;
        }
        return outfit;
      };

      const addDressOutfits = () => {
        dressItems.forEach(dress => {
          shoesItems.forEach(shoes => {
            if (outwearItems.length > 0) {
              outwearItems.forEach(outwearItem => {
                if (hatItems.length > 0) {
                  hatItems.forEach(hatItem => {
                    let outfit = { dress: dress, shoes: shoes };
                    outfit = addOutwearAndHat(outfit, outwearItem, hatItem);
                    outfits.push(outfit);
                  });
                } else {
                  let outfit = { dress: dress, shoes: shoes };
                  outfit = addOutwearAndHat(outfit, outwearItem, null);
                  outfits.push(outfit);
                }
              });
            } else {
              if (hatItems.length > 0) {
                hatItems.forEach(hatItem => {
                  let outfit = { dress: dress, shoes: shoes };
                  outfit = addOutwearAndHat(outfit, null, hatItem);
                  outfits.push(outfit);
                });
              } else {
                let outfit = { dress: dress, shoes: shoes };
                outfit = addOutwearAndHat(outfit, null, null);
                outfits.push(outfit);
              }
            }
          });
        });
      };

      const addTopBottomOutfits = () => {
        topItems.forEach(top => {
          bottomItems.forEach(bottom => {
            shoesItems.forEach(shoes => {
              if (outwearItems.length > 0) {
                outwearItems.forEach(outwearItem => {
                  if (hatItems.length > 0) {
                    hatItems.forEach(hatItem => {
                      let outfit = { top: top, bottom: bottom, shoes: shoes };
                      outfit = addOutwearAndHat(outfit, outwearItem, hatItem);
                      outfits.push(outfit);
                    });
                  } else {
                    let outfit = { top: top, bottom: bottom, shoes: shoes };
                    outfit = addOutwearAndHat(outfit, outwearItem, null);
                    outfits.push(outfit);
                  }
                });
              } else {
                if (hatItems.length > 0) {
                  hatItems.forEach(hatItem => {
                    let outfit = { top: top, bottom: bottom, shoes: shoes };
                    outfit = addOutwearAndHat(outfit, null, hatItem);
                    outfits.push(outfit);
                  });
                } else {
                  let outfit = { top: top, bottom: bottom, shoes: shoes };
                  outfit = addOutwearAndHat(outfit, null, null);
                  outfits.push(outfit);
                }
              }
            });
          });
        });
      };

      if (shouldContainDress && dressItems.length > 0) {
        addDressOutfits();
      } else {
        addTopBottomOutfits();
      }

      return outfits;
    };

    const outfits = generateOutfits(filteredTopItems, filteredBottomItems, filteredShoesItems, filteredDressItems, filteredHatItems, filteredOutwearItems, shouldContainDress);

    // Log the generated outfits to debug
    console.log('Generated Outfits:', outfits);

    return shuffleArray(outfits);

  } catch (error) {
    console.error('Failed to filter clothings by weather:', error);
    throw error;
  }
};

// Add filterClothingsByWeather function to the controller exports
const filterClothingsByWeather = async (req, res) => {
  const { user_id } = req.params;
  const { temperature, weatherCondition, shouldContainDress } = req.query;

  try {
    const filteredClothings = await getFilteredClothingsByWeather(user_id, parseFloat(temperature), weatherCondition, shouldContainDress === 'true');
    res.json(filteredClothings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to filter clothings by weather', message: error.message });
  }
};

  const filterClothingsByFilters = async (req, res) => {
    try {
      const { user_id } = req.params;
      const { categories, materials, colors, lastWornAt } = req.query;
  
      const filters = {
        user_id: user_id
      };
  
      if (categories) {
        filters.category = { [Op.in]: categories.split(',').filter(Boolean) };
      }
      if (materials) {
        filters.material = { [Op.in]: materials.split(',').filter(Boolean) };
      }
      if (colors) {
        filters.color = { [Op.in]: colors.split(',').filter(Boolean) };
      }
      if (lastWornAt && lastWornAt !== 'null') {
        filters.lastWornAt = { [Op.lte]: new Date(lastWornAt) };
      }
  
      const clothings = await Clothing.findAll({
        where: filters,
        include: [{
          model: ClothingImage,
          attributes: ['url'],
        },
        {
          model: Brand,
          attributes: ['name'],
        }]
      });
  
      res.json(clothings);
    } catch (error) {
      console.error('Failed to filter clothings:', error);
      res.status(500).json({ error: 'Failed to filter clothings', message: error.message });
    }
  };
  
  
  


module.exports = {
    Clothing,
    createClothing,
    getAllClothings,
    getAllClothingsForUser,
    getClothingById,
    updateClothing,
    deleteClothing,
    filterClothings,
    filterClothingsByWeather,
    filterClothingsByFilters,
}