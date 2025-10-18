const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        maxlength:[100,'Name cannot exceed 100 characters'],
        unique:true
    },
    image:{
        type:String,
        required:true
    },
    date:{
        type:String,
        // type: Date,
        required:[true,'Date is required'],
    },
    time:{
        type:String,
        required:[true,'time is required'],
    },
    venue:{
        type:String,
        required:[true,'Venue is required'],
        maxlength:[100,'Name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    available: {
        type: Number,
        required:true,
        min: [0, 'Available seats cannot be negative']
    },
    total: {
        type: Number,
        required:true,
        min: [0, 'Total seats cannot be negative']
    }

});

const Concert = mongoose.model('Concert', concertSchema);

module.exports = Concert;