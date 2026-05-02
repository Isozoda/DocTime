require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes             = require('./src/routes/auth.routes');
const userRoutes             = require('./src/routes/user.routes');
const doctorRoutes           = require('./src/routes/doctor.routes');
const appointmentRoutes      = require('./src/routes/appointment.routes');
const specializationRoutes   = require('./src/routes/specialization.routes');
const hospitalRoutes         = require('./src/routes/hospital.routes');
const publicRoutes           = require('./src/routes/public.routes');
const { errorHandler }  = require('./src/middlewares/error.middleware');
const { swaggerUi, specs } = require('./src/config/swagger');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (_req, res) =>
  res.json({ success: true, service: 'EasyDoc TJ API', timestamp: new Date().toISOString() })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/auth',            authRoutes);
app.use('/api/users',           userRoutes);
app.use('/api/doctors',         doctorRoutes);
app.use('/api/appointments',    appointmentRoutes);
app.use('/api/specializations', specializationRoutes);
app.use('/api/hospitals',       hospitalRoutes);
app.use('/api/public',          publicRoutes);

app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`EasyDoc TJ API is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
