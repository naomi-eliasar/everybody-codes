const express = require('express');
const path = require('path');
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const cors = require('cors');

const app = express();
app.use(cors()); // if frontend runs from another server/origin

const csvFilePath = path.join(__dirname, '..', '..', 'data', 'cameras-defb.csv');

function loadCameras() {
  if (!fs.existsSync(csvFilePath)) {
    throw new Error(`CSV path not found: ${csvFilePath}`);
  }

  const text = fs.readFileSync(csvFilePath, 'utf8');
  
  // filter out error lines
  const cleanCsv = text
    .split(/\r?\n/)
    .filter(l => l.trim().length > 0 && !l.startsWith('ERROR'))
    .join('\n');

  const records = parse(cleanCsv, {
    columns: true,
    delimiter: ';',
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
    skip_lines_with_error: true,
  });
  return records
    .filter(r => r.Camera && r.Latitude && r.Longitude)
    .map(r => ({
    name: r.Camera,
    lat: parseFloat(r.Latitude),
    lon: parseFloat(r.Longitude),
  }));
}

app.get('/', (req, res) => {
  try {
    const cameras = loadCameras();
    res.json(cameras);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot read camera CSV' });
  }
});

app.get('/:id', (req, res) => {
  const id = req.params.id;
  const cameras = loadCameras();
  const camera = cameras.find(c => c.name === id || c.name.includes(id));
  if (!camera) return res.status(404).json({ error: 'Not found' });
  res.json(camera);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));