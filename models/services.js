const mongoose = require('mongoose');

const services = mongoose.Schema(
    {
        titre: {
            type: String,
            required: true
        },
        prix: {
            type: Number,
            required: true,
        },
        durer: {
            type: Number,
            required: true
        },
        commission: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Services = mongoose.model('Service', services);

module.exports = Services;