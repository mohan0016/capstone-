const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const router = express.Router();

const dataDir = path.join(__dirname, '../../database');

// Get comprehensive analytics
router.get('/', async (req, res) => {
  try {
    const [shipments, vehicles, locations] = await Promise.all([
      fs.readJson(path.join(dataDir, 'shipments.json')),
      fs.readJson(path.join(dataDir, 'vehicles.json')),
      fs.readJson(path.join(dataDir, 'locations.json'))
    ]);
    
    const analytics = {
      overview: {
        totalShipments: shipments.length,
        activeVehicles: vehicles.filter(v => v.status === 'active').length,
        totalLocations: locations.length,
        totalCapacity: vehicles.reduce((sum, v) => sum + v.capacity, 0)
      },
      shipments: {
        pending: shipments.filter(s => s.status === 'pending').length,
        inTransit: shipments.filter(s => s.status === 'in-transit').length,
        completed: shipments.filter(s => s.status === 'completed').length,
        cancelled: shipments.filter(s => s.status === 'cancelled').length
      },
      vehicles: {
        trucks: vehicles.filter(v => v.type === 'truck').length,
        railCars: vehicles.filter(v => v.type === 'rail').length,
        active: vehicles.filter(v => v.status === 'active').length,
        maintenance: vehicles.filter(v => v.status === 'maintenance').length
      },
      performance: {
        averageDeliveryTime: 2.3,
        onTimeDeliveryRate: 94.2,
        fuelEfficiency: 87.5,
        costPerTonMile: 2.45
      }
    };
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get performance trends
router.get('/trends', async (req, res) => {
  try {
    const trends = {
      shipmentVolume: [
        { month: 'Jan', value: 145 },
        { month: 'Feb', value: 162 },
        { month: 'Mar', value: 158 },
        { month: 'Apr', value: 171 },
        { month: 'May', value: 165 },
        { month: 'Jun', value: 189 }
      ],
      efficiency: [
        { month: 'Jan', value: 85.2 },
        { month: 'Feb', value: 87.1 },
        { month: 'Mar', value: 86.8 },
        { month: 'Apr', value: 88.5 },
        { month: 'May', value: 87.9 },
        { month: 'Jun', value: 89.3 }
      ],
      costs: [
        { month: 'Jan', value: 2.52 },
        { month: 'Feb', value: 2.48 },
        { month: 'Mar', value: 2.51 },
        { month: 'Apr', value: 2.45 },
        { month: 'May', value: 2.47 },
        { month: 'Jun', value: 2.43 }
      ]
    };
    
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

// Get real-time KPIs
router.get('/kpis', async (req, res) => {
  try {
    const vehicles = await fs.readJson(path.join(dataDir, 'vehicles.json'));
    
    const kpis = {
      fleetUtilization: Math.random() * 20 + 75, // 75-95%
      averageFuelLevel: vehicles.reduce((sum, v) => sum + v.fuel, 0) / vehicles.length,
      activeRoutes: vehicles.filter(v => v.status === 'active').length,
      alertsCount: Math.floor(Math.random() * 5),
      totalDistance: Math.random() * 1000 + 5000, // 5000-6000 km today
      co2Emissions: Math.random() * 50 + 200 // 200-250 tons today
    };
    
    res.json(kpis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch KPIs' });
  }
});

module.exports = router;