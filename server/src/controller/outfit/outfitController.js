const {
    Outfit,
    Clothing,
    ClothingOutfit,
    OutfitImage,
    ClothingImage,
    OutfitHistory,
    sequelize,
} = require("../../config/database");

const { Op, json } = require("sequelize");

const validateClothingCategories = (clothings) => {
    
    const categories = clothings.map(item => item.category);

    const hasShoes = categories.filter(category => category === 'shoes').length === 1;
    const hasBottom = categories.filter(category => ['pants', 'skirt', 'shorts'].includes(category)).length === 1;
    const hasTop = categories.filter(category => ['shirt', 't-shirt', 'longsleeve'].includes(category)).length === 1;
    const hasDress = categories.filter(category => category === 'dress').length === 1;
    const hasOuterwear = categories.filter(category => category === 'outerwear').length <= 1;
    const hasHat = categories.filter(category => category === 'hat').length <= 1;

  // Valid outfit criteria
  const validOutfit = ((hasShoes && hasBottom && hasTop && !hasDress) || (hasDress && hasShoes && !hasBottom && !hasTop)) && hasOuterwear && hasHat;

  return validOutfit;
  };

  const checkUpdateDuplicateOutfit = async (clothingIds, excludeOutfitId) => {
    // Find all outfits that contain any of the clothing items
    const existingOutfits = await ClothingOutfit.findAll({
        where: {
        clothing_id: clothingIds
        },
        attributes: ['outfit_id'],
        group: ['outfit_id'],
        having: sequelize.literal(`COUNT(DISTINCT "clothing_id") = ${clothingIds.length}`) // Ensure the same number of clothing items
    });
    
    // Check if any of these outfits have the exact same clothing items
    for (const outfit of existingOutfits) {
        if (excludeOutfitId && outfit.outfit_id === excludeOutfitId) {
          continue; // Skip the outfit being updated
        }
    
        const outfitClothings = await ClothingOutfit.findAll({
          where: {
            outfit_id: outfit.outfit_id,
          },
          attributes: ['clothing_id'],
        });
    
    
        const outfitClothingIds = outfitClothings.map(item => item.clothing_id).sort();
        if (JSON.stringify(outfitClothingIds) === JSON.stringify(clothingIds.sort())) {
        return true; // Duplicate outfit found
            }
        }
        return false;
    };

    const checkUpdateDuplicateOutfitCall = async (req, res) => {
      const { clothingIds, excludeOutfitId } = req.body;
  
      try {
          const isDuplicate = await checkUpdateDuplicateOutfit(clothingIds, excludeOutfitId);
          res.status(200).json({ isDuplicate });
      } catch (error) {
          console.error("Error checking duplicate outfit during update:", error);
          res.status(500).json({ error: "Failed to check duplicate outfit during update" });
      }
  };

const checkDuplicateOutfit = async (clothingIds) => {
// Find all outfits that contain any of the clothing items
const existingOutfits = await ClothingOutfit.findAll({
    where: {
    clothing_id: clothingIds
    },
    attributes: ['outfit_id'],
    group: ['outfit_id'],
    having: sequelize.literal(`COUNT(DISTINCT "clothing_id") = ${clothingIds.length}`) // Ensure the same number of clothing items
});

// Check if any of these outfits have the exact same clothing items
for (const outfit of existingOutfits) {
    const outfitClothings = await ClothingOutfit.findAll({
    where: {
        outfit_id: outfit.outfit_id
    },
    attributes: ['clothing_id']
    });

    const outfitClothingIds = outfitClothings.map(item => item.clothing_id).sort();
    if (JSON.stringify(outfitClothingIds) === JSON.stringify(clothingIds.sort())) {
    return true; // Duplicate outfit found
        }
    }
    return false;
};

const createOutfit = async (req, res) => {
  const {
    link,
    name,
    description,
    ocassionType,
    user_id,
    clothings,
    isLiked
  } = req.body;

  if (!validateClothingCategories(clothings)) {
    return res.status(400).json({
      error: "Invalid outfit: Must include shoes and either (pants/skirt/shorts and shirt/t-shirt/longsleeve) or (dress and shoes)."
    });
  }

  const clothingIds = clothings.map(item => item.id);

  const isDuplicate = await checkDuplicateOutfit(clothingIds);
  if (isDuplicate) {
    return res.status(400).json({
      error: "Duplicate outfit: An outfit with the same set of clothing items already exists."
    });
  }

  if (!link) {
    throw new Error("No image file provided");
  }

  const outfitImage = await OutfitImage.create({
    url: link,
    label: name,
  });


  try {
    const outfit = await Outfit.create({
      name,
      description,
      ocassionType,
      user_id,
      outfit_image_id: outfitImage.id,
      lastWornAt: isLiked ? new Date() : null,
      isLiked
    });

    if (clothings && clothings.length > 0) {
      for (const item of clothings) {
        await ClothingOutfit.create({
          clothing_id: item.id,
          outfit_id: outfit.id
        });
      }
    }

    if (isLiked) {
      await updateClothingLastWornAt(clothingIds);
    }

    const createdOutfit = await Outfit.findOne({
      where: { id: outfit.id },
      include: [{
        model: Clothing,
        as: 'Clothings',
        through: {
          attributes: []
        }
      }]
    });

    res.status(201).json(createdOutfit);
  } catch (error) {
    console.error("Error creating outfit:", error);
    res.status(500).json({ error: "Failed to create outfit" });
  }
};

  const updateOutfit = async (req, res) => {
    const { id } = req.params;
    const { link, name, description, ocassionType, user_id, clothings } = req.body;
  
    // Validate clothing categories
    if (!validateClothingCategories(clothings)) {
      return res.status(400).json({ error: "Invalid outfit: Must include shoes and either (pants/skirt/shorts and shirt/t-shirt/longsleeve) or (dress and shoes)." });
    }
  
    const clothingIds = clothings.map(item => item.id);
  
    // Check for duplicate outfit, excluding the current outfit
    const isDuplicate = await checkUpdateDuplicateOutfit(clothingIds, id); // Pass the outfit ID to exclude
    if (isDuplicate) {
      return res.status(400).json({ error: "Duplicate outfit: An outfit with the same set of clothing items already exists." });
    }
  
    try {
      const outfit = await Outfit.findByPk(id);
  
      if (!outfit) {
        return res.status(404).json({ error: "Outfit not found" });
      }

      if (!link) {
        throw new Error("No image file provided");
      }
  
      const outfitImage = await OutfitImage.create({
        url: link,
        label: name,
      });
  
      await outfit.update({
        name,
        description,
        ocassionType,
        outfit_image_id: outfitImage.id,
        user_id,
        updated_at: new Date(),
      });
  
      // Remove existing ClothingOutfits entries for this outfit
      await ClothingOutfit.destroy({
        where: { outfit_id: outfit.id },
      });
  
      // Add new ClothingOutfits entries
      if (clothings && clothings.length > 0) {
        for (const item of clothings) {
          await ClothingOutfit.create({
            clothing_id: item.id,
            outfit_id: outfit.id,
          });
        }
      }
  
      const updatedOutfit = await Outfit.findOne({
        where: { id: outfit.id },
        include: [{
          model: Clothing,
          as: 'Clothings',
          through: {
            attributes: [],
          },
        }],
      });
  
      res.status(200).json(updatedOutfit);
    } catch (error) {
      console.error("Error updating outfit:", error);
      res.status(500).json({ error: "Failed to update outfit" });
    }
  };

  const getAllOutfits = async (req, res) => {
    try {
      const outfits = await Outfit.findAll({
        include: [{
          model: Clothing,
          as: 'Clothings',
          through: {
            attributes: []
          }
        }]
      });
  
      res.status(200).json(outfits);
    } catch (error) {
      console.error("Error fetching outfits:", error);
      res.status(500).json({ error: "Failed to fetch outfits" });
    }
  };

  const getAllOutfitsForUser = async (req, res) => {
    try {
      const { user_id } = req.params; // Assuming user_id is passed as a parameter
      console.log(user_id);
      
      let outfits = [];
      const userOutfits = await Outfit.findAll({
          where: {
              user_id: user_id
          },
          include: [
            {
              model: Clothing,
              as: 'Clothings',
              through: {
                attributes: []
              },
            },
            {
              model: OutfitImage,
              attributes: ['url']
            }
          ]
      });
  
      if (outfits.length === 0) {
        return res.json(userOutfits);
      } else {
        outfits = userOutfits;
      }
  
      res.json(outfits);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to fetch outfits", message: error.message });
    }
  };

  const getOutfitById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const outfit = await Outfit.findOne({
        where: { id },
        include: [{
          model: Clothing,
          as: 'Clothings',
          include: [
            {
              model: ClothingImage,
              as: 'ClothingImage',
              attributes: ['url'],
            },
          ],
          through: {
            attributes: []
          }
        }]
      });
  
      if (!outfit) {
        return res.status(404).json({ error: "Outfit not found" });
      }
  
      res.status(200).json(outfit);
    } catch (error) {
      console.error("Error fetching outfit:", error);
      res.status(500).json({ error: "Failed to fetch outfit" });
    }
  };

  const deleteOutfit = async (req, res) => {
    const { id } = req.params;
  
    try {
      const outfit = await Outfit.findOne({ where: { id } });
  
      if (!outfit) {
        return res.status(404).json({ error: "Outfit not found" });
      }
      
      await OutfitHistory.destroy({ where: { outfit_id: id } });
      await ClothingOutfit.destroy({ where: { outfit_id: id } });
      await Outfit.destroy({ where: { id } });
  
      res.status(200).json({ message: "Outfit deleted successfully" });
    } catch (error) {
      console.error("Error deleting outfit:", error);
      res.status(500).json({ error: "Failed to delete outfit" });
    }
  };
  
  const checkDuplicateOutfitCall = async (req, res) => {
    const { clothingIds } = req.body;

    try {
        const isDuplicate = await checkDuplicateOutfit(clothingIds);
        res.status(200).json({ isDuplicate });
    } catch (error) {
        console.error("Error checking duplicate outfit:", error);
        res.status(500).json({ error: "Failed to check duplicate outfit" });
    }
};

const toggleFavorite = async (req, res) => {
  const { id } = req.params;
  const { isFavorite } = req.body;

  try {
      const outfit = await Outfit.findByPk(id);

      if (!outfit) {
          return res.status(404).json({ error: "Outfit not found" });
      }

      await outfit.update({ isFavorite });

      res.status(200).json(outfit);
  } catch (error) {
      console.error("Error updating favorite status:", error);
      res.status(500).json({ error: "Failed to update favorite status" });
  }
};

const updateClothingLastWornAt = async (clothingIds) => {

  await Clothing.update(
    { lastWornAt: new Date() },
    { where: { id: clothingIds } }
  );
};


const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const filterOutfits = async (req, res) => {
  try {
    const { user_id } = req.params;
    const {
      typeRecommendation = [],
      colorRecommendation = {},
      materialRecommendation = {},
      categoryRecommendation = { top: [], bottom: [] }
    } = req.query;

    const clothingFilters = {
      user_id: user_id
    };

    // Fetch all clothing items matching the filters
    const clothings = await Clothing.findAll({
      where: clothingFilters,
      include: [{
        model: ClothingImage,
        attributes: ['url']
      }]
    });

    // Helper function to filter clothing items by category, color, and material
    const filterByCategoryColorMaterial = (items, categories = [], color, material) => {
      return items.filter(item =>
        (categories.length === 0 || categories.includes(item.category)) &&
        (!color || item.color === color) &&
        (!material || item.material === material)
      );
    };

    // Organize clothing items by category
    const categorizedClothings = clothings.reduce((acc, clothing) => {
      if (!acc[clothing.category]) {
        acc[clothing.category] = [];
      }
      acc[clothing.category].push(clothing);
      return acc;
    }, {});

    const filteredTopItems = filterByCategoryColorMaterial(
      (categorizedClothings['longsleeve'] || []).concat(categorizedClothings['t-shirt'] || [], categorizedClothings['shirt'] || []),
      categoryRecommendation.top || [],
      colorRecommendation.top,
      materialRecommendation.top
    );

    const filteredBottomItems = filterByCategoryColorMaterial(
      (categorizedClothings['pants'] || []).concat(categorizedClothings['skirt'] || [], categorizedClothings['shorts'] || []),
      categoryRecommendation.bottom || [],
      colorRecommendation.bottom,
      materialRecommendation.bottom
    );

    const shoesItems = filterByCategoryColorMaterial(
      categorizedClothings['shoes'] || [],
      [],
      colorRecommendation.shoes,
      materialRecommendation.shoes
    );

    const dressItems = filterByCategoryColorMaterial(
      categorizedClothings['dress'] || [],
      [],
      colorRecommendation.dress,
      materialRecommendation.dress
    );

    const hatItems = filterByCategoryColorMaterial(
      categorizedClothings['hat'] || [],
      [],
      colorRecommendation.hat,
      materialRecommendation.hat
    );

    const outwearItems = filterByCategoryColorMaterial(
      categorizedClothings['outwear'] || [],
      [],
      colorRecommendation.outwear,
      materialRecommendation.outwear
    );

    const filteredClothingIds = [
      ...filteredTopItems,
      ...filteredBottomItems,
      ...shoesItems,
      ...dressItems,
      ...hatItems,
      ...outwearItems
    ].map(item => item.id);

    // Fetch outfits containing the filtered clothing items
    const outfits = await Outfit.findAll({
      where: {
        user_id: user_id,
        [Op.or]: [
          { isLiked: true },
          { isLiked: null }
        ]
      },
      include: [
        {
          model: Clothing,
          as: 'Clothings',
          where: {
            id: { [Op.in]: filteredClothingIds }
          },
          include: [{
            model: ClothingImage,
            attributes: ['url']
          }]
        },
        {
          model: OutfitImage,
          attributes: ['url']
        }
      ]
    });

    // Filter out outfits that don't match the clothing criteria exactly
    const validOutfits = outfits.filter(outfit => {
      const clothingIds = outfit.Clothings.map(c => c.id);
      const containsTop = filteredTopItems.some(item => clothingIds.includes(item.id));
      const containsBottom = filteredBottomItems.some(item => clothingIds.includes(item.id));
      const containsShoes = shoesItems.some(item => clothingIds.includes(item.id));
      const containsDress = dressItems.some(item => clothingIds.includes(item.id));
      const containsHat = hatItems.some(item => clothingIds.includes(item.id));
      const containsOutwear = outwearItems.some(item => clothingIds.includes(item.id));

      // Check if outfit should contain dress
      if (typeRecommendation.includes('dress')) {
        return containsDress && containsShoes &&
          (!typeRecommendation.includes('hat') || containsHat) &&
          (!typeRecommendation.includes('outwear') || containsOutwear);
      }

      // Check if outfit should contain top and bottom
      return containsTop && containsBottom && containsShoes &&
        (!typeRecommendation.includes('hat') || containsHat) &&
        (!typeRecommendation.includes('outwear') || containsOutwear);
    });

    if (validOutfits.length === 0) {
      return res.status(404).json({ error: 'No matching outfits found' });
    }

    // Shuffle the outfits array to randomize the order
    const shuffledOutfits = shuffleArray(validOutfits);

    res.json(shuffledOutfits);
  } catch (error) {
    console.error('Failed to filter outfits:', error);
    res.status(500).json({ error: 'Failed to filter outfits', message: error.message });
  }
};

const getFilteredOutfitsByWeather = async (user_id, temperature, weatherCondition, shouldContainDress) => {
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
      user_id: user_id,
      isLiked: {
        [Op.or]: [true, null]
      }
    };

    // Fetch all matching outfits
    const baseQuery = {
      where: filters,
      include: [
        {
          model: Clothing,
          as: 'Clothings',
          include: [{
            model: ClothingImage,
            attributes: ['url']
          }]
        },
        {
          model: OutfitImage,
          attributes: ['url']
        }
      ]
    };

    const outfits = await Outfit.findAll(baseQuery);

    const filterByCategoryAndMaterial = (items, categories) => {
      if (!items || !categories) return [];
      return items.filter(item =>
        categories.some(category =>
          item.category === category.category &&
          category.materials.includes(item.material)
        )
      );
    };

    // Organize clothing items by category within outfits
    const categorizedClothings = outfits.reduce((acc, outfit) => {
      outfit.Clothings.forEach(clothing => {
        if (!acc[clothing.category]) {
          acc[clothing.category] = [];
        }
        acc[clothing.category].push(clothing);
      });
      return acc;
    }, {});

    const filteredTopItems = filterByCategoryAndMaterial(
      (categorizedClothings['t-shirt'] || []).concat(categorizedClothings['shirt'] || [], categorizedClothings['longsleeve'] || []),
      top
    );

    const filteredBottomItems = filterByCategoryAndMaterial(
      (categorizedClothings['pants'] || []).concat(categorizedClothings['skirt'] || [], categorizedClothings['shorts'] || []),
      bottom
    );

    const filteredDressItems = filterByCategoryAndMaterial(categorizedClothings['dress'], dress);
    const filteredHatItems = filterByCategoryAndMaterial(categorizedClothings['hat'], hat);
    const filteredShoesItems = filterByCategoryAndMaterial(categorizedClothings['shoes'], shoes);
    let filteredOutwearItems = filterByCategoryAndMaterial(categorizedClothings['outwear'], outwear);

    // Ensure all relevant outerwear items are included if Adverse weather condition
    if (weatherCondition === 'Adverse') {
      const additionalOutwearItems = outfits.reduce((acc, outfit) => {
        outfit.Clothings.forEach(item => {
          if (item.category === 'outwear' && ['nylon', 'polyester'].includes(item.material) && !filteredOutwearItems.includes(item)) {
            acc.push(item);
          }
        });
        return acc;
      }, []);
      filteredOutwearItems = [...filteredOutwearItems, ...additionalOutwearItems];
    }

    // Filter valid outfits based on the temperature range and weather condition
    const validOutfits = outfits.filter(outfit => {
      const clothingIds = outfit.Clothings.map(c => c.id);
      const containsTop = filteredTopItems.length > 0 ? filteredTopItems.some(item => clothingIds.includes(item.id)) : true;
      const containsBottom = filteredBottomItems.length > 0 ? filteredBottomItems.some(item => clothingIds.includes(item.id)) : true;
      const containsShoes = filteredShoesItems.length > 0 ? filteredShoesItems.some(item => clothingIds.includes(item.id)) : true;
      const containsDress = filteredDressItems.length > 0 ? filteredDressItems.some(item => clothingIds.includes(item.id)) : true;
      const containsHat = hat ? filteredHatItems.some(item => clothingIds.includes(item.id)) : true;
      const containsOutwear = (weatherCondition === 'Adverse' || outwear) ? filteredOutwearItems.some(item => clothingIds.includes(item.id)) : !categorizedClothings['outwear']?.some(item => clothingIds.includes(item.id));

      if (shouldContainDress) {
        return containsDress && containsShoes && containsHat && containsOutwear;
      }

      return containsTop && containsBottom && containsShoes && containsHat && containsOutwear;
    });

    // Log the filtered outfits to debug
    console.log('Filtered Outfits:', validOutfits);

    return validOutfits;
  } catch (error) {
    console.error('Failed to filter outfits by weather:', error);
    throw error;
  }
};

// Add filterOutfitsByWeather function to the controller exports
const filterOutfitsByWeather = async (req, res) => {
  const { user_id } = req.params;
  const { temperature, weatherCondition, shouldContainDress } = req.query;

  try {
    const filteredOutfits = await getFilteredOutfitsByWeather(
      user_id, 
      parseFloat(temperature), 
      weatherCondition, 
      shouldContainDress === 'true'
    );
    res.json(filteredOutfits);
  } catch (error) {
    res.status(500).json({ error: 'Failed to filter outfits by weather', message: error.message });
  }
};






const filterDislikedOutfits = async (req, res) => {
  try {
    const { user_id } = req.params;
    const {
      typeRecommendation = [],
      colorRecommendation = {},
      materialRecommendation = {},
      categoryRecommendation = { top: [], bottom: [] }
    } = req.query;

    const clothingFilters = {
      user_id: user_id
    };

    // Fetch all clothing items matching the filters
    const clothings = await Clothing.findAll({
      where: clothingFilters,
      include: [{
        model: ClothingImage,
        attributes: ['url']
      }]
    });

    // Helper function to filter clothing items by category, color, and material
    const filterByCategoryColorMaterial = (items, categories = [], color, material) => {
      return items.filter(item =>
        (categories.length === 0 || categories.includes(item.category)) &&
        (!color || item.color === color) &&
        (!material || item.material === material)
      );
    };

    // Organize clothing items by category
    const categorizedClothings = clothings.reduce((acc, clothing) => {
      if (!acc[clothing.category]) {
        acc[clothing.category] = [];
      }
      acc[clothing.category].push(clothing);
      return acc;
    }, {});

    const filteredTopItems = filterByCategoryColorMaterial(
      (categorizedClothings['longsleeve'] || []).concat(categorizedClothings['t-shirt'] || [], categorizedClothings['shirt'] || []),
      categoryRecommendation.top || [],
      colorRecommendation.top,
      materialRecommendation.top
    );

    const filteredBottomItems = filterByCategoryColorMaterial(
      (categorizedClothings['pants'] || []).concat(categorizedClothings['skirt'] || [], categorizedClothings['shorts'] || []),
      categoryRecommendation.bottom || [],
      colorRecommendation.bottom,
      materialRecommendation.bottom
    );

    const shoesItems = filterByCategoryColorMaterial(
      categorizedClothings['shoes'] || [],
      [],
      colorRecommendation.shoes,
      materialRecommendation.shoes
    );

    const dressItems = filterByCategoryColorMaterial(
      categorizedClothings['dress'] || [],
      [],
      colorRecommendation.dress,
      materialRecommendation.dress
    );

    const hatItems = filterByCategoryColorMaterial(
      categorizedClothings['hat'] || [],
      [],
      colorRecommendation.hat,
      materialRecommendation.hat
    );

    const outwearItems = filterByCategoryColorMaterial(
      categorizedClothings['outwear'] || [],
      [],
      colorRecommendation.outwear,
      materialRecommendation.outwear
    );

    const filteredClothingIds = [
      ...filteredTopItems,
      ...filteredBottomItems,
      ...shoesItems,
      ...dressItems,
      ...hatItems,
      ...outwearItems
    ].map(item => item.id);

    // Fetch outfits containing the filtered clothing items
    const outfits = await Outfit.findAll({
      where: {
        user_id: user_id,
        [Op.or]: [
          { isLiked: false },
        ]
      },
      include: [
        {
          model: Clothing,
          as: 'Clothings',
          where: {
            id: { [Op.in]: filteredClothingIds }
          },
          include: [{
            model: ClothingImage,
            attributes: ['url']
          }]
        },
        {
          model: OutfitImage,
          attributes: ['url']
        }
      ]
    });

    // Filter out outfits that don't match the clothing criteria exactly
    const validOutfits = outfits.filter(outfit => {
      const clothingIds = outfit.Clothings.map(c => c.id);
      const containsTop = filteredTopItems.some(item => clothingIds.includes(item.id));
      const containsBottom = filteredBottomItems.some(item => clothingIds.includes(item.id));
      const containsShoes = shoesItems.some(item => clothingIds.includes(item.id));
      const containsDress = dressItems.some(item => clothingIds.includes(item.id));
      const containsHat = hatItems.some(item => clothingIds.includes(item.id));
      const containsOutwear = outwearItems.some(item => clothingIds.includes(item.id));

      // Check if outfit should contain dress
      if (typeRecommendation.includes('dress')) {
        return containsDress && containsShoes &&
          (!typeRecommendation.includes('hat') || containsHat) &&
          (!typeRecommendation.includes('outwear') || containsOutwear);
      }

      // Check if outfit should contain top and bottom
      return containsTop && containsBottom && containsShoes &&
        (!typeRecommendation.includes('hat') || containsHat) &&
        (!typeRecommendation.includes('outwear') || containsOutwear);
    });

    if (validOutfits.length === 0) {
      return res.status(404).json({ error: 'No matching outfits found' });
    }

    // Shuffle the outfits array to randomize the order
    const shuffledOutfits = shuffleArray(validOutfits);

    res.json(shuffledOutfits);
  } catch (error) {
    console.error('Failed to filter outfits:', error);
    res.status(500).json({ error: 'Failed to filter outfits', message: error.message });
  }
};

const getFilteredDislikedOutfitsByWeather = async (user_id, temperature, weatherCondition, shouldContainDress) => {
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
      user_id: user_id,
      isLiked: {
        [Op.or]: [false]
      }
    };

    // Fetch all matching outfits
    const baseQuery = {
      where: filters,
      include: [
        {
          model: Clothing,
          as: 'Clothings',
          include: [{
            model: ClothingImage,
            attributes: ['url']
          }]
        },
        {
          model: OutfitImage,
          attributes: ['url']
        }
      ]
    };

    const outfits = await Outfit.findAll(baseQuery);

    const filterByCategoryAndMaterial = (items, categories) => {
      if (!items || !categories) return [];
      return items.filter(item =>
        categories.some(category =>
          item.category === category.category &&
          category.materials.includes(item.material)
        )
      );
    };

    // Organize clothing items by category within outfits
    const categorizedClothings = outfits.reduce((acc, outfit) => {
      outfit.Clothings.forEach(clothing => {
        if (!acc[clothing.category]) {
          acc[clothing.category] = [];
        }
        acc[clothing.category].push(clothing);
      });
      return acc;
    }, {});

    const filteredTopItems = filterByCategoryAndMaterial(
      (categorizedClothings['t-shirt'] || []).concat(categorizedClothings['shirt'] || [], categorizedClothings['longsleeve'] || []),
      top
    );

    const filteredBottomItems = filterByCategoryAndMaterial(
      (categorizedClothings['pants'] || []).concat(categorizedClothings['skirt'] || [], categorizedClothings['shorts'] || []),
      bottom
    );

    const filteredDressItems = filterByCategoryAndMaterial(categorizedClothings['dress'], dress);
    const filteredHatItems = filterByCategoryAndMaterial(categorizedClothings['hat'], hat);
    const filteredShoesItems = filterByCategoryAndMaterial(categorizedClothings['shoes'], shoes);
    let filteredOutwearItems = filterByCategoryAndMaterial(categorizedClothings['outwear'], outwear);

    // Ensure all relevant outerwear items are included if Adverse weather condition
    if (weatherCondition === 'Adverse') {
      const additionalOutwearItems = outfits.reduce((acc, outfit) => {
        outfit.Clothings.forEach(item => {
          if (item.category === 'outwear' && ['nylon', 'polyester'].includes(item.material) && !filteredOutwearItems.includes(item)) {
            acc.push(item);
          }
        });
        return acc;
      }, []);
      filteredOutwearItems = [...filteredOutwearItems, ...additionalOutwearItems];
    }

    // Filter valid outfits based on the temperature range and weather condition
    const validOutfits = outfits.filter(outfit => {
      const clothingIds = outfit.Clothings.map(c => c.id);
      const containsTop = filteredTopItems.length > 0 ? filteredTopItems.some(item => clothingIds.includes(item.id)) : true;
      const containsBottom = filteredBottomItems.length > 0 ? filteredBottomItems.some(item => clothingIds.includes(item.id)) : true;
      const containsShoes = filteredShoesItems.length > 0 ? filteredShoesItems.some(item => clothingIds.includes(item.id)) : true;
      const containsDress = filteredDressItems.length > 0 ? filteredDressItems.some(item => clothingIds.includes(item.id)) : true;
      const containsHat = hat ? filteredHatItems.some(item => clothingIds.includes(item.id)) : true;
      const containsOutwear = (weatherCondition === 'Adverse' || outwear) ? filteredOutwearItems.some(item => clothingIds.includes(item.id)) : !categorizedClothings['outwear']?.some(item => clothingIds.includes(item.id));

      if (shouldContainDress) {
        return containsDress && containsShoes && containsHat && containsOutwear;
      }

      return containsTop && containsBottom && containsShoes && containsHat && containsOutwear;
    });

    // Log the filtered outfits to debug
    console.log('Filtered Outfits:', validOutfits);

    return validOutfits;
  } catch (error) {
    console.error('Failed to filter outfits by weather:', error);
    throw error;
  }
};

const likeOutfit = async (req, res) => {
  const { id } = req.params;
  const { isLiked, lastWornAt } = req.body;

  try {
    // Start a transaction
    const transaction = await sequelize.transaction();

    // Update the outfit
    await Outfit.update(
      { isLiked, lastWornAt },
      { where: { id }, transaction }
    );

    // Find the outfit to get its associated clothing items
    const outfit = await Outfit.findByPk(id, {
      include: [{ model: Clothing, as: 'Clothings' }],
      transaction
    });

    // Update lastWornAt for each clothing item
    const clothingIds = outfit.Clothings.map(c => c.id);
    await Clothing.update(
      { lastWornAt },
      { where: { id: { [Op.in]: clothingIds } }, transaction }
    );

    // Commit the transaction
    await transaction.commit();

    res.status(200).json({ message: "Outfit liked successfully" });
  } catch (error) {
    // Rollback the transaction in case of an error
    if (transaction) await transaction.rollback();

    res.status(500).json({ error: "Failed to like outfit", message: error.message });
  }
};

const filterOutfitsByFilters = async (req, res) => {
  try {
      const { user_id } = req.params;
      const { occasions, lastWornAt, clothingCategories, favorite } = req.query;

      const filters = {
          user_id: user_id,
          [Op.or]: [
              { isLiked: true },
              { isLiked: null }
          ]
      };

      if (occasions) {
          filters.ocassionType = { [Op.in]: occasions.split(',').filter(Boolean) };
      }
      if (lastWornAt && lastWornAt !== 'null') {
          filters.lastWornAt = { [Op.lte]: new Date(lastWornAt) };
      }
      if (favorite === 'true') {
          filters.isFavorite = true;
      }

      const clothingCategoryFilters = clothingCategories ? clothingCategories.split(',').filter(Boolean) : [];

      if (clothingCategoryFilters.length > 0) {
          const topCategories = clothingCategoryFilters.filter(cat => ['longsleeve', 'shirt', 't-shirt'].includes(cat));
          const bottomCategories = clothingCategoryFilters.filter(cat => ['pants', 'skirt', 'shorts'].includes(cat));

          if (topCategories.length > 0 && bottomCategories.length > 0) {
              const outfits = await Outfit.findAll({
                  where: filters,
                  include: [
                      {
                          model: Clothing,
                          as: 'Clothings',
                          include: [{
                              model: ClothingImage,
                              attributes: ['url']
                          }]
                      },
                      {
                          model: OutfitImage,
                          attributes: ['url']
                      }
                  ]
              });

              const validOutfits = outfits.filter(outfit => {
                  const clothingIds = outfit.Clothings.map(c => c.id);
                  const containsTop = topCategories.some(cat => outfit.Clothings.some(c => c.category === cat));
                  const containsBottom = bottomCategories.some(cat => outfit.Clothings.some(c => c.category === cat));
                  return containsTop && containsBottom;
              });

              return res.json(validOutfits);
          }
      }

      const outfits = await Outfit.findAll({
          where: filters,
          include: [
              {
                  model: Clothing,
                  as: 'Clothings',
                  where: clothingCategoryFilters.length ? { category: { [Op.in]: clothingCategoryFilters } } : {},
                  include: [{
                      model: ClothingImage,
                      attributes: ['url']
                  }]
              },
              {
                  model: OutfitImage,
                  attributes: ['url']
              }
          ]
      });

      res.json(outfits);
  } catch (error) {
      console.error('Failed to filter outfits:', error);
      res.status(500).json({ error: 'Failed to filter outfits', message: error.message });
  }
};

module.exports = {
    Outfit,
    createOutfit,
    updateOutfit,
    getAllOutfits,
    getOutfitById,
    deleteOutfit,
    checkDuplicateOutfitCall,
    checkUpdateDuplicateOutfitCall,
    getAllOutfitsForUser,
    toggleFavorite,
    filterOutfits,
    filterOutfitsByWeather,
    filterDislikedOutfits,
    getFilteredDislikedOutfitsByWeather,
    likeOutfit,
    filterOutfitsByFilters,
};
