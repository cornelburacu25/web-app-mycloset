const express = require("express");
const router = express.Router();
const clothingController = require("../../controller/clothing/clothingController");
const chartQueries = require("../../controller/clothing/chartQueries");

router.post("/clothings", clothingController.createClothing);
router.get("/clothings", clothingController.getAllClothings);
router.get("/yourclothings/:user_id", clothingController.getAllClothingsForUser);
router.get("/filter-clothings/:user_id", clothingController.filterClothings);
router.get("/filter-clothings-by-weather/:user_id", clothingController.filterClothingsByWeather);
router.get("/filter-clothings-by-filters/:user_id", clothingController.filterClothingsByFilters);
router.get("/clothings/:id", clothingController.getClothingById);
router.put("/clothings/:id", clothingController.updateClothing);
router.delete("/clothings/:id", clothingController.deleteClothing);

router.get("/most-owned-categories/:user_id", chartQueries.getMostOwnedCategories);
router.get("/most-worn-categories/:user_id", chartQueries.getMostWornCategories);
router.get("/most-owned-colors/:user_id", chartQueries.getMostOwnedColors);
router.get("/most-worn-colors/:user_id", chartQueries.getMostWornColors);
router.get("/most-owned-materials/:user_id", chartQueries.getMostOwnedMaterials);
router.get("/most-worn-materials/:user_id", chartQueries.getMostWornMaterials);
module.exports = router;