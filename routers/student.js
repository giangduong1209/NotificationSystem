const express = require('express')
const Router = express.Router()
const parser = require('parser')
const AccountStudent = require('../models/AccountStudentModel')
const ObjectID = require('mongodb').ObjectID;
const app = express()
app.set('view engine','ejs')
Router.post('/update',(req,res)=>{
    let result=''
    req.on('data',d=>result+=d.toString())

    req.on('end',()=>{
        data = JSON.parse(result)
        AccountStudent.findOneAndUpdate(data['emailStu'], data, {
            new: true
        })

        .then(p =>{
            if(p){
                return console.log({data: p})
            }
            else return console.log("Error")
        })
    })
    return res.render('studentInterface',{data})
})

module.exports = Router

