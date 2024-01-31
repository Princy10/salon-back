require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const exampleRoute = require('./routes/exampleRoute');
const errorMiddleware = require('./middleware/errorMiddleware');
var cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000
const MONGO_URL = process.env.MONGO_URL
const FRONTEND = process.env.FRONTEND

var corsOptions = {
    origin: FRONTEND,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//on init
app.get('/', (req, res) => {
    res.send('Hello')
})

// default API route
app.use('/api/examples', exampleRoute)

// app.get('/examples', async(req, res) => {
//     try {
//         const examples = await Example.find({});
//         res.status(200).json(examples);
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// })

// app.get('/example/:id', async(req, res) => {
//     try {
//         const {id} = req.params;
//         const example = await Example.findById(id);
//         res.status(200).json(example);
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// })

// app.put('/example/:id', async(req, res) => {
//     try {
//         const {id} = req.params;
//         const example = await Example.findByIdAndUpdate(id, req.body);

//         if (!example) {
//             return res.status(404).json({message: `cannot find with ID ${id}`})
//         }
//         const updateExample = await Example.findById(id);
//         res.status(200).json(updateExample);
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// })

// app.delete('/example/:id', async(req, res) => {
//     try {
//         const {id} = req.params;
//         const example = await Example.findByIdAndDelete(id);

//         if (!example) {
//             return res.status(404).json({message: `cannot find with ID ${id}`})
//         }
//         res.status(200).json(example);
//     } catch (error) {
//         res.status(500).json({message: error.message})
//     }
// })

// app.post('/example', async(req,res) => {
//     try {
//         const example = await Example.create(req.body)
//         res.status(200).json(example)
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({message: error.message})
//     }
// })

app.use(errorMiddleware);

mongoose.set("strictQuery", false);
mongoose.connect(MONGO_URL).then(() => {
    console.log('Mongo connected');

    app.listen(3000, () => {
        console.log(`Node API app is running on port ${PORT}`)
    });
}).catch((error) => {
    console.log(error)
})