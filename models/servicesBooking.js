const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    username: String,
    email: String,
    officerDesignation:String,
    officerCadre:String,
    phoneNumber: String,
    applicationNo:String,
    sporti: String,
    checkIn: Date,
    checkOut: Date,
    serviceName: String,
    eventdate:String,
    serviceType: String,
    roomType:String,
    noGuests:String,
    paymentStatus: {
        type: String,
        default: 'Pending'
    },
    totalCost:String,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected'], // Add 'rejected' status
        default: 'pending',
    },
    rejectionReason: { // New field for rejection reason
        type: String,
        default: '',
    },

});

module.exports = mongoose.model('SportiServicebookings', BookingSchema);
