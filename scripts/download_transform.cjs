const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp');

var jsonData = require("../public/eotai_images.json");

const outputDirectory = './webp_images';
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory);
}

// Function to download and transform images
async function downloadAndTransformImages() {
  for (const item of jsonData) {
    const { id, url } = item;
    const filename = `${id}.webp`;

    // Download the image
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageData = response.data;

    // Transform and save as webp
    await sharp(imageData)
      .webp()
      .toFile(`${outputDirectory}/${filename}`);

    console.log(`Image ${id} downloaded and transformed to ${filename}`);
  }
}

// Execute the function
downloadAndTransformImages().catch((error) => {
  console.error('Error:', error);
});
