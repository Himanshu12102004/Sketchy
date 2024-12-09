const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');
const cors = require('cors');
const removeBg = require('./removeBg');
const app = express();
app.use(cors());
const port = 3000;
const upload = multer({ dest: 'uploads/' });
app.post('/convert', upload.single('image'), async (req, res) => {
  const imagePath = req.file.path;
  const processedPath = `uploads/processed-${req.file.filename}.png`;
  const bg = `./uploads/no-bg.png`;
  try {
    await removeBg(imagePath);
    await sharp(bg)
      .resize(500)
      .grayscale()
      .threshold(128)
      .toFile(processedPath);
    potrace.trace(
      processedPath,
      (err, svg) => {
        fs.unlinkSync(imagePath);
        fs.unlinkSync(processedPath);
        if (err) return res.status(500).send('Error processing image');
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svg);
      }
    );
  } catch (err) {
    console.error('Error during image processing:', err);
    fs.unlinkSync(imagePath);
    return res.status(500).send('Error processing image');
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
