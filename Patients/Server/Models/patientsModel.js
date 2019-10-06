const mongoose = require('mongoose');

const PatientsSchema = new mongoose.Schema({
    name:String,
    description:String
});

module.exports = mongoose.model('patient',PatientsSchema,'Patients');