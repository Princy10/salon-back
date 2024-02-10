const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authentication = require('./routes/authRoute');
const servicesRoute = require('./routes/servicesRoute');
const gestionEmployeRoute = require('./routes/gestion_employeRoute');
const fonctionRoute = require('./routes/fonctionRoute');

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URL);

app.use(express.json());
app.use(cors());

// on init
// app.get('/', (req, res) => {
//     res.send('Hello')
// })

// Routes
app.use('/auth', authentication);
app.use('/services', servicesRoute);
app.use('/gestion_employe', gestionEmployeRoute);
app.use('/fonction', fonctionRoute);

app.use(require('./middleware/errorMiddleware'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});