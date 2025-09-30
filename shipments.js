const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const dataDir = path.join(__dirname, '../../database');
const shipmentsFile = path.join(dataDir, 'shipments.json');

// Get all shipments
router.get('/', async (req, res) => {
  try {
    const shipments = await fs.readJson(shipmentsFile);
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
});

// Create new shipment
router.post('/', async (req, res) => {
  try {
    const shipments = await fs.readJson(shipmentsFile);
    const newShipment = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString(),
      status: 'pending',
      trackingHistory: [{
        timestamp: new Date().toISOString(),
        status: 'created',
        location: req.body.origin
      }]
    };
    
    shipments.push(newShipment);
    await fs.writeJson(shipmentsFile, shipments);
    res.status(201).json(newShipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create shipment' });
  }
});

// Get shipment by ID
router.get('/:id', async (req, res) => {
  try {
    const shipments = await fs.readJson(shipmentsFile);
    const shipment = shipments.find(s => s.id === req.params.id);
    
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shipment' });
  }
});

// Update shipment status
router.put('/:id/status', async (req, res) => {
  try {
    const shipments = await fs.readJson(shipmentsFile);
    const shipmentIndex = shipments.findIndex(s => s.id === req.params.id);
    
    if (shipmentIndex === -1) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    
    shipments[shipmentIndex].status = req.body.status;
    shipments[shipmentIndex].trackingHistory.push({
      timestamp: new Date().toISOString(),
      status: req.body.status,
      location: req.body.location || 'Unknown'
    });
    
    await fs.writeJson(shipmentsFile, shipments);
    res.json(shipments[shipmentIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update shipment status' });
  }
});

// Get shipment tracking history
router.get('/:id/tracking', async (req, res) => {
  try {
    const shipments = await fs.readJson(shipmentsFile);
    const shipment = shipments.find(s => s.id === req.params.id);
    
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    
    res.json(shipment.trackingHistory || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tracking history' });
  }
});

// Optimize route for shipment
router.post('/:id/optimize-route', async (req, res) => {
  try {
    const shipments = await fs.readJson(shipmentsFile);
    const shipment = shipments.find(s => s.id === req.params.id);
    
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    
    // Simulate route optimization
    const optimizedRoute = {
      distance: Math.random() * 200 + 100, // 100-300 km
      estimatedTime: Math.random() * 4 + 2, // 2-6 hours
      fuelCost: Math.random() * 100 + 50, // $50-150
      waypoints: [
        { name: shipment.origin, coordinates: { lat: 40.7128, lng: -74.0060 } },
        { name: 'Checkpoint Alpha', coordinates: { lat: 40.8128, lng: -74.1060 } },
        { name: shipment.destination, coordinates: { lat: 41.8781, lng: -87.6298 } }
      ]
    };
    
    res.json(optimizedRoute);
  } catch (error) {
    res.status(500).json({ error: 'Failed to optimize route' });
  }
});

module.exports = router;