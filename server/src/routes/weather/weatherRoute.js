const express = require("express");
weatherController = require("../../controller/weather/weatherController");
const router = express.Router();

router.get('/weather/location', weatherController.getWeatherByLocation);
router.get('/weather/city', weatherController.getWeatherByCity);
router.get('/geolocation', weatherController.getGeolocation);

module.exports = router;
