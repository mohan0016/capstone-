const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const router = express.Router();

const dataDir = path.join(__dirname, '../../database');

// Get real-time alerts
router.get('/alerts', async (req, res) => {
  try {
    const alertsFile = path.join(dataDir, 'alerts.json');
    let alerts = [];
    
    if (await fs.pathExists(alertsFile)) {
      alerts = await fs.readJson(alertsFile);
    }
    
    // Filter unresolved alerts
    const activeAlerts = alerts.filter(alert => !alert.resolved);
    
    res.json(activeAlerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Resolve alert
router.put('/alerts/:id/resolve', async (req, res) => {
  try {
    const alertsFile = path.join(dataDir, 'alerts.json');
    const alerts = await fs.readJson(alertsFile);
    
    const alertIndex = alerts.findIndex(a => a.id === req.params.id);
    if (alertIndex !== -1) {
      alerts[alertIndex].resolved = true;
      alerts[alertIndex].resolvedAt = new Date().toISOString();
      
      await fs.writeJson(alertsFile, alerts);
      res.json(alerts[alertIndex]);
    } else {
      res.status(404).json({ error: 'Alert not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
});

// Get live vehicle positions
router.get('/vehicles/positions', async (req, res) => {
  try {
    const vehicles = await fs.readJson(path.join(dataDir, 'vehicles.json'));
    
    const positions = vehicles.map(vehicle => ({
      id: vehicle.id,
      name: vehicle.name,
      type: vehicle.type,
      position: vehicle.currentLocation,
      status: vehicle.status,
      speed: vehicle.speed,
      fuel: vehicle.fuel,
      lastUpdate: vehicle.lastUpdate
    }));
    
    res.json(positions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicle positions' });
  }
});

// Get weather data (simulated)
router.get('/weather', async (req, res) => {
  try {
    const weather = {
      current: {
        temperature: Math.random() * 20 + 10, // 10-30°C
        humidity: Math.random() * 40 + 40, // 40-80%
        windSpeed: Math.random() * 20 + 5, // 5-25 km/h
        visibility: Math.random() * 5 + 5, // 5-10 km
        conditions: ['Clear', 'Cloudy', 'Light Rain', 'Fog'][Math.floor(Math.random() * 4)]
      },
      forecast: [
        { day: 'Today', high: 25, low: 15, conditions: 'Sunny' },
        { day: 'Tomorrow', high: 23, low: 12, conditions: 'Cloudy' },
        { day: 'Day 3', high: 21, low: 10, conditions: 'Light Rain' }
      ]
    };
    
    res.json(weather);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

module.exports = router;