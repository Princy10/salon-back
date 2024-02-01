const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const exampleRoutes = require('./routes/exampleRoute');

dotenv.config();

const app = express();

// ... (autres configurations)

mongoose.connect(process.env.MONGO_URL);

// Middleware
app.use(express.json());

// on init
app.get('/', (req, res) => {
    res.send('Hello')
})


// Routes
app.use('/api/examples', exampleRoutes);

// Error middleware
app.use(require('./middleware/errorMiddleware'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});