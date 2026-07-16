const express = require("express");
const WorkerProfile = require("../models/WorkerProfile");

const createWorkerProfile = async(req,res) =>{
    try {

        const worker = mongoose.create({    
            "name":String,
            "role":String,
            "experience":Number,
            "Availability":Boolean
            
        })

        
        res.status(201).json({message:"Worker Profile Created"});
        
        
    } catch (error) {
        res.status(400).json({message:error.message});
    }
}