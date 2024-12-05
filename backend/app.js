const express = require('express');
const multer = require('multer');
const potrace = require('potrace');
const fs = require('fs');
const path = require('path');

// Set up the server
const app = express();
const port = 3000;

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder where the uploaded image will be saved
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use original file name
  },
});

const upload = multer({ storage: storage });

// Route for uploading and converting the image
app.post('/convert', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const imagePath = path.join(__dirname, 'uploads', req.file.filename);

  potrace.trace(imagePath, (err, svg) => {
    if (err) {
      return res.status(500).send('Error converting image: ' + err.message);
    }

    // Send the converted SVG as the response
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);

    // Optionally, remove the uploaded file after conversion
    fs.unlinkSync(imagePath);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
