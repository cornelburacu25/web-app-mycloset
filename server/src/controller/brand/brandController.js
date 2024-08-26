const { Brand } = require("../../config/database");

const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll();
    res.json(brands);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Failed to fetch brands", message: error.message });
  }
};

const getBrandById = async (req, res) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findByPk(id);
    if (brand) {
      res.json(brand);
    } else {
      console.log(error);
      res.status(404).json({ error: "Brand not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch brand", message: error.message });
  }
};

const createBrand = async (req, res) => {
  try {
    const { name } = req.body;
    const brand = await Brand.create({
      name,
    });
    res.status(201).json(brand);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Failed to create brand", message: error.message });
  }
};

const updateBrand = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const brand = await Brand.findByPk(id);
    if (brand) {
      await brand.update({
        name,
      });
      res.json(brand);
    } else {
      res.status(404).json({ error: "Brand not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update brand", message: error.message });
  }
};

const deleteBrand = async (req, res) => {
    const { id } = req.params;
    try {
        const brand = await Brand.findOne({
            where: { id: id },
        });

        if (brand) {
            await brand.destroy();
            res.json({ message: "Brand deleted successfully" });
        } else {
            res.status(404).json({ error: "Brand not found" });
        }
    } catch (error) {
        
        console.error(error);
        res.status(500).json({ error: "Failed to delete brand" });
    }
};

module.exports = {
  Brand,
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};
