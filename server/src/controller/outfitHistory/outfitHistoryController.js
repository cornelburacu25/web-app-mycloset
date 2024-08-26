const { OutfitHistory, Outfit, User, OutfitImage, sequelize, Clothing } = require("../../config/database");
const moment = require('moment');
const { Op } = require('sequelize');

const createOutfitHistory = async (req, res) => {
  const { outfit_id, user_id } = req.body;

  const transaction = await sequelize.transaction();
  
  try {
    // Validate if the outfit and user exist
    const outfit = await Outfit.findByPk(outfit_id, {
      include: [{ model: Clothing, as: 'Clothings' }]
    });
    const user = await User.findByPk(user_id);

    if (!outfit) {
      return res.status(404).json({ error: `Outfit with id ${outfit_id} does not exist` });
    }

    if (!user) {
      return res.status(404).json({ error: `User with id ${user_id} does not exist` });
    }

    // Increment the number of wears for the outfit
    await outfit.increment('numberOfWears', { by: 1, transaction });

    // Increment the number of wears for each associated clothing
    for (const clothing of outfit.Clothings) {
      await clothing.increment('numberOfWears', { by: 1, transaction });
    }

    // Create the outfit history record
    const outfitHistory = await OutfitHistory.create({
      outfit_id,
      user_id,
      wornAt: new Date()
    }, { transaction });

    await transaction.commit();
    
    return res.status(201).json(outfitHistory);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating outfit history:', error);
    return res.status(500).json({ error: 'An error occurred while creating the outfit history' });
  }
};
  
  const deleteOutfitHistory = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find the outfit history record by id
      const outfitHistory = await OutfitHistory.findByPk(id);
  
      if (!outfitHistory) {
        return res.status(404).json({ error: `OutfitHistory with id ${id} does not exist` });
      }
  
      // Delete the outfit history record
      await outfitHistory.destroy();
  
      return res.status(200).json({ message: `OutfitHistory with id ${id} has been deleted` });
    } catch (error) {
      console.error('Error deleting outfit history:', error);
      return res.status(500).json({ error: 'An error occurred while deleting the outfit history' });
    }
  };

  const getOutfitHistory = async (req, res) => {
    const { user_id } = req.params;
    const currentDate = moment().startOf('day');
  
    try {
      // Find the outfit history record for today
      const outfitHistory = await OutfitHistory.findOne({
        where: {
          user_id,
          wornAt: {
            [Op.between]: [currentDate.toDate(), currentDate.endOf('day').toDate()]
          }
        },
        include: [
          {
            model: Outfit,
            include: [
              {
                model: OutfitImage,
                attributes: ['url'] 
              }
            ]
          }
        ]
      });
  
      if (!outfitHistory) {
        return res.status(200).json(false);
      }
  
      return res.status(200).json(outfitHistory);
    } catch (error) {
      console.error('Error getting outfit history:', error);
      return res.status(500).json({ error: 'An error occurred while retrieving the outfit history' });
    }
  };
  
  module.exports = { createOutfitHistory, deleteOutfitHistory, getOutfitHistory };