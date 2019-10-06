var express = require('express');
var PatientsRouter = express.Router();
const mongoose=require('mongoose');

require("../Models/patientsModel");

let PatientsSchema = mongoose.model("patient");

PatientsRouter.get('/',(req,res,next)=>{
    res.send("Hello from PatientsRouter")
});

//Get All Patients
PatientsRouter.get('/patients',(req,res,next)=>{
    PatientsSchema.find().then(documents => {
        res.status(200).json({
          message: "Patients fetch succefully",
          patients: documents
        });
      });
});

//Get Single Patient 
PatientsRouter.get('/patient/:id',(req,res,next)=>{
    PatientsSchema.findOne({_id:req.params.id}).then(patient => {
        if (patient) {
          res.status(200).json(patient);
        } else {
          res.status(404).json({ message: "Patient not found!" });
        }
      });
});

//Find Specific Patients
PatientsRouter.get('/search/:name',(req,res,next)=>{
    PatientsSchema.find({name :{ $regex : `${req.params.name}`}}).then(patients => {
        if (patients) {
          res.status(200).json({
            message: "Patients fetch succefully",
            patients: patients
          });
        } else {
          res.status(404).json({ message: "Patient not found!" });
        }
      });
});

//Add patient
PatientsRouter.post('/patient',(req,res,next)=>{
    var patient = new PatientsSchema({
        name:req.body.name,
        description:req.body.description
    })
    if(!patient.name || !(patient.description)){
        res.status(400);
        res.json({
            "Error":"Bad Data"
        });
    }else{
        patient.save().then(createdpatient => {
            res.status(201).json({
              message: "Patient Added Successfully",
              patientId: createdpatient._id
            });
        });
    }
});

//Delete patient
PatientsRouter.delete('/patient/:id',(req,res,next)=>{
    PatientsSchema.remove({_id:req.params.id}).then(deletedpatient => {
        console.log(deletedpatient);
        res.status(200).json({ message: "Patient Deleted!" });
      });
});

//Delete All 
PatientsRouter.delete('/patients',(req,res,next)=>{
  PatientsSchema.deleteMany().then(deletedpatients => {
      console.log(deletedpatients);
      res.status(200).json({ message: "Patients Deleted!" });
    });
});

//Update patient
PatientsRouter.put('/patient/:id',(req,res,next)=>{
  var patient = req.body;
  var updpatient = {};
  
  if(patient.name){
      updpatient.name = patient.name;
  }
  
  if(patient.description){
      updpatient.description = patient.description;
  }
  
  if(!updpatient){
      res.status(400);
      res.json({
          "error":"Bad Data"
      });
  } else {
    PatientsSchema.updateOne({_id:req.params.id},patient).then(result => {
      res.status(200).json({ message: "Patient Updated Successful!" });
    });
  }
});
module.exports=PatientsRouter;