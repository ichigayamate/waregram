const express = require('express');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// Set EJS as templating engine
app.set('view engine', 'ejs');

const clientRoutes = require('./routes/client-route');
app.use('/', clientRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
