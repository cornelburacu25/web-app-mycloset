const { Clothing, Brand, ClothingImage, sequelize, ClothingOutfit, OutfitHistory, Outfit } = require("../../config/database");

const getMostOwnedCategories = async (req, res) => {
    try {
      const { user_id } = req.params;
  
      const mostOwnedCategories = await Clothing.findAll({
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('category')), 'count']
        ],
        where: { user_id: user_id },
        group: ['category'],
        order: [[sequelize.literal('count'), 'DESC']],
      });
  
      res.json({ mostOwnedCategories });
    } catch (error) {
      console.error('Failed to fetch categories', error);
      res.status(500).json({ error: 'Failed to fetch categories', message: error.message });
    }
  };

  const getMostWornCategories = async (req, res) => {
    try {
      const { user_id } = req.params;
  
      const mostWornCategories = await Clothing.findAll({
        attributes: [
          'category',
          [sequelize.fn('SUM', sequelize.col('numberOfWears')), 'totalWears']
        ],
        where: { user_id: user_id },
        group: ['category'],
        order: [[sequelize.literal('SUM("numberOfWears")'), 'DESC']],
      });
  
      res.json({ mostWornCategories });
    } catch (error) {
      console.error('Failed to fetch categories', error);
      res.status(500).json({ error: 'Failed to fetch categories', message: error.message });
    }
  };

const getMostOwnedColors = async (req, res) => {
    try {
        const { user_id } = req.params;

        const mostOwnedColors = await Clothing.findAll({
            attributes: [
                'color',
                [sequelize.fn('COUNT', sequelize.col('color')), 'count']
            ],
            where: { user_id: user_id },
            group: ['color'],
            order: [[sequelize.literal('count'), 'DESC']],
        });

        res.json({ mostOwnedColors });
    } catch (error) {
        console.error('Failed to fetch colors', error);
        res.status(500).json({ error: 'Failed to fetch colors', message: error.message });
    }
};

const getMostWornColors = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Query to get the sum of wears for each color
        const mostWornColors = await Clothing.findAll({
            attributes: [
                'color',
                [sequelize.fn('SUM', sequelize.col('numberOfWears')), 'totalWears']
            ],
            where: { user_id: user_id },
            group: ['color'],
            order: [[sequelize.literal('SUM("numberOfWears")'), 'DESC']],
        });

        res.json({ mostWornColors });
    } catch (error) {
        console.error('Failed to fetch colors', error);
        res.status(500).json({ error: 'Failed to fetch colors', message: error.message });
    }
};

const getMostOwnedMaterials = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Query to get the count of each material
        const mostOwnedMaterials = await Clothing.findAll({
            attributes: [
                'material',
                [sequelize.fn('COUNT', sequelize.col('material')), 'count']
            ],
            where: { user_id: user_id },
            group: ['material'],
            order: [[sequelize.literal('count'), 'DESC']],
        });

        res.json({ mostOwnedMaterials });
    } catch (error) {
        console.error('Failed to fetch materials', error);
        res.status(500).json({ error: 'Failed to fetch materials', message: error.message });
    }
};

const getMostWornMaterials = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Query to get the sum of wears for each material
        const mostWornMaterials = await Clothing.findAll({
            attributes: [
                'material',
                [sequelize.fn('SUM', sequelize.col('numberOfWears')), 'totalWears']
            ],
            where: { user_id: user_id },
            group: ['material'],
            order: [[sequelize.literal('SUM("numberOfWears")'), 'DESC']],
        });

        res.json({ mostWornMaterials });
    } catch (error) {
        console.error('Failed to fetch materials', error);
        res.status(500).json({ error: 'Failed to fetch materials', message: error.message });
    }
};
  
module.exports = { 
    getMostOwnedCategories,
    getMostWornCategories,
    getMostOwnedColors,
    getMostWornColors,
    getMostOwnedMaterials,
    getMostWornMaterials,
 };