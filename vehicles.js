const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const router = express.Router();

const dataDir = path.join(__dirname, '../../database');
const vehiclesFile = path.join(dataDir, 'vehicles.json');

// Get all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await fs.readJson(vehiclesFile);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Get vehicle by ID
router.get('/:id', async (req, res) => {
  try {
    const vehicles = await fs.readJson(vehiclesFile);
    const vehicle = vehicles.find(v => v.id === req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

// Update vehicle location
router.put('/:id/location', async (req, res) => {
  try {
    const vehicles = await fs.readJson(vehiclesFile);
    const vehicleIndex = vehicles.findIndex(v => v.id === req.params.id);
    
    if (vehicleIndex === -1) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    vehicles[vehicleIndex].currentLocation = req.body.location;
    vehicles[vehicleIndex].lastUpdate = new Date().toISOString();
    
    await fs.writeJson(vehiclesFile, vehicles);
    res.json(vehicles[vehicleIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update vehicle location' });
  }
});

// Update vehicle status
router.put('/:id/status', async (req, res) => {
  try {
    const vehicles = await fs.readJson(vehiclesFile);
    const vehicleIndex = vehicles.findIndex(v => v.id === req.params.id);
    
    if (vehicleIndex === -1) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    vehicles[vehicleIndex].status = req.body.status;
    vehicles[vehicleIndex].lastUpdate = new Date().toISOString();
    
    await fs.writeJson(vehiclesFile, vehicles);
    res.json(vehicles[vehicleIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update vehicle status' });
  }
});

// Get vehicle performance metrics
router.get('/:id/metrics', async (req, res) => {
  try {
    const vehicles = await fs.readJson(vehiclesFile);
    const vehicle = vehicles.find(v => v.id === req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    // Calculate performance metrics
    const metrics = {
      efficiency: Math.random() * 20 + 80, // 80-100%
      fuelConsumption: Math.random() * 5 + 15, // 15-20 L/100km
      averageSpeed: Math.random() * 20 + 50, // 50-70 km/h
      uptime: Math.random() * 10 + 90, // 90-100%
      maintenanceScore: vehicle.maintenance.status === 'excellent' ? 95 : 
                       vehicle.maintenance.status === 'good' ? 85 : 65
    };
    
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicle metrics' });
  }
});

module.exports = router;