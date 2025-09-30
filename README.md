# 🚛 Advanced Coal Transportation Platform

A comprehensive, interactive digital platform for multi-modal visibility and optimization of coal transportation with real-time tracking, analytics, and intelligent route optimization.

## ✨ Key Features

### 🎯 **Real-Time Tracking & Monitoring**
- Live GPS tracking of trucks and rail cars
- WebSocket-powered real-time updates
- Interactive Google Maps integration
- Automated alerts and notifications
- Weather integration for route planning

### 📊 **Advanced Analytics & Insights**
- Performance dashboards with KPIs
- Predictive analytics for maintenance
- Cost optimization analysis
- Environmental impact tracking
- Custom reporting and data visualization

### 🗺️ **Interactive Mapping**
- Custom vehicle and location markers
- Route optimization algorithms
- Geofencing and zone management
- Traffic and weather overlays
- Multi-modal transport visualization

### 🚨 **Smart Alert System**
- Real-time fuel monitoring
- Maintenance scheduling alerts
- Delivery delay notifications
- Emergency response coordination
- Customizable alert thresholds

### 📱 **Modern User Experience**
- Responsive design for all devices
- Smooth animations and transitions
- Dark/light theme support
- Intuitive navigation and controls
- Accessibility-compliant interface

## 🏗️ **Architecture**

### **Backend (Node.js/Express)**
```
backend/
├── controllers/          # Business logic controllers
├── routes/              # API route definitions
├── middleware/          # Custom middleware functions
├── models/             # Data models and schemas
├── websocket/          # Real-time communication handlers
├── utils/              # Utility functions
└── server.js           # Main server application
```

### **Frontend (React)**
```
frontend/src/
├── components/         # Reusable UI components
│   ├── common/        # Shared components (Navbar, Sidebar)
│   ├── dashboard/     # Dashboard-specific components
│   ├── map/          # Map and geolocation components
│   ├── analytics/    # Charts and data visualization
│   ├── fleet/        # Vehicle management components
│   └── shipments/    # Shipment tracking components
├── pages/             # Main application pages
├── hooks/             # Custom React hooks
├── contexts/          # React context providers
├── services/          # API service functions
└── utils/             # Utility functions
```

### **Database**
```
database/
├── vehicles.json      # Vehicle fleet data
├── shipments.json     # Shipment tracking data
├── locations.json     # Mines, plants, and hubs
├── routes.json        # Optimized route data
├── alerts.json        # System alerts and notifications
└── users.json         # User management data
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 16+ and npm
- Google Maps API key
- Modern web browser

### **Installation**

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd coal-transport-platform
   ```

2. **Install dependencies:**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd ../frontend && npm install
   ```

3. **Configure Google Maps:**
   - Get API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Replace `YOUR_GOOGLE_MAPS_API_KEY` in `frontend/src/components/map/InteractiveMap.js`

4. **Start the application:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm start
   ```

5. **Access the platform:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## 🎮 **Interactive Features**

### **Real-Time Dashboard**
- Live vehicle tracking with animated markers
- Dynamic KPI updates every 5 seconds
- Interactive charts and graphs
- Customizable time range filters
- Drag-and-drop dashboard widgets

### **Advanced Map Interface**
- Click vehicles for detailed information
- Real-time position updates
- Route visualization and optimization
- Weather overlay integration
- Custom map styling and themes

### **Fleet Management**
- Vehicle performance metrics
- Maintenance scheduling
- Driver assignment and tracking
- Fuel consumption monitoring
- Capacity utilization analysis

### **Shipment Tracking**
- End-to-end shipment visibility
- Automated status updates
- Delivery time predictions
- Exception handling and alerts
- Customer notification system

## 🔧 **API Endpoints**

### **Vehicles**
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get vehicle details
- `PUT /api/vehicles/:id/location` - Update location
- `GET /api/vehicles/:id/metrics` - Performance metrics

### **Shipments**
- `GET /api/shipments` - Get all shipments
- `POST /api/shipments` - Create new shipment
- `PUT /api/shipments/:id/status` - Update status
- `GET /api/shipments/:id/tracking` - Tracking history

### **Real-Time**
- `GET /api/realtime/alerts` - Active alerts
- `GET /api/realtime/vehicles/positions` - Live positions
- `GET /api/realtime/weather` - Weather data

### **Analytics**
- `GET /api/analytics` - Comprehensive analytics
- `GET /api/analytics/trends` - Performance trends
- `GET /api/analytics/kpis` - Key performance indicators

## 🌐 **WebSocket Events**

### **Client → Server**
- `join-tracking` - Join real-time updates
- `update-vehicle-location` - Update vehicle position
- `update-shipment-status` - Update shipment status
- `create-alert` - Create new alert

### **Server → Client**
- `vehicle-location-updated` - Vehicle moved
- `vehicles-updated` - Batch vehicle updates
- `shipment-status-updated` - Shipment status changed
- `new-alert` - New alert created

## 📊 **Technology Stack**

### **Backend Technologies**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **Helmet** - Security middleware
- **Compression** - Response compression
- **CORS** - Cross-origin resource sharing

### **Frontend Technologies**
- **React 18** - UI framework
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

### **Development Tools**
- **Nodemon** - Development server
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes
- **ESLint** - Code linting

## 🎨 **Design System**

### **Color Palette**
- **Primary**: Orange (#f97316) - Energy and movement
- **Success**: Green (#22c55e) - Positive actions
- **Warning**: Yellow (#f59e0b) - Caution states
- **Danger**: Red (#ef4444) - Critical alerts
- **Coal**: Custom gray scale for coal theme

### **Typography**
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Responsive scaling** with Tailwind utilities

### **Components**
- **Glass morphism** effects for modern UI
- **Smooth animations** with Framer Motion
- **Interactive hover states** for better UX
- **Consistent spacing** using Tailwind system

## 📈 **Performance Optimizations**

- **Code splitting** with React.lazy()
- **Image optimization** and lazy loading
- **API response caching** with service workers
- **WebSocket connection pooling**
- **Efficient re-rendering** with React.memo()
- **Bundle size optimization** with tree shaking

## 🔒 **Security Features**

- **Helmet.js** for security headers
- **CORS** configuration for API access
- **Input validation** and sanitization
- **Rate limiting** for API endpoints
- **Secure WebSocket** connections
- **Environment variable** protection

## 🌍 **Environmental Impact**

- **Carbon footprint tracking** for each shipment
- **Fuel efficiency monitoring** and optimization
- **Route optimization** to reduce emissions
- **Sustainability reporting** and analytics
- **Green transportation** recommendations

## 📱 **Mobile Responsiveness**

- **Responsive design** for all screen sizes
- **Touch-friendly** interface elements
- **Mobile-optimized** map interactions
- **Progressive Web App** capabilities
- **Offline functionality** for critical features

## 🔮 **Future Enhancements**

- **AI-powered route optimization**
- **Predictive maintenance algorithms**
- **Blockchain-based shipment verification**
- **IoT sensor integration**
- **Advanced weather prediction**
- **Autonomous vehicle support**

## 📞 **Support & Documentation**

- **API Documentation**: Available at `/api/docs`
- **User Manual**: Comprehensive guides in `/docs`
- **Video Tutorials**: Step-by-step walkthroughs
- **Community Forum**: User discussions and support
- **24/7 Technical Support**: Enterprise customers

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the coal transportation industry**