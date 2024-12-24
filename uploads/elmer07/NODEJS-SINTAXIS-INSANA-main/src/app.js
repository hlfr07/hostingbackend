const express = require('express');
const path = require('path');
const session = require('express-session');
const homeRoutes = require('./routes/homeRoutes');
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const cajeroRoutes = require('./routes/cajeroRoutes');

const app = express();
const PORT = 2000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'tu-secreto-seguro',
  resave: false,
  saveUninitialized: false
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/menu', menuRoutes);
app.use('/cajero', cajeroRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});