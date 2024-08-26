const express = require("express");
const app = express();
const cors = require("cors");
const clear = require("clear");
const userRoutes = require("./src/routes/user/userRoute");
const brandRoutes = require("./src/routes/brand/brandRoute");
const uploadImageRoutes = require("./src/routes/upload/uploadRoute");
const clothingRoutes = require("./src/routes/clothing/clothingRoute");
const outfitRoutes = require("./src/routes/outfit/outfitRoute");
const outfitHistoryRoutes = require("./src/routes/outfitHistoryRoute/outfitHistoryRoute");
const weatherRoutes = require("./src/routes/weather/weatherRoute");
const verifyToken = require("./src/middleware/jwt-verification");
const logger = require("./src/middleware/logger");

app.use(express.json());
app.use(cors());
app.use(logger);

app.use("/mycloset", userRoutes);
app.use("/mycloset", brandRoutes);
app.use("/mycloset", uploadImageRoutes);
app.use("/mycloset", clothingRoutes);
app.use("/mycloset", outfitRoutes);
app.use("/mycloset", outfitHistoryRoutes);
app.use("/mycloset", weatherRoutes);

app.use("/mycloset", verifyToken);

const port = 9000;
app.listen(port, () => {
    clear();
    console.log(`Server is running on port ${port}`);
});