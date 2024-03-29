const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const authentication = require('./routes/authRoute');
const servicesRoute = require('./routes/servicesRoute');
const gestionEmployeRoute = require('./routes/gestion_employeRoute');
const fonctionRoute = require('./routes/fonctionRoute');
const priseRdvRoute = require('./routes/priseRdvRoute');
const userRoute = require('./routes/userRoute');
const offreSpeciale = require('./routes/offreSpecialeRoute');
const notification = require('./routes/NotificationRoute');
const preferenceEmployer = require('./routes/preferenceEmplRoute');
const preferenceService = require('./routes/preferenceServRoute');
const depotRoute = require('./routes/depotRoute');
const portefeuilleRoute = require('./routes/portefeuilleRoute');
const journalCaisseRoute = require('./routes/journalCaisseRoute');
const traitementRoute = require('./routes/traitementRoute')
const statRoute = require('./routes/statRoute')

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URL);

app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "https://m1p11mean-princy-nampiana.pages.dev",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
})
app.set('io',io);

// Routes
app.use('/auth', authentication);
app.use('/services', servicesRoute);
app.use('/gestion_employe', gestionEmployeRoute);
app.use('/fonction', fonctionRoute);
app.use('/prise_rdv', priseRdvRoute);
app.use('/offre_speciale', offreSpeciale);
app.use('/notification', notification);
app.use('/user', userRoute);
app.use('/preference_employer', preferenceEmployer);
app.use('/preference_service', preferenceService);
app.use('/depot', depotRoute);
app.use('/portefeuille', portefeuilleRoute);
app.use('/journalCaisse', journalCaisseRoute);
app.use('/traitement', traitementRoute);
app.use('/stat', statRoute);

app.use(require('./middleware/errorMiddleware'));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});