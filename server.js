const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

// Import routes
const shipmentRoutes = require('./routes/shipments');
const vehicleRoutes = require('./routes/vehicles');
const locationRoutes = require('./routes/locations');
const analyticsRoutes = require('./routes/analytics');
const realTimeRoutes = require('./routes/realtime');

// Import WebSocket handlers
const socketHandlers = require('./websocket/socketHandlers');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize data
const initializeData = async () => {
  const dataDir = path.join(__dirname, '../database');
  await fs.ensureDir(dataDir);
  
  // Initialize all data files
  const files = ['shipments.json', 'vehicles.json', 'locations.json', 'routes.json', 'alerts.json', 'users.json'];
  
  for (const file of files) {
    const filePath = path.join(dataDir, file);
    if (!await fs.pathExists(filePath)) {
      await fs.writeJson(filePath, []);
    }
  }

  // Add sample data
  await initializeSampleData(dataDir);
};

const initializeSampleData = async (dataDir) => {
  // Sample vehicles with real-time tracking
  const vehicles = [
    {
      id: 'truck-001',
      name: 'Coal Hauler Alpha',
      type: 'truck',
      capacity: 35000,
      currentLocation: { lat: 40.7128, lng: -74.0060 },
      status: 'active',
      driver: 'John Smith',
      fuel: 85,
      speed: 65,
      route: 'Route-A1',
      lastUpdate: new Date().toISOString(),
      maintenance: { nextDue: '2024-02-15', status: 'good' }
    },
    {
      id: 'rail-001',
      name: 'Coal Express 1',
      type: 'rail',
      capacity: 120000,
      currentLocation: { lat: 41.8781, lng: -87.6298 },
      status: 'active',
      driver: 'Mike Johnson',
      fuel: 92,
      speed: 45,
      route: 'Rail-R1',
      lastUpdate: new Date().toISOString(),
      maintenance: { nextDue: '2024-03-01', status: 'excellent' }
    },
    {
      id: 'truck-002',
      name: 'Heavy Duty Beta',
      type: 'truck',
      capacity: 40000,
      currentLocation: { lat: 39.7392, lng: -104.9903 },
      status: 'loading',
      driver: 'Sarah Wilson',
      fuel: 78,
      speed: 0,
      route: 'Route-B2',
      lastUpdate: new Date().toISOString(),
      maintenance: { nextDue: '2024-01-30', status: 'needs_attention' }
    }
  ];

  // Sample locations with detailed info
  const locations = [
    {
      id: 'mine-001',
      name: 'Black Diamond Mine',
      type: 'mine',
      coordinates: { lat: 39.7392, lng: -104.9903 },
      capacity: 500000,
      currentStock: 350000,
      dailyProduction: 2500,
      operationalHours: '24/7',
      contact: { manager: 'Robert Brown', phone: '+1-555-0101' },
      facilities: ['loading_dock', 'weighing_station', 'quality_control']
    },
    {
      id: 'plant-001',
      name: 'Metro Power Plant',
      type: 'plant',
      coordinates: { lat: 41.8781, lng: -87.6298 },
      capacity: 200000,
      currentStock: 45000,
      dailyConsumption: 1800,
      operationalHours: '24/7',
      contact: { manager: 'Lisa Davis', phone: '+1-555-0102' },
      facilities: ['unloading_dock', 'storage_silos', 'conveyor_system']
    },
    {
      id: 'hub-001',
      name: 'Central Distribution Hub',
      type: 'hub',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      capacity: 150000,
      currentStock: 75000,
      throughput: 3000,
      operationalHours: '6:00-22:00',
      contact: { manager: 'Tom Anderson', phone: '+1-555-0103' },
      facilities: ['rail_terminal', 'truck_loading', 'storage_yard']
    }
  ];

  // Sample shipments with tracking
  const shipments = [
    {
      id: 'ship-001',
      origin: 'Black Diamond Mine',
      destination: 'Metro Power Plant',
      quantity: 25000,
      priority: 'high',
      status: 'in-transit',
      vehicleId: 'truck-001',
      scheduledDate: '2024-01-20',
      estimatedArrival: '2024-01-20T14:30:00Z',
      createdAt: new Date().toISOString(),
      trackingHistory: [
        { timestamp: new Date().toISOString(), status: 'created', location: 'Black Diamond Mine' },
        { timestamp: new Date().toISOString(), status: 'loaded', location: 'Black Diamond Mine' },
        { timestamp: new Date().toISOString(), status: 'departed', location: 'Black Diamond Mine' }
      ]
    }
  ];

  await fs.writeJson(path.join(dataDir, 'vehicles.json'), vehicles);
  await fs.writeJson(path.join(dataDir, 'locations.json'), locations);
  await fs.writeJson(path.join(dataDir, 'shipments.json'), shipments);
};

// Routes
app.use('/api/shipments', shipmentRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/realtime', realTimeRoutes);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socketHandlers(socket, io);
});

// Real-time data simulation
setInterval(() => {
  // Simulate vehicle movement and updates
  socketHandlers.simulateRealTimeUpdates(io);
}, 5000);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize and start server
initializeData().then(() => {
  server.listen(PORT, () => {
    console.log(`🚛 Coal Transport Platform API running on port ${PORT}`);
    console.log(`📡 WebSocket server ready for real-time updates`);
  });
});