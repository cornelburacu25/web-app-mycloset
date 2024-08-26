const axios = require("axios");
const FormData = require("form-data");
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_KEY;

const uploadToImgur = async (req, res) => {
  const formData = new FormData();
  formData.append("image", req.file.buffer);

  console.log("fileBuffer.buffer", req.file.buffer);
  const response = await axios.post("https://api.imgur.com/3/image", formData, {
    headers: {
      Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
      ...formData.getHeaders(),
    },
  });

  console.log("response.data.data", response.data.data);
  return res.status(201).json({ link: response.data.data.link });
};

module.exports = {
  uploadToImgur,
};
