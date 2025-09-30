const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const router = express.Router();

const dataDir = path.join(__dirname, '../../database');
const locationsFile = path.join(dataDir, 'locations.json');

// Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await fs.readJson(locationsFile);
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Get location by ID
router.get('/:id', async (req, res) => {
  try {
    const locations = await fs.readJson(locationsFile);
    const location = locations.find(l => l.id === req.params.id);
    
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch location' });
  }
});

// Update location stock
router.put('/:id/stock', async (req, res) => {
  try {
    const locations = await fs.readJson(locationsFile);
    const locationIndex = locations.findIndex(l => l.id === req.params.id);
    
    if (locationIndex === -1) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    locations[locationIndex].currentStock = req.body.stock;
    locations[locationIndex].lastUpdate = new Date().toISOString();
    
    await fs.writeJson(locationsFile, locations);
    res.json(locations[locationIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update location stock' });
  }
});

// Get location capacity utilization
router.get('/:id/utilization', async (req, res) => {
  try {
    const locations = await fs.readJson(locationsFile);
    const location = locations.find(l => l.id === req.params.id);
    
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    const utilization = {
      current: location.currentStock,
      capacity: location.capacity,
      percentage: (location.currentStock / location.capacity * 100).toFixed(1),
      available: location.capacity - location.currentStock,
      status: location.currentStock / location.capacity > 0.9 ? 'critical' :
              location.currentStock / location.capacity > 0.7 ? 'warning' : 'normal'
    };
    
    res.json(utilization);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate utilization' });
  }
});

module.exports = router;