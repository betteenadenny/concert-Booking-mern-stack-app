const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    concert: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Concert", 
        required: true,
    },
    tickets:{
        type:Number,
        required:true,
        min:1
    }, 
    totalPrice: {
        type: Number,
        required: true,
    },
    bookingDate: {
        type: Date,
        default: Date.now,
    },
});

const Booking = mongoose.model("Booking",bookingSchema);

module.exports = Booking;