import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests

const UploadAndDisplayImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null); // Initialize processedImage state

  const handleUpload = () => {
    if (!selectedImage) {
      console.error("No image selected");
      return;
    }
  
    const formData = new FormData();
    formData.append('image_file', selectedImage);
  
    axios.post('http://127.0.0.1:8000/remove_background/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set correct content type
      },
      responseType: 'arraybuffer'
    })
    .then(removeBackgroundResponse => {
      console.log("Image background removed successfully:", removeBackgroundResponse);
  
      // Now that the background is removed, extract the image data from the response
      const processedImageBlob = new Blob([removeBackgroundResponse.data], { type: 'image/png' });

      // Upload the processed image to your server
      const uploadFormData = new FormData();
      uploadFormData.append('image', processedImageBlob);

      axios.post('http://localhost:9000/mycloset/upload', uploadFormData)
        .then(uploadResponse => {
          console.log("Processed image uploaded successfully:", uploadResponse.data);
          // Set the processedImage state with the URL of the processed image
          setProcessedImage(URL.createObjectURL(processedImageBlob));
        })
        .catch(uploadError => {
          console.error("Error uploading processed image:", uploadError);
          // Optionally, you can handle errors here
        });
    })
    .catch(removeBackgroundError => {
      console.error("Error removing background:", removeBackgroundError);
      // Optionally, you can handle errors here
    });
  };

  return (
    <div>
      <h1>Upload and Display Image using React Hooks</h1>

      {/* Display selected image */}
      {selectedImage && (
        <div>
          <img
            alt="Selected"
            width={"250px"}
            src={URL.createObjectURL(selectedImage)}
          />
        </div>
      )}

      {/* Display processed image (with background removed) */}
      {processedImage && (
        <div>
          <h2>Processed Image</h2>
          <img
            alt="Processed"
            width={"250px"}
            src={processedImage}
          />
        </div>
      )}

      <br />
      <br />

      {/* Input for selecting image */}
      <input
        type="file"
        name="myImage"
        onChange={(event) => {
          console.log(event.target.files[0]);
          setSelectedImage(event.target.files[0]);
        }}
      />
      
      <br />
      <br />

      {/* Upload button */}
      <button onClick={handleUpload}>Remove Background & Upload</button>
    </div>
  );
};

export default UploadAndDisplayImage;
