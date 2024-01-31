const mongoose = require('mongoose');

const example = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Enter a name"]
        },
        quantity: {
            type: Number,
            required: true,
            defeault: 0
        },
        price: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Example = mongoose.model('Example', example);

module.exports = Example;