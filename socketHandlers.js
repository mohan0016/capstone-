const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataDir = path.join(__dirname, '../../database');

const socketHandlers = (socket, io) => {
  // Join room for real-time updates
  socket.on('join-tracking', (data) => {
    socket.join('tracking-room');
    console.log(`Client ${socket.id} joined tracking room`);
  });

  // Handle vehicle location updates
  socket.on('update-vehicle-location', async (data) => {
    try {
      const vehicles = await fs.readJson(path.join(dataDir, 'vehicles.json'));
      const vehicleIndex = vehicles.findIndex(v => v.id === data.vehicleId);
      
      if (vehicleIndex !== -1) {
        vehicles[vehicleIndex].currentLocation = data.location;
        vehicles[vehicleIndex].lastUpdate = new Date().toISOString();
        vehicles[vehicleIndex].speed = data.speed || vehicles[vehicleIndex].speed;
        
        await fs.writeJson(path.join(dataDir, 'vehicles.json'), vehicles);
        
        // Broadcast to all clients
        io.to('tracking-room').emit('vehicle-location-updated', {
          vehicleId: data.vehicleId,
          location: data.location,
          speed: data.speed,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating vehicle location:', error);
    }
  });

  // Handle shipment status updates
  socket.on('update-shipment-status', async (data) => {
    try {
      const shipments = await fs.readJson(path.join(dataDir, 'shipments.json'));
      const shipmentIndex = shipments.findIndex(s => s.id === data.shipmentId);
      
      if (shipmentIndex !== -1) {
        shipments[shipmentIndex].status = data.status;
        shipments[shipmentIndex].trackingHistory.push({
          timestamp: new Date().toISOString(),
          status: data.status,
          location: data.location || 'Unknown'
        });
        
        await fs.writeJson(path.join(dataDir, 'shipments.json'), shipments);
        
        io.to('tracking-room').emit('shipment-status-updated', {
          shipmentId: data.shipmentId,
          status: data.status,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating shipment status:', error);
    }
  });

  // Handle alerts
  socket.on('create-alert', async (data) => {
    try {
      const alerts = await fs.readJson(path.join(dataDir, 'alerts.json'));
      const newAlert = {
        id: uuidv4(),
        type: data.type,
        severity: data.severity,
        message: data.message,
        vehicleId: data.vehicleId,
        timestamp: new Date().toISOString(),
        resolved: false
      };
      
      alerts.push(newAlert);
      await fs.writeJson(path.join(dataDir, 'alerts.json'), alerts);
      
      io.to('tracking-room').emit('new-alert', newAlert);
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
};

// Simulate real-time updates
socketHandlers.simulateRealTimeUpdates = async (io) => {
  try {
    const vehicles = await fs.readJson(path.join(dataDir, 'vehicles.json'));
    
    vehicles.forEach(async (vehicle, index) => {
      if (vehicle.status === 'active') {
        // Simulate movement
        const latChange = (Math.random() - 0.5) * 0.01;
        const lngChange = (Math.random() - 0.5) * 0.01;
        
        vehicle.currentLocation.lat += latChange;
        vehicle.currentLocation.lng += lngChange;
        vehicle.lastUpdate = new Date().toISOString();
        
        // Simulate speed changes
        vehicle.speed = Math.max(0, vehicle.speed + (Math.random() - 0.5) * 10);
        
        // Simulate fuel consumption
        vehicle.fuel = Math.max(0, vehicle.fuel - Math.random() * 0.5);
        
        // Create alerts for low fuel
        if (vehicle.fuel < 20 && Math.random() < 0.1) {
          const alerts = await fs.readJson(path.join(dataDir, 'alerts.json'));
          const newAlert = {
            id: uuidv4(),
            type: 'fuel',
            severity: 'warning',
            message: `${vehicle.name} has low fuel: ${vehicle.fuel.toFixed(1)}%`,
            vehicleId: vehicle.id,
            timestamp: new Date().toISOString(),
            resolved: false
          };
          alerts.push(newAlert);
          await fs.writeJson(path.join(dataDir, 'alerts.json'), alerts);
          
          io.to('tracking-room').emit('new-alert', newAlert);
        }
      }
    });
    
    await fs.writeJson(path.join(dataDir, 'vehicles.json'), vehicles);
    
    // Broadcast vehicle updates
    io.to('tracking-room').emit('vehicles-updated', vehicles);
    
  } catch (error) {
    console.error('Error in real-time simulation:', error);
  }
};

module.exports = socketHandlers;